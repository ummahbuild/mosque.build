"use client";

import {useEffect,useRef,useState} from "react";
import {createOriginalRecordsArchive,createProjectPackage,PROJECT_PACKAGE_MAX_BYTES,projectSections,restoreProjectPackageSafely,serializeProjectPackage,snapshotProjectSections,validateProjectPackage,type ProjectPackage,type ProjectRestoreSnapshot} from "@/lib/project-package";
import {safeProjectDraft} from "@/lib/project-draft";
import {safeActionDeskPlan} from "@/lib/action-desk";
import "./project-data-manager.css";

type Preview={fileName:string;data:ProjectPackage;warnings:string[];snapshot:ProjectRestoreSnapshot};
function downloadText(text:string,kind:string){
  const url=URL.createObjectURL(new Blob([text],{type:"application/json"})),anchor=document.createElement("a");
  anchor.href=url;anchor.download=`mosque-build-${kind}-${new Date().toISOString().slice(0,10)}.json`;
  document.body.append(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function errorText(error:unknown,fallback:string){return error instanceof Error?error.message:fallback}

export function ProjectDataManager(){
  const inputRef=useRef<HTMLInputElement>(null),chooseRef=useRef<HTMLButtonElement>(null),previewRef=useRef<HTMLDivElement>(null),request=useRef(0),restoring=useRef(false);
  const [privacy,setPrivacy]=useState<ProjectPackage["privacy"]>("full-local-backup"),[preview,setPreview]=useState<Preview|null>(null),[message,setMessage]=useState(""),[errors,setErrors]=useState<string[]>([]),[busy,setBusy]=useState(false),[restored,setRestored]=useState(false),[existingCount,setExistingCount]=useState(0),[storageAvailable,setStorageAvailable]=useState(false);
  useEffect(()=>{
    const update=()=>{try{setExistingCount([...snapshotProjectSections(key=>localStorage.getItem(key)).values()].filter(raw=>raw!==null).length);setStorageAvailable(true)}catch{setStorageAvailable(false);setErrors(["Browser storage is unavailable. Allow storage for this site to export or restore your project."])}};
    update();window.addEventListener("mosque-build:project-change",update);window.addEventListener("storage",update);
    return()=>{request.current++;window.removeEventListener("mosque-build:project-change",update);window.removeEventListener("storage",update)};
  },[]);
  useEffect(()=>{if(preview)previewRef.current?.focus()},[preview]);
  function exportProject(){
    try{const data=createProjectPackage(key=>localStorage.getItem(key),privacy);downloadText(serializeProjectPackage(data),"project");setMessage(`Download requested for ${Object.keys(data.sections).length} project sections. Check your downloads and keep the file private.`);setErrors([])}
    catch(error){setMessage("");setErrors([errorText(error,"The project could not be exported. Download original records for recovery.")])}
  }
  function downloadOriginals(snapshot?:ProjectRestoreSnapshot){
    try{const archive=createOriginalRecordsArchive(snapshot??snapshotProjectSections(key=>localStorage.getItem(key)));downloadText(JSON.stringify(archive),"original-records-private");setMessage("Original-records download requested. Keep this private recovery archive; it needs repair before it can be imported as a project package.");setErrors([])}
    catch{setErrors(["Original records could not be read or downloaded. Your saved project has not changed."]);setMessage("")}
  }
  async function chooseFile(file:File|undefined){
    const token=++request.current;setPreview(null);setErrors([]);setMessage("");setBusy(false);
    if(!file||restoring.current)return;
    if(file.size>PROJECT_PACKAGE_MAX_BYTES){setErrors(["That file is larger than the 2 MB project-package limit."]);if(inputRef.current)inputRef.current.value="";return}
    setBusy(true);
    try{
      const text=await file.text();if(token!==request.current)return;
      const result=validateProjectPackage(JSON.parse(text));
      if(!result.ok){setErrors(result.errors);return}
      if("brief" in result.data.sections&&!safeProjectDraft(result.data.sections.brief)){setErrors(["The project brief contains unsupported fields or an unreadable version. Repair it before importing. Your saved project has not changed."]);return}
      if("projectActionPlan" in result.data.sections&&!safeActionDeskPlan(result.data.sections.projectActionPlan)){setErrors(["The action plan has unsupported fields, dates or a newer version. Your saved project is unchanged."]);return}
      let snapshot:ProjectRestoreSnapshot;
      try{snapshot=snapshotProjectSections(key=>localStorage.getItem(key),result.data)}catch{setErrors(["Your current project could not be read. Restore is blocked until browser storage is available."]);return}
      setPreview({fileName:file.name,data:result.data,warnings:result.warnings,snapshot});
    }catch{if(token===request.current)setErrors(["The selected file could not be read as JSON. Choose a readable project backup and try again."])}
    finally{if(token===request.current){setBusy(false);if(inputRef.current)inputRef.current.value=""}}
  }
  function restore(){
    if(!preview||restoring.current)return;restoring.current=true;
    try{const count=restoreProjectPackageSafely(preview.data,localStorage,preview.snapshot);setRestored(true);setPreview(null);setErrors([]);setMessage(`${count} project sections restored. Reloading the workspace…`);window.dispatchEvent(new Event("mosque-build:project-change"));window.setTimeout(()=>window.location.reload(),500)}
    catch(error){restoring.current=false;setErrors([errorText(error,"The project could not be restored. Check browser storage and try again.")]);setMessage("")}
  }
  const included=preview?projectSections.filter(section=>Object.hasOwn(preview.data.sections,section.id)):[];
  return <section className="projectDataManager" aria-labelledby="project-data-title" aria-busy={busy||restored}>
    <header><div><div className="eyebrow dark">BACKUP + HANDOFF</div><h2 id="project-data-title">Keep the whole project portable.</h2><p>Download saved planning records, or review a backup before restoring its sections into this browser.</p></div><div className="dataCount"><strong>{storageAvailable?existingCount:"—"}</strong><span>{storageAvailable?`saved ${existingCount===1?"section":"sections"} detected`:"storage unavailable"}</span></div></header>
    <div className="dataManagerGrid"><section><h3>Export project</h3><fieldset disabled={restored}><legend>Choose what to include</legend>
      <label><input type="radio" name="export-privacy" checked={privacy==="full-local-backup"} onChange={()=>setPrivacy("full-local-backup")}/><span><b>Full local backup</b><small>Preserves your saved fields. May contain personal information. Store privately.</small></span></label>
      <label><input type="radio" name="export-privacy" checked={privacy==="share-safe"} onChange={()=>setPrivacy("share-safe")}/><span><b>Brief-redacted copy</b><small>Removes selected contact, owner, location and notes fields from the brief only. Other sections and project names are not anonymized.</small></span></label>
    </fieldset><button className="button" type="button" onClick={exportProject} disabled={!storageAvailable||!existingCount||restored}>Export {existingCount} project {existingCount===1?"section":"sections"}</button>{storageAvailable&&!existingCount?<p className="emptyExport">Save a planning step first. There are no project records to export yet.</p>:null}<small>Review the entire file before sharing. Maximum package size: 2 MB.</small></section>
    <section><h3>Restore project</h3><p>Select a mosque.build project package. Nothing changes until you confirm the included sections.</p><input ref={inputRef} id="project-package-file" aria-label="Project package file" className="srOnly" type="file" accept="application/json,.json" disabled={busy||restored} onChange={event=>void chooseFile(event.target.files?.[0])}/><button ref={chooseRef} className="secondaryButton" type="button" onClick={()=>inputRef.current?.click()} disabled={busy||restored||!storageAvailable}>{busy?"Checking package…":"Choose project package"}</button><small>Maximum file size: 2 MB · JSON only</small></section></div>
    {errors.length?<div className="dataMessage error" role="alert"><b>Action could not be completed</b><ul>{errors.map(error=><li key={error}>{error}</li>)}</ul></div>:null}
    {preview?<div ref={previewRef} className="importPreview" tabIndex={-1} aria-labelledby="package-preview-title"><div><small>REVIEW BEFORE RESTORING</small><h3 id="package-preview-title">{preview.fileName}</h3><p>{included.length} included sections · exported {new Date(preview.data.exportedAt).toLocaleString()}</p><p>{preview.data.privacy==="share-safe"?"Brief-redacted copy":"Full local backup"}</p>{preview.warnings.map(warning=><p className="importWarning" key={warning}>{warning}</p>)}<p>All sections absent from this file stay untouched. Restoring a brief-redacted copy replaces the included brief, including its blank fields.</p></div>
      <ul aria-label="Sections to restore">{included.map(section=><li key={section.id} data-included="true"><span>{section.label}</span><b>{preview.snapshot.get(section.key)===null?"Add":"Replace"}</b></li>)}</ul>
      <div><button className="secondaryButton" type="button" onClick={()=>downloadOriginals(preview.snapshot)}>Download originals before replacing</button><button className="secondaryButton" type="button" onClick={()=>{setPreview(null);setErrors([]);chooseRef.current?.focus()}}>Cancel</button><button className="button" type="button" onClick={restore}>Restore {included.length} included {included.length===1?"section":"sections"}</button><small>Replaces only the sections named here. The originals download is a private recovery archive, not a ready-to-import package. Nothing is uploaded.</small></div></div>:null}
    {message?<p className="dataMessage success" role="status" aria-live="polite">{message}</p>:null}
    <details className="recoveryArchive"><summary>Recover unreadable or oversized saved records</summary><p>Download the original saved text without skipping unreadable sections. This private archive is for manual recovery; it cannot be restored here until repaired and converted to a project package. It may exceed the package size limit.</p><button className="secondaryButton" type="button" disabled={!storageAvailable||!existingCount||restored} onClick={()=>downloadOriginals()}>Download original saved records</button></details>
    <footer><b>Project package boundary</b><p>Includes supported planning sections saved in this browser. Browser preferences, recovery slots and unsaved edits are not included. This is not cloud backup, an authority submission or a tamper-proof audit log.</p></footer>
  </section>;
}
