"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {deriveWorkflowSignals, workflowNodes, workflowStages} from "@/lib/workflow-integration";
import "./project-journey-nav.css";

const stageRoutes={
  "Define":"/start",
  "Understand":"/design#workspace",
  "Design":"/design#workspace",
  "Approve + resource":"/permits",
  "Build":"/construction#workspace",
  "Open + care":"/operations#workspace"
} as const;

const stageShort={
  "Define":"Brief",
  "Understand":"Site",
  "Design":"Design",
  "Approve + resource":"Approve",
  "Build":"Build",
  "Open + care":"Care"
} as const;

export type JourneyStage=typeof workflowStages[number];

export function ProjectJourneyNav({current,context}:{current?:JourneyStage;context?:string}){
  const[revision,setRevision]=useState(0),[mounted,setMounted]=useState(false);
  useEffect(()=>{setMounted(true);const update=()=>setRevision(value=>value+1);addEventListener("mosque-build:project-change",update);addEventListener("storage",update);return()=>{removeEventListener("mosque-build:project-change",update);removeEventListener("storage",update)}},[]);
  const signals=useMemo(()=>mounted?deriveWorkflowSignals(key=>localStorage.getItem(key)):[],[mounted,revision]);
  const counts=useMemo(()=>Object.fromEntries(workflowStages.map(stage=>[stage,workflowNodes.filter(node=>node.stage===stage&&signals.find(signal=>signal.id===node.id)?.state!=="no-record").length])) as Record<JourneyStage,number>,[signals]);
  const index=current?workflowStages.indexOf(current):-1,next=index>=0?workflowStages[index+1]:undefined,previous=index>0?workflowStages[index-1]:undefined;
  return <nav className="projectJourney" aria-label="Mosque project journey">
    <div className="journeyContext"><span>YOUR PROJECT JOURNEY</span><b>{context||current||"Whole project"}</b><small>Started means saved here; it does not mean approved or complete.</small></div>
    <ol>{workflowStages.map((stage,stageIndex)=><li key={stage} data-current={stage===current} data-past={stageIndex<index}><Link href={stageRoutes[stage]} aria-current={stage===current?"step":undefined}><i>{stageIndex+1}</i><span>{stageShort[stage]}</span><small>{counts[stage]} started</small></Link></li>)}</ol>
    <div className="journeyActions">{previous?<Link href={stageRoutes[previous]} aria-label={`Previous stage: ${previous}`}>← <span>{stageShort[previous]}</span></Link>:<span/>}{next?<Link href={stageRoutes[next]} aria-label={`Next stage: ${next}`}><span>{stageShort[next]}</span> →</Link>:<Link href="/my-project">Project overview →</Link>}</div>
  </nav>
}
