"use client";

import {useEffect,useRef,useState} from "react";
import {createDraftImportReader,newProjectDraft,type DraftFileReview,type ProjectDraft} from "@/lib/project-draft";
import "./project-draft-recovery.css";

export function ProjectDraftRecovery({raw,error,onRetry,onReplace}:{raw:string|null;error:string;onRetry:()=>void;onReplace:(draft:ProjectDraft)=>void}) {
  const [confirmed,setConfirmed]=useState(false),[fileError,setFileError]=useState("");
  const [pending,setPending]=useState<Extract<DraftFileReview,{kind:"ready"}>|null>(null),[reading,setReading]=useState(false);
  const reader=useRef(createDraftImportReader()),previewHeading=useRef<HTMLHeadingElement>(null),fileInput=useRef<HTMLInputElement>(null);
  const cancelReview=()=>{reader.current.cancel();setPending(null);setReading(false);setFileError("");};
  useEffect(()=>{const current=reader.current;return()=>current.cancel();},[]);
  useEffect(()=>{if(pending)previewHeading.current?.focus();},[pending]);
  const download=()=>{
    if(raw===null)return;
    const url=URL.createObjectURL(new Blob([raw],{type:"text/plain;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="mosque-build-original-draft.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <section className="draftRecovery" aria-labelledby="draft-recovery-title">
    <h2 id="draft-recovery-title">Recover your project brief</h2>
    <p role="alert">We could not safely open the saved brief. It has not been changed. Editing and automatic saving are paused to protect your work.</p>
    {error&&<p role="alert">{error}</p>}
    <p>Download the original before making changes. You can repair it locally or restore a previously exported structured brief. The file may contain private project details; share it only with someone you trust.</p>
    <div className="draftRecoveryActions"><button type="button" className="secondaryButton" disabled={raw===null} onClick={download}>Download original saved draft</button><button type="button" className="secondaryButton" onClick={()=>{cancelReview();onRetry();}}>Try opening again</button></div>
    <label className="draftRecoveryConsent"><input type="checkbox" checked={confirmed} onChange={e=>{setConfirmed(e.target.checked);cancelReview();}}/>I want to replace this brief. Keep a recovery copy of the original on this device.</label>
    <label>Choose a repaired draft or structured brief
      <input ref={fileInput} type="file" disabled={!confirmed} aria-describedby="draft-file-help" accept=".json,.txt,application/json,text/plain" onChange={async event=>{
        const file=event.target.files?.[0];event.target.value="";if(!file)return;
        setFileError("");setPending(null);setReading(true);
        const result=await reader.current.read(file);if(!result)return;
        setReading(false);if(result.kind==="ready")setPending(result);else setFileError(result.message);
      }}/>
    </label>
    <p id="draft-file-help">Choosing a file only opens a preview. Your saved brief changes only when you select Restore reviewed brief. JSON or text files, up to 500 KB.</p>
    {reading&&<div role="status"><p>Reading your selected brief…</p><button type="button" className="secondaryButton" onClick={()=>{cancelReview();fileInput.current?.focus();}}>Cancel file review</button></div>}
    {pending&&<section className="draftRecoveryPreview" aria-labelledby="draft-preview-title">
      <h3 id="draft-preview-title" ref={previewHeading} tabIndex={-1}>Review the replacement brief</h3>
      <p>File: <strong>{pending.fileName}</strong></p>
      <dl><div><dt>Project</dt><dd>{pending.draft.name||"Not recorded"}</dd></div><div><dt>Location</dt><dd>{pending.draft.location||"Not recorded"}</dd></div><div><dt>Project type</dt><dd>{pending.draft.type}</dd></div><div><dt>Attendance</dt><dd>{pending.draft.attendance||"Not recorded"}</dd></div><div><dt>Working budget</dt><dd>{pending.draft.budget?`${pending.draft.currency||"Currency not recorded"} · ${pending.draft.budget}`:"Not recorded"}</dd></div><div><dt>Programs and spaces</dt><dd>{pending.draft.needs.join(", ")||"None selected"}</dd></div></dl>
      <details><summary>Review all fields in this file</summary><pre tabIndex={0} role="region" aria-label="Complete replacement brief">{JSON.stringify(pending.draft,null,2)}</pre></details>
      <p>Restoring replaces this project brief and keeps an exact recovery copy of the saved original. Drawings and other planning records stay unchanged.</p>
      <div className="draftRecoveryActions"><button type="button" className="button" onClick={()=>onReplace(pending.draft)}>Restore reviewed brief</button><button type="button" className="secondaryButton" onClick={()=>{cancelReview();fileInput.current?.focus();}}>Cancel file review</button></div>
    </section>}
    {!confirmed&&<p>Select the confirmation above to enable restoring or starting a new brief.</p>}
    {fileError&&<p role="alert">{fileError}</p>}
    <button type="button" className="secondaryButton" disabled={!confirmed||reading||!!pending} aria-describedby={reading||pending?"draft-new-help":undefined} onClick={()=>onReplace(newProjectDraft())}>Start a new brief with recovery copy</button>
    {(reading||pending)&&<p id="draft-new-help">Cancel the file review before starting a new brief.</p>}
    <p>Other project drawings and planning records will not be reset.</p>
  </section>;
}
