"use client";

import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type MouseEvent} from "react";
import {deriveWorkflowSignals,workflowNodes,workflowStages,type WorkflowSignal} from "@/lib/workflow-integration";
import {blankProjectActionPlan,defaultDecision,deriveProjectActions,PROJECT_ACTION_PLAN_KEY,type ProjectActionDecision,type ProjectActionPlan} from "@/lib/project-action-plan";
import {actionDeadline,actionDeskCsv,actionFilters,actionSaveGaps,actionStates,filterActionDesk,localActionDate,parseActionDeskPlan,persistActionDeskPlan,type ActionFilter,type ActionSort} from "@/lib/action-desk";
import "./project-action-desk.css";

const pageSize=12;
const roles=["Community steering group","Project lead","Design lead","Cost adviser","Approval coordinator","Construction lead","Facilities team","Qualified professional","Authority liaison"];
function downloadText(text:string,name:string,type="application/json"){
  const url=URL.createObjectURL(new Blob([text],{type})),anchor=document.createElement("a");
  anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function ProjectActionDesk(){
  const [plan,setPlan]=useState<ProjectActionPlan|null>(null),[ready,setReady]=useState(false),[blocked,setBlocked]=useState(false);
  const [query,setQuery]=useState(""),[stage,setStage]=useState("All"),[filter,setFilter]=useState<ActionFilter>("attention"),[sort,setSort]=useState<ActionSort>("attention"),[page,setPage]=useState(1);
  const [message,setMessage]=useState(""),[error,setError]=useState(""),[signals,setSignals]=useState<WorkflowSignal[]>([]),[today,setToday]=useState("");
  const [editing,setEditing]=useState<ProjectActionDecision|null>(null),[base,setBase]=useState(""),[undo,setUndo]=useState<ProjectActionPlan|null>(null);
  const snapshot=useRef<string|null>(null),editorHeading=useRef<HTMLHeadingElement>(null);
  const dirty=!!editing&&JSON.stringify(editing)!==base;
  function refreshSignals(){try{setSignals(deriveWorkflowSignals(key=>localStorage.getItem(key)));setToday(localActionDate())}catch{setError("Browser storage could not be read. Your saved work has not been replaced.")}}
  function load(){
    try{
      const raw=localStorage.getItem(PROJECT_ACTION_PLAN_KEY);snapshot.current=raw;
      const restored=raw===null?blankProjectActionPlan():parseActionDeskPlan(raw);
      if(!restored){setBlocked(true);setError("The saved action plan has an unsupported format. Download the original before repairing it through project backup and handoff.");return}
      setPlan(restored);setBlocked(false);setError("");setEditing(null);setBase("");setUndo(null);refreshSignals();
    }catch{setBlocked(true);setError("Browser storage is unavailable. Allow storage for this site, then try opening the plan again.")}
    finally{setReady(true)}
  }
  useEffect(()=>{load()},[]);
  useEffect(()=>{const update=()=>refreshSignals();window.addEventListener("mosque-build:project-change",update);window.addEventListener("storage",update);window.addEventListener("focus",update);return()=>{window.removeEventListener("mosque-build:project-change",update);window.removeEventListener("storage",update);window.removeEventListener("focus",update)}},[]);
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue=""};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn)},[dirty]);
  const actions=useMemo(()=>plan?deriveProjectActions(signals,plan):[],[signals,plan]);
  const matches=useMemo(()=>filterActionDesk(actions,{query,stage,filter,sort},today||localActionDate()),[actions,query,stage,filter,sort,today]);
  const pageCount=Math.max(1,Math.ceil(matches.length/pageSize)),currentPage=Math.min(page,pageCount),visible=matches.slice((currentPage-1)*pageSize,currentPage*pageSize);
  const active=actions.filter(a=>!["closed-user-record","deferred"].includes(a.decision.state));
  const selected=actions.find(a=>a.node.id===editing?.nodeId);
  const gaps=selected&&editing?actionSaveGaps(editing,selected):[];
  function choose(id:string){
    if(dirty&&!window.confirm("Discard the unsaved changes to this action?"))return;
    const value=actions.find(a=>a.node.id===id)?.decision??defaultDecision(id);setEditing({...value});setBase(JSON.stringify(value));setError("");
    requestAnimationFrame(()=>editorHeading.current?.focus());
  }
  function persist(next:ProjectActionPlan,notice:string){
    try{
      const value={...next,updatedAt:new Date().toISOString()};snapshot.current=persistActionDeskPlan(localStorage,value,snapshot.current);
      setPlan(value);setError("");setMessage(notice);window.dispatchEvent(new Event("mosque-build:project-change"));return true;
    }catch(cause){setError(cause instanceof Error?cause.message:"Saving failed. Download your working copy before leaving.");return false}
  }
  function save(){
    if(!plan||!editing||!selected||gaps.length)return;
    const decision={...editing,ownerRole:editing.ownerRole.trim(),note:editing.note.trim(),updatedAt:new Date().toISOString()};
    if(persist({...plan,decisions:[...plan.decisions.filter(d=>d.nodeId!==decision.nodeId),decision]},`${selected.node.label} saved on this device.`)){
      setUndo(plan);setEditing(decision);setBase(JSON.stringify(decision));
    }
  }
  function changeFilter(value:ActionFilter){setFilter(value);setPage(1)}
  function confirmNavigation(event:MouseEvent<HTMLAnchorElement>){
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(dirty&&!window.confirm("Leave this action without saving your changes?"))event.preventDefault();
  }
  function clearFilters(){setQuery("");setStage("All");setFilter("all");setSort("attention");setPage(1)}
  function exportPlan(working=false){
    if(!plan)return;
    const value=working&&editing?{...plan,decisions:[...plan.decisions.filter(d=>d.nodeId!==editing.nodeId),editing]}:plan;
    downloadText(JSON.stringify({schema:"mosque.build/project-package@1",product:"mosque.build",privacy:"full-local-backup",exportedAt:new Date().toISOString(),sections:{projectActionPlan:value}},null,2),working?"mosque-build-actions-working-copy.json":"mosque-build-actions-backup.json");
    setMessage(working?"Working copy downloaded. It may contain unfinished edits; review before restoring.":"Action plan backup downloaded. Restore it through Backup and handoff. Notes may contain private details.");
  }
  if(!ready)return <section className="actionDesk" role="status">Preparing the project action desk…</section>;
  if(blocked||!plan)return <section className="actionDesk" aria-labelledby="action-recovery-title"><h2 id="action-recovery-title">Recover your action plan</h2><p role="alert">{error}</p><p>Automatic replacement is paused. Your original record is unchanged.</p><div className="actionButtons"><button type="button" disabled={snapshot.current===null} onClick={()=>downloadText(snapshot.current??"","mosque-build-original-action-plan.txt","text/plain")}>Download original action plan</button><button type="button" onClick={load}>Try opening again</button><a href="#project-data">Open backup and handoff</a></div></section>;
  return <section className="actionDesk" aria-labelledby="action-desk-title">
    <header><div><div className="eyebrow dark">PROJECT ACTION DESK</div><h2 id="action-desk-title">Give the next step an owner.</h2><p>Plan the work, record what supports each decision and open the tools needed to move it forward.</p></div><div className="actionScore"><strong>{active.length}</strong><span>open work areas of {actions.length}</span><small>Saved only in this browser</small></div></header>
    <div className="actionMetrics" aria-label="Action overview">
      {([['overdue','Overdue',active.filter(a=>actionDeadline(a,today)==='overdue').length],['unowned','Unassigned',active.filter(a=>!a.decision.ownerRole.trim()).length],['review','Ready for review',actions.filter(a=>a.decision.state==='ready-for-review').length],['blocked','Missing dependencies',active.filter(a=>a.signal.dependencyGaps.length).length]] as const).map(([value,label,count])=><button type="button" key={value} aria-pressed={filter===value} onClick={()=>changeFilter(value)}><b>{count}</b>{label}</button>)}
    </div>
    <div className="actionToolbar">
      <label>Search actions<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="Work, role or note" maxLength={200}/></label>
      <label>Journey stage<select value={stage} onChange={e=>{setStage(e.target.value);setPage(1)}}><option>All</option>{workflowStages.map(value=><option key={value}>{value}</option>)}</select></label>
      <label>Show actions<select value={filter} onChange={e=>changeFilter(e.target.value as ActionFilter)}>{Object.entries(actionFilters).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label>Sort actions<select value={sort} onChange={e=>{setSort(e.target.value as ActionSort);setPage(1)}}><option value="attention">Needs attention first</option><option value="deadline">Earliest target date</option><option value="priority">Highest priority</option><option value="name">Name A–Z</option></select></label>
    </div>
    <div className="actionButtons"><button type="button" onClick={clearFilters}>Clear filters</button><button type="button" onClick={()=>exportPlan()}>Export plan backup</button><button type="button" disabled={!matches.length} onClick={()=>{downloadText(actionDeskCsv(matches),"mosque-build-actions.csv","text/csv;charset=utf-8");setMessage(`${matches.length} matching actions exported. Notes may contain private details.`)}}>Export filtered CSV</button><button type="button" disabled={!undo||dirty} onClick={()=>{if(undo&&persist(undo,"Last saved change undone.")){setUndo(null);setEditing(null);setBase("")}}}>Undo last save</button></div>
    <p className="actionMessage" role="status" aria-live="polite">{message}</p>
    {error&&<div className="actionError" role="alert"><b>Changes have not been saved.</b><p>{error}</p><div className="actionButtons"><button type="button" onClick={()=>exportPlan(true)}>Download working copy</button><button type="button" onClick={()=>{if(!dirty||window.confirm("Reload the saved plan? Download your working copy first to keep unsaved changes."))load()}}>Reload saved plan</button></div></div>}
    <div className="actionWorkspace">
      <div>
        <p role="status" aria-live="polite">{matches.length?`${(currentPage-1)*pageSize+1}–${Math.min(currentPage*pageSize,matches.length)} of ${matches.length} matching actions`:'No matching actions'} · {actions.length} total</p>
        <div className="actionList">{visible.map(a=>{const deadline=actionDeadline(a,today);return <button className="actionListItem" type="button" key={a.node.id} aria-pressed={editing?.nodeId===a.node.id} onClick={()=>choose(a.node.id)}><span>{a.node.stage} · {a.decision.priority}{a.decision.pinned?' · Pinned':''}</span><strong>{a.node.label}</strong><span>{actionStates[a.decision.state]} · {a.decision.ownerRole||'Role needed'}</span><span data-overdue={deadline==='overdue'}>{a.decision.targetDate?`Target ${a.decision.targetDate}${deadline==='overdue'?' · Overdue':deadline==='today'?' · Due today':''}`:'No target date'}</span>{a.signal.dependencyGaps.length>0&&<small>{a.signal.dependencyGaps.length} missing dependencies</small>}</button>})}</div>
        {!matches.length&&<div className="actionEmpty"><h3>No actions match this view.</h3><p>Try another filter or clear them to see all work areas.</p><button type="button" onClick={clearFilters}>Show all actions</button></div>}
        <nav className="actionPagination" aria-label="Action result pages"><button type="button" disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>Previous actions</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage===pageCount} onClick={()=>setPage(currentPage+1)}>Next actions</button></nav>
      </div>
      <section className="actionEditor" aria-labelledby="action-editor-title">
        <h3 id="action-editor-title" ref={editorHeading} tabIndex={-1}>{selected?.node.label||'Select an action to plan it'}</h3>
        {selected&&editing?<><p>{selected.node.description}</p><p><b>Review responsibility:</b> {selected.node.reviewGate}. This is a team planning record, not an approval.</p>
          {selected.signal.dependencyGaps.length>0&&<div className="actionBlocker"><b>Missing upstream records</b><ul>{selected.signal.dependencyGaps.map(id=>{const node=workflowNodes.find(n=>n.id===id);return <li key={id}>{node?<Link href={node.href} onClick={confirmNavigation}>{node.label} →</Link>:id}</li>})}</ul><small>A saved record does not establish that its contents have been verified.</small></div>}
          <form onSubmit={event=>{event.preventDefault();save()}}>
            <div className="actionFields">
              <label>Status<select value={editing.state} onChange={e=>setEditing({...editing,state:e.target.value as ProjectActionDecision['state']})}>{Object.entries(actionStates).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
              <label>Priority<select value={editing.priority} onChange={e=>setEditing({...editing,priority:e.target.value as ProjectActionDecision['priority']})}>{['critical','high','normal','later'].map(value=><option key={value}>{value}</option>)}</select></label>
              <label>Responsible role<input list="project-action-roles" maxLength={100} value={editing.ownerRole} onChange={e=>setEditing({...editing,ownerRole:e.target.value})} placeholder="Role, not person"/></label>
              <label>Target date<input type="date" min="0001-01-01" max="9999-12-31" value={editing.targetDate} onChange={e=>setEditing({...editing,targetDate:e.target.value})}/></label>
            </div>
            <label>Decision, evidence or handoff note<textarea rows={5} maxLength={2000} value={editing.note} onChange={e=>setEditing({...editing,note:e.target.value})} aria-describedby="action-note-count" placeholder="Record the evidence reference, next step or reason for closure."/></label><small id="action-note-count">{editing.note.length}/2,000 characters. Avoid private contact details.</small>
            <label className="actionPin"><input type="checkbox" checked={editing.pinned} onChange={e=>setEditing({...editing,pinned:e.target.checked})}/>Pin this action</label>
            <div id="action-save-requirements" role="status" aria-live="polite">{gaps.length?<ul className="actionGaps">{gaps.map(gap=><li key={gap}>{gap}</li>)}</ul>:<p>{dirty?'Unsaved changes. Save when you are ready.':'No unsaved changes.'}</p>}</div>
            <div className="actionButtons"><button type="submit" disabled={!dirty||gaps.length>0} aria-describedby="action-save-requirements">Save action</button><button type="button" disabled={!dirty} onClick={()=>{setEditing(JSON.parse(base));setError("");setMessage("Unsaved edits cancelled.")}}>Cancel edits</button></div>
          </form>
          <p><Link href={selected.node.href} onClick={confirmNavigation}>Open {selected.node.label.toLowerCase()} workspace →</Link></p>
          <small>Last saved: {selected.decision.updatedAt?new Date(selected.decision.updatedAt).toLocaleString():'Not yet saved'}</small>
        </>:<p>Choose a work area from the list. Its owner, deadline and notes stay here while you edit, even when the list order changes.</p>}
      </section>
    </div>
    <datalist id="project-action-roles">{roles.map(role=><option key={role} value={role}/>)}</datalist>
    <aside><b>Decision boundary</b><p>Statuses and closure are team records. They do not prove professional acceptance, authority approval, code compliance or certified construction progress.</p></aside>
  </section>;
}
