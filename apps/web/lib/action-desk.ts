import {PROJECT_ACTION_PLAN_KEY,PROJECT_ACTION_PLAN_SCHEMA,type ProjectActionPlan,type ProjectAction,type ProjectActionDecision} from "./project-action-plan";
import {workflowNodes} from "./workflow-integration";

export const actionStates={open:"Open","in-progress":"In progress","ready-for-review":"Ready for review",deferred:"Deferred","closed-user-record":"Closed by team"} as const;
export const actionFilters={attention:"Needs attention",all:"All actions",overdue:"Overdue",week:"Due within 7 days",unowned:"Unassigned",pinned:"Pinned",blocked:"Missing dependencies",review:"Ready for review",closed:"Closed",deferred:"Deferred"} as const;
export type ActionFilter=keyof typeof actionFilters;
export type ActionSort="attention"|"deadline"|"priority"|"name";
const priorities=["critical","high","normal","later"];
const nodeIds=new Set(workflowNodes.map(node=>node.id));
const isRecord=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==="object"&&!Array.isArray(value);
const bounded=(value:unknown,max:number):value is string=>typeof value==="string"&&value.length<=max;
export function validActionDate(value:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<"0001-01-01")return false;
  const date=new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
export function localActionDate(now=new Date()){
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}
function validTimestamp(value:unknown){return value===""||typeof value==="string"&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)&&Number.isFinite(Date.parse(value));}
export function safeActionDeskPlan(value:unknown):ProjectActionPlan|null{
  if(!isRecord(value)||value.schema!==PROJECT_ACTION_PLAN_SCHEMA||!validTimestamp(value.updatedAt)||!Array.isArray(value.decisions)||value.decisions.length>100)return null;
  if(Object.keys(value).some(key=>!["schema","updatedAt","decisions"].includes(key)))return null;
  const seen=new Set<string>();
  for(const row of value.decisions){
    if(!isRecord(row)||typeof row.nodeId!=="string"||!nodeIds.has(row.nodeId)||seen.has(row.nodeId))return null;
    if(Object.keys(row).some(key=>!["nodeId","priority","state","ownerRole","targetDate","note","pinned","updatedAt"].includes(key)))return null;
    if(typeof row.state!=="string"||!Object.hasOwn(actionStates,row.state)||!priorities.includes(String(row.priority))||typeof row.pinned!=="boolean")return null;
    if(!bounded(row.ownerRole,100)||!bounded(row.note,2000)||!bounded(row.targetDate,10)||row.targetDate!==""&&!validActionDate(row.targetDate)||!validTimestamp(row.updatedAt))return null;
    seen.add(row.nodeId);
  }
  return value as ProjectActionPlan;
}
export function parseActionDeskPlan(raw:string):ProjectActionPlan|null{
  if(raw.length>300_000)return null;
  try{return safeActionDeskPlan(JSON.parse(raw))}catch{return null}
}
export function actionDeadline(action:ProjectAction,today=localActionDate()){
  const date=action.decision.targetDate;
  if(!date||!validActionDate(date)||["closed-user-record","deferred"].includes(action.decision.state))return "none";
  if(date<today)return "overdue";
  if(date===today)return "today";
  const days=(Date.parse(`${date}T12:00:00Z`)-Date.parse(`${today}T12:00:00Z`))/86400000;
  return days<=7?"week":"later";
}
export function filterActionDesk(actions:ProjectAction[],options:{query:string;stage:string;filter:ActionFilter;sort:ActionSort},today=localActionDate()){
  const query=options.query.trim().toLocaleLowerCase();
  const filtered=actions.filter(action=>{
    const d=action.decision,active=!["closed-user-record","deferred"].includes(d.state),deadline=actionDeadline(action,today);
    if(options.stage!=="All"&&action.node.stage!==options.stage)return false;
    if(query&&!`${action.node.label} ${action.node.description} ${d.ownerRole} ${d.note}`.toLocaleLowerCase().includes(query))return false;
    switch(options.filter){
      case "all":return true;
      case "attention":return active;
      case "overdue":return deadline==="overdue";
      case "week":return deadline==="today"||deadline==="week";
      case "unowned":return active&&!d.ownerRole.trim();
      case "pinned":return d.pinned;
      case "blocked":return active&&action.signal.dependencyGaps.length>0;
      case "review":return d.state==="ready-for-review";
      case "closed":return d.state==="closed-user-record";
      case "deferred":return d.state==="deferred";
    }
  });
  return filtered.sort((a,b)=>{
    if(options.sort==="deadline")return (a.decision.targetDate||"9999-99-99").localeCompare(b.decision.targetDate||"9999-99-99")||a.node.label.localeCompare(b.node.label);
    if(options.sort==="priority")return priorities.indexOf(a.decision.priority)-priorities.indexOf(b.decision.priority)||a.node.label.localeCompare(b.node.label);
    if(options.sort==="name")return a.node.label.localeCompare(b.node.label);
    return b.score-a.score||a.node.label.localeCompare(b.node.label);
  });
}
export function actionSaveGaps(decision:ProjectActionDecision,action:ProjectAction):string[]{
  const gaps:string[]=[];
  if(!nodeIds.has(decision.nodeId)||decision.nodeId!==action.node.id)gaps.push("Choose a supported action.");
  if(decision.targetDate&&!validActionDate(decision.targetDate))gaps.push("Enter a valid calendar date.");
  if(decision.ownerRole.length>100||decision.note.length>2000)gaps.push("Keep the role within 100 characters and the note within 2,000 characters.");
  if(["ready-for-review","closed-user-record"].includes(decision.state)){
    if(!decision.ownerRole.trim())gaps.push("Add a responsible role before review or closure.");
    if(!decision.note.trim())gaps.push("Add an evidence reference or outcome note before review or closure.");
    if(decision.state==="ready-for-review"){
      if(!decision.targetDate)gaps.push("Set a target date for review.");
      if(action.signal.dependencyGaps.length)gaps.push("Record the missing upstream work before marking this ready for review.");
    }
  }
  return gaps;
}
export function persistActionDeskPlan(storage:Pick<Storage,"getItem"|"setItem">,plan:ProjectActionPlan,expected:string|null):string{
  if(storage.getItem(PROJECT_ACTION_PLAN_KEY)!==expected)throw new Error("The saved action plan changed in another tab. Download your working copy, then reload the saved plan.");
  if(!safeActionDeskPlan(plan))throw new Error("The action plan contains unsupported data. Your saved plan is unchanged.");
  const raw=JSON.stringify(plan);storage.setItem(PROJECT_ACTION_PLAN_KEY,raw);return raw;
}
export function actionDeskCsv(actions:ProjectAction[]){
  const cell=(value:string)=>`"${(/^[\s]*[=+@-]/.test(value)?"'":"")+value.replaceAll('"','""')}"`;
  const rows=[["Action","Stage","Status","Priority","Responsible role","Target date","Note","Review gate","Missing dependencies","Workspace"]];
  for(const a of actions)rows.push([a.node.label,a.node.stage,actionStates[a.decision.state],a.decision.priority,a.decision.ownerRole,a.decision.targetDate,a.decision.note,a.node.reviewGate,a.blockedBy.join("; "),`https://mosque.build${a.node.href}`]);
  return rows.map(row=>row.map(cell).join(",")).join("\r\n");
}
