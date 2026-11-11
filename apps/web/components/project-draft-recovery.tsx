"use client";

import {useState} from "react";
import {MAX_DRAFT_FILE_BYTES,newProjectDraft,safeProjectDraft,type ProjectDraft} from "@/lib/project-draft";
import "./project-draft-recovery.css";

export function ProjectDraftRecovery({raw,error,onRetry,onReplace}:{raw:string|null;error:string;onRetry:()=>void;onReplace:(draft:ProjectDraft)=>void}) {
  const [confirmed,setConfirmed]=useState(false),[fileError,setFileError]=useState("");
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
    <div className="draftRecoveryActions"><button type="button" className="secondaryButton" disabled={raw===null} onClick={download}>Download original saved draft</button><button type="button" className="secondaryButton" onClick={onRetry}>Try opening again</button></div>
    <label className="draftRecoveryConsent"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>I want to replace this brief. Keep a recovery copy of the original on this device.</label>
    <label>Restore a repaired draft or structured brief
      <input type="file" disabled={!confirmed} accept=".json,.txt,application/json,text/plain" onChange={async event=>{
        const file=event.target.files?.[0];event.target.value="";if(!file)return;
        setFileError("");if(file.size>MAX_DRAFT_FILE_BYTES){setFileError("Choose a brief smaller than 500 KB. The original is unchanged.");return;}
        try{const value=JSON.parse(await file.text()),draft=safeProjectDraft(value?.schema==="mosque.build/project-brief@1"?value.project:value);if(!draft)throw new Error();onReplace(draft);}catch{setFileError("This file is not a supported project brief. Check its field types and version. The original is unchanged.");}
      }}/>
    </label>
    {!confirmed&&<p>Select the confirmation above to enable restoring or starting a new brief.</p>}
    {fileError&&<p role="alert">{fileError}</p>}
    <button type="button" className="secondaryButton" disabled={!confirmed} onClick={()=>onReplace(newProjectDraft())}>Start a new brief with recovery copy</button>
    <p>Other project drawings and planning records will not be reset.</p>
  </section>;
}
