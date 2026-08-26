"use client";

import Link from "next/link";
import {useEffect,useState} from "react";

const stages=[
  {name:"Brief",area:"Define need",checks:["Community brief","Decision roles","Success measures"],href:"/start"},
  {name:"Site",area:"Test feasibility",checks:["Site evidence","Access + utilities","Risk review"],href:"/design"},
  {name:"Design",area:"Compare options",checks:["Spatial brief","Pattern studies","Professional reviews"],href:"/patterns"},
  {name:"Approvals",area:"Verify pathway",checks:["Likely requirements","Authority evidence","Submission record"],href:"/permits"},
  {name:"Fund",area:"Build confidence",checks:["Cost basis","Funding plan","Transparent updates"],href:"/funding"},
  {name:"Source",area:"Prepare packages",checks:["Scope package","Supplier evidence","Comparison record"],href:"/marketplace"},
  {name:"Build",area:"Control delivery",checks:["Quality checks","Change record","Handover evidence"],href:"/construction"},
  {name:"Operate",area:"Sustain the mosque",checks:["Opening plan","Maintenance","Waqf + governance"],href:"/operations"}
];

export function ProjectProcessBoard(){
  const [active,setActive]=useState(0);const [saved,setSaved]=useState(0);
  useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem("mosque-build.pattern-shortlist.v1")||"[]").length)}catch{}},[]);
  const stage=stages[active];
  return <section className="processBoard"><div className="workspaceHeading"><div><div className="eyebrow dark">FULL PROJECT PROCESS</div><h2>See what comes after the first action list.</h2><p>Move through the lifecycle without treating later stages as approved or complete.</p></div><Link className="secondaryButton" href="/roadmap">View development roadmap</Link></div>
    <div className="processTrack" role="tablist" aria-label="Project lifecycle">{stages.map((item,index)=><button type="button" role="tab" aria-selected={active===index} aria-controls="process-stage-panel" id={`process-stage-${index}`} onClick={()=>setActive(index)} key={item.name}><span>{index+1}</span><b>{item.name}</b><small>{item.area}</small></button>)}</div>
    <article className="processPanel" role="tabpanel" id="process-stage-panel" aria-labelledby={`process-stage-${active}`}><div><small>STAGE {active+1} OF {stages.length}</small><h3>{stage.name}: {stage.area}</h3><p>These are preparation prompts. Evidence, accountable owners and relevant professional or authority review determine whether work can advance.</p></div><ul>{stage.checks.map(check=><li key={check}><span aria-hidden="true">○</span>{check}</li>)}</ul><div className="processPanelActions"><Link className="button" href={stage.href}>Open {stage.name.toLowerCase()} tools</Link>{stage.name==="Design"&&<span>{saved} pattern {saved===1?"study":"studies"} saved locally</span>}</div></article>
  </section>;
}
