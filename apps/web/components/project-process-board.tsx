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
  const [active,setActive]=useState(0);const [saved,setSaved]=useState(0);const [complete,setComplete]=useState<string[]>([]);
  useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem("mosque-build.pattern-shortlist.v1")||"[]").length);setComplete(JSON.parse(localStorage.getItem("mosque-build.process-progress.v1")||"[]"))}catch{}},[]);
  const checkId=(stageName:string,check:string)=>`${stageName}:${check}`;const persist=(next:string[])=>{setComplete(next);try{localStorage.setItem("mosque-build.process-progress.v1",JSON.stringify(next))}catch{}};const toggle=(id:string)=>persist(complete.includes(id)?complete.filter(item=>item!==id):[...complete,id]);
  const total=stages.reduce((sum,item)=>sum+item.checks.length,0);const completed=complete.filter(id=>stages.some(item=>item.checks.some(check=>checkId(item.name,check)===id))).length;const percent=Math.round(completed/total*100);
  const stage=stages[active];
  return <section className="processBoard"><div className="workspaceHeading"><div><div className="eyebrow dark">FULL PROJECT PROCESS</div><h2>Turn every stage into an owned checklist.</h2><p>Save preparation progress locally without treating a checked prompt as verified, approved or professionally complete.</p></div><div className="processOverall"><strong>{percent}%</strong><span>{completed} of {total} preparation prompts</span><div role="progressbar" aria-label="Lifecycle preparation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><i style={{width:`${percent}%`}}/></div></div></div>
    <div className="processTrack" role="tablist" aria-label="Project lifecycle">{stages.map((item,index)=>{const done=item.checks.filter(check=>complete.includes(checkId(item.name,check))).length;return <button type="button" role="tab" aria-selected={active===index} aria-controls="process-stage-panel" id={`process-stage-${index}`} onClick={()=>setActive(index)} key={item.name}><span>{done}/{item.checks.length}</span><b>{item.name}</b><small>{item.area}</small></button>})}</div>
    <article className="processPanel" role="tabpanel" id="process-stage-panel" aria-labelledby={`process-stage-${active}`}><div><small>STAGE {active+1} OF {stages.length}</small><h3>{stage.name}: {stage.area}</h3><p>Check a prompt only when the team has prepared it. Evidence, accountable owners and relevant professional or authority review still determine whether work can advance.</p></div><ul>{stage.checks.map(check=>{const id=checkId(stage.name,check);const done=complete.includes(id);return <li className={done?"done":""} key={check}><button type="button" aria-pressed={done} onClick={()=>toggle(id)}><span aria-hidden="true">{done?"✓":""}</span><span>{check}</span></button></li>})}</ul><div className="processPanelActions"><Link className="button" href={stage.href}>Open {stage.name.toLowerCase()} tools</Link>{stage.name==="Design"&&<span>{saved} pattern {saved===1?"study":"studies"} saved locally</span>}<Link href="/resources">Find stage resources →</Link></div></article>
    {complete.length?<div className="processReset"><p>Your checklist is stored only in this browser.</p><button type="button" onClick={()=>persist([])}>Reset lifecycle progress</button></div>:null}
  </section>;
}
