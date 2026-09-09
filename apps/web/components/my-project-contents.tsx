"use client";

import {useEffect,useState} from "react";
import {projectSections} from "@/lib/project-package";

type ContentsItem={id:string;number:string;label:string;description:string;keys:string[]};
const allKeys=projectSections.map(item=>item.key);
const groups:{label:string;items:ContentsItem[]}[]=[
  {label:"Start here",items:[
    {id:"project-action-plan",number:"01",label:"First action plan",description:"Brief-led next actions",keys:["mosque-build.project-draft.v2","mosque-build.project-progress.v1"]},
    {id:"connected-project-map",number:"02",label:"Connected project map",description:"Dependencies and next moves",keys:allKeys},
  ]},
  {label:"Plan and coordinate",items:[
    {id:"project-controls",number:"03",label:"Project controls",description:"Options, permits, budget and progress",keys:["mosque-build.control-center.v1"]},
    {id:"project-planning",number:"04",label:"Planning workspace",description:"Roadmap, lookahead and responsibilities",keys:["mosque-build.project-planning.v1"]},
    {id:"project-schedule",number:"05",label:"Integrated schedule",description:"Dates, dependencies and evidence",keys:["mosque-build.project-schedule.v1"]},
  ]},
  {label:"Evidence and handoff",items:[
    {id:"project-records",number:"06",label:"Decision and evidence register",description:"Owned records and review state",keys:["mosque-build.project-records.v1"]},
    {id:"project-lifecycle",number:"07",label:"Lifecycle checklist",description:"Preparation prompts by stage",keys:["mosque-build.process-progress.v1"]},
    {id:"project-data",number:"08",label:"Backup and handoff",description:"Export or restore local work",keys:allKeys},
  ]},
];
const items=groups.flatMap(group=>group.items);

function hasRecord(keys:string[]){return keys.some(key=>{try{const raw=localStorage.getItem(key);if(!raw)return false;const value:unknown=JSON.parse(raw);if(Array.isArray(value))return value.length>0;if(value&&typeof value==="object")return Object.keys(value).length>0;return Boolean(value)}catch{return false}})}

export function MyProjectContents(){
  const [saved,setSaved]=useState<Record<string,boolean>>({});
  const [active,setActive]=useState("");
  useEffect(()=>{
    const update=()=>setSaved(Object.fromEntries(items.map(item=>[item.id,hasRecord(item.keys)])));
    update();
    addEventListener("mosque-build:project-change",update);addEventListener("storage",update);addEventListener("focus",update);
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(visible)setActive(visible.target.id)},{rootMargin:"-20% 0px -68%",threshold:0});
    items.forEach(item=>{const element=document.getElementById(item.id);if(element)observer.observe(element)});
    return()=>{observer.disconnect();removeEventListener("mosque-build:project-change",update);removeEventListener("storage",update);removeEventListener("focus",update)};
  },[]);
  const savedCount=items.filter(item=>saved[item.id]).length;
  return <nav className="myProjectContents" id="project-contents" aria-labelledby="project-contents-title"><header><div><div className="eyebrow dark">PROJECT CONTENTS</div><h2 id="project-contents-title">Move through your project workspace.</h2><p>Jump to a work area. Status means a record exists on this device—not that the work is complete, verified or approved.</p></div><div className="contentsCount" aria-label={`${savedCount} of ${items.length} work areas contain saved records`}><strong>{savedCount}/{items.length}</strong><span>areas with records</span></div></header><div className="contentsGroups">{groups.map(group=><section key={group.label} aria-label={group.label}><h3>{group.label}</h3><ol>{group.items.map(item=><li key={item.id}><a href={`#${item.id}`} aria-current={active===item.id?"location":undefined}><span className="contentsNumber">{item.number}</span><span><b>{item.label}</b><small>{item.description}</small></span><em data-saved={saved[item.id]||false}>{saved[item.id]?"Saved locally":"No record yet"}</em></a></li>)}</ol></section>)}</div></nav>;
}
