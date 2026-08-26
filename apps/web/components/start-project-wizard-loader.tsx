"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {useEffect,useState} from "react";

const Wizard=dynamic(()=>import("./start-project-wizard").then(module=>module.StartProjectWizard),{ssr:false,loading:()=> <Loading/>});
const key="mosque-build.project-draft.v2";

function Loading(){return <div className="wizard wizardLoading" role="status" aria-live="polite"><div><span className="loadingPulse" aria-hidden="true"/><b>Loading your private project brief…</b><p>Checking for a draft saved on this device.</p></div></div>}

export function StartProjectWizardLoader(){
  const [mode,setMode]=useState<"loading"|"resume"|"edit">("loading");const [name,setName]=useState("");
  useEffect(()=>{try{const edit=new URLSearchParams(window.location.search).get("edit")==="1";const draft=JSON.parse(localStorage.getItem(key)||"null");const complete=!!(draft?.name?.trim()&&draft?.location?.trim()&&draft?.needs?.length&&draft?.priorities?.length&&draft?.constraints?.length&&draft?.owner?.trim()&&draft?.team?.length&&draft?.funding?.length);setName(draft?.name||"");setMode(complete&&!edit?"resume":"edit")}catch{setMode("edit")}},[]);
  if(mode==="loading")return <Loading/>;
  if(mode==="resume")return <section className="resumeProjectCard"><div className="resumeIcon" aria-hidden="true">✓</div><div><div className="eyebrow dark">PROJECT FOUND ON THIS DEVICE</div><h2>Continue {name} where you left off.</h2><p>Your brief already has the information needed to open the project workspace. Continue planning now, or deliberately return to edit the brief.</p><div className="resumeActions"><Link className="button" href="/my-project">Continue to my project →</Link><a className="secondaryButton" href="/start?edit=1">Edit project brief</a></div><small>Saved only in this browser · not submitted or shared</small></div></section>;
  return <Wizard/>;
}
