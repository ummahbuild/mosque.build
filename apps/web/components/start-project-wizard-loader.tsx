"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {useEffect,useState} from "react";
import {parseProjectDraft,readProjectDraft,initialDraftStep} from "@/lib/project-draft";

const Wizard=dynamic(()=>import("./start-project-wizard").then(module=>module.StartProjectWizard),{ssr:false,loading:()=> <Loading/>});

function Loading(){return <div className="wizard wizardLoading" role="status" aria-live="polite"><div><span className="loadingPulse" aria-hidden="true"/><b>Loading your private project brief…</b><p>Checking for a draft saved on this device.</p></div></div>}

export function StartProjectWizardLoader(){
  const [mode,setMode]=useState<"loading"|"resume"|"edit">("loading");const [name,setName]=useState("");
  useEffect(()=>{try{const query=new URLSearchParams(window.location.search),stored=readProjectDraft(localStorage);const draft=stored.raw===null?null:parseProjectDraft(stored.raw);const complete=!!draft&&initialDraftStep(draft,null)===5;setName(draft?.name||"");setMode(complete&&query.get("edit")!=="1"&&query.get("concept")!=="1"?"resume":"edit")}catch{setMode("edit")}},[]);
  if(mode==="loading")return <Loading/>;
  if(mode==="resume")return <section className="resumeProjectCard"><div className="resumeIcon" aria-hidden="true">✓</div><div><div className="eyebrow dark">PROJECT FOUND ON THIS DEVICE</div><h2>Continue {name} where you left off.</h2><p>Your brief already has the information needed to open the project workspace. Continue planning now, or deliberately return to edit the brief.</p><div className="resumeActions"><Link className="button" href="/my-project">Continue to my project →</Link><a className="secondaryButton" href="/start?edit=1">Edit project brief</a></div><small>Saved only in this browser · not submitted or shared</small></div></section>;
  return <Wizard/>;
}
