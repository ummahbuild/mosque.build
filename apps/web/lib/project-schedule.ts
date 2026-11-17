export type ScheduleStatus="not-started"|"in-progress"|"blocked"|"ready-for-review"|"complete";
export type ScheduleTask={id:string;name:string;phase:string;start:string;finish:string;progress:number;status:ScheduleStatus;dependsOn:string[];responsibleRole:string;evidenceRef:string;notes:string};
export type ScheduleState={schema:"mosque.build/project-schedule@1";baselineDate:string;tasks:ScheduleTask[];updatedAt:string};
export const scheduleStatuses:ScheduleStatus[]=["not-started","in-progress","blocked","ready-for-review","complete"];
const day=86_400_000,iso=(date:Date)=>date.toISOString().slice(0,10),add=(date:string,days:number)=>iso(new Date(new Date(`${date}T00:00:00Z`).getTime()+days*day));
export const validScheduleDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(`${value}T00:00:00Z`))&&new Date(`${value}T00:00:00Z`).toISOString().slice(0,10)===value;
const validDate=validScheduleDate;
const durations=[14,28,42,35,21,84,56,21];
const templates=[
  ["brief","Project brief and governance","Brief",[]],["site","Site evidence and feasibility","Site",["brief"]],["design","Coordinated concept design","Design",["site"]],["approvals","Authority pathway and submissions","Approvals",["design"]],["procurement","Procurement packages","Procurement",["design"]],["build","Construction delivery","Construction",["approvals","procurement"]],["commission","Testing and commissioning","Handover",["build"]],["open","Opening readiness","Operations",["commission"]]
] as const;
export function createBaselineSchedule(baselineDate:string):ScheduleState{if(!validDate(baselineDate)||baselineDate>"9998-12-31")throw new Error("Choose a valid baseline date before creating an example schedule.");let cursor=baselineDate;const tasks:ScheduleTask[]=templates.map(([id,name,phase,dependsOn],index)=>{const start=cursor,finish=add(start,durations[index]-1);cursor=add(finish,1);return {id,name,phase,start,finish,progress:0,status:"not-started",dependsOn:[...dependsOn],responsibleRole:"",evidenceRef:"",notes:""}});return {schema:"mosque.build/project-schedule@1",baselineDate,tasks,updatedAt:new Date().toISOString()}}
export function durationDays(task:Pick<ScheduleTask,"start"|"finish">){if(!validDate(task.start)||!validDate(task.finish)||task.finish<task.start)return 0;const start=Date.parse(`${task.start}T00:00:00Z`),finish=Date.parse(`${task.finish}T00:00:00Z`);return Math.round((finish-start)/day)+1}
function completionRecord(task:ScheduleTask){return task.status==="complete"&&task.progress===100&&!!task.name.trim()&&!!task.responsibleRole.trim()&&!!task.evidenceRef.trim()&&durationDays(task)>0}
export function taskBlockers(task:ScheduleTask,tasks:ScheduleTask[]){
 const byId=new Map(tasks.map(item=>[item.id,item])),memo=new Map<string,boolean>();
 const complete=(id:string,path:Set<string>):boolean=>{if(memo.has(id))return memo.get(id)!;const item=byId.get(id);if(!item||path.has(id)||!completionRecord(item))return false;const next=new Set(path).add(id);const result=item.dependsOn.every(dep=>complete(dep,next));memo.set(id,result);return result};
 return task.dependsOn.filter(id=>!complete(id,new Set([task.id])));
}
export function dependencyCycle(tasks:ScheduleTask[]){const graph=new Map(tasks.map(x=>[x.id,x.dependsOn])),visiting=new Set<string>(),visited=new Set<string>();const visit=(id:string):boolean=>{if(visiting.has(id))return true;if(visited.has(id))return false;visiting.add(id);for(const next of graph.get(id)??[])if(graph.has(next)&&visit(next))return true;visiting.delete(id);visited.add(id);return false};return tasks.some(x=>visit(x.id))}
export function scheduleBounds(tasks:ScheduleTask[]){const dated=tasks.filter(item=>durationDays(item)>0);return {start:dated.reduce((min,item)=>!min||item.start<min?item.start:min,""),finish:dated.reduce((max,item)=>item.finish>max?item.finish:max,"")}}
export function scheduleSummary(tasks:ScheduleTask[],today:string){const weight=tasks.reduce((sum,item)=>sum+durationDays(item),0),earned=tasks.reduce((sum,item)=>sum+durationDays(item)*item.progress,0);return {progress:weight?Math.round(earned/weight):0,blocked:tasks.filter(item=>taskBlockers(item,tasks).length||item.status==="blocked").length,overdue:tasks.filter(item=>item.status!=="complete"&&validDate(item.finish)&&validDate(today)&&item.finish<today).length,ready:tasks.filter(item=>item.status==="ready-for-review"&&!scheduleGaps(item,tasks).length&&!taskBlockers(item,tasks).length).length,complete:tasks.filter(item=>completionRecord(item)&&!taskBlockers(item,tasks).length).length}}
export function scheduleGaps(task:ScheduleTask,tasks:ScheduleTask[]){const gaps:string[]=[];if(!task.name.trim())gaps.push("task name");if(!durationDays(task))gaps.push("valid dates");if(!task.responsibleRole.trim())gaps.push("responsible role");if(task.status==="complete"&&!task.evidenceRef.trim())gaps.push("completion evidence");if(task.status==="complete"&&task.progress!==100)gaps.push("100% reported progress");if(task.dependsOn.includes(task.id)||task.dependsOn.some(id=>!tasks.some(item=>item.id===id))||dependencyCycle(tasks.map(x=>x.id===task.id?task:x)))gaps.push("valid dependencies");return gaps}
export function safeSchedule(value:unknown):ScheduleState|null{
 if(!value||typeof value!=="object"||Array.isArray(value))return null;
 const source=value as Partial<ScheduleState>;
 if(source.schema!=="mosque.build/project-schedule@1"||typeof source.baselineDate!=="string"||!validDate(source.baselineDate)||!Array.isArray(source.tasks)||source.tasks.length>200)return null;
 const text=(x:unknown,max:number):x is string=>typeof x==="string"&&x.length<=max;
 const tasks=source.tasks.filter((item):item is ScheduleTask=>!!item&&typeof item==="object"&&!Array.isArray(item)&&text(item.id,200)&&!!item.id.trim()&&text(item.name,500)&&text(item.phase,200)&&text(item.start,10)&&(item.start===""||validDate(item.start))&&text(item.finish,10)&&(item.finish===""||validDate(item.finish))&&Number.isFinite(item.progress)&&item.progress>=0&&item.progress<=100&&scheduleStatuses.includes(item.status)&&Array.isArray(item.dependsOn)&&item.dependsOn.length<=200&&item.dependsOn.every(id=>text(id,200))&&new Set(item.dependsOn).size===item.dependsOn.length&&text(item.responsibleRole,500)&&text(item.evidenceRef,2000)&&text(item.notes,10000));
 if(tasks.length!==source.tasks.length||new Set(tasks.map(item=>item.id)).size!==tasks.length)return null;
 return {schema:source.schema,baselineDate:source.baselineDate,tasks,updatedAt:typeof source.updatedAt==="string"?source.updatedAt:""};
}

export function patchScheduleTask(state:ScheduleState,id:string,patch:Partial<ScheduleTask>):ScheduleState{
 const original=state.tasks.find(task=>task.id===id);if(!original)throw new Error("Select an existing activity.");
 const task={...original,...patch};if(task.id!==id)throw new Error("Activity identifiers cannot be changed.");
 if(patch.status==="complete")task.progress=100;
 if(patch.status==="not-started")task.progress=0;
 if(patch.progress!==undefined&&patch.progress<100&&original.status==="complete")task.status="in-progress";
 if(task.progress>0&&task.status==="not-started")task.status="in-progress";
 const tasks=state.tasks.map(item=>item.id===id?task:item);
 if(dependencyCycle(tasks)||task.dependsOn.some(dep=>dep===id||!tasks.some(item=>item.id===dep)))throw new Error("This dependency would create a cycle or refer to a missing activity. Nothing was saved.");
 if((task.progress>original.progress||patch.status==="in-progress"||patch.status==="ready-for-review"||patch.status==="complete")&&taskBlockers(task,tasks).length)throw new Error("Complete the prerequisite activities with dates, role and evidence before advancing this activity.");
 if(task.status==="complete"&&(scheduleGaps(task,tasks).length||taskBlockers(task,tasks).length)){
   if(patch.status==="complete")throw new Error(`Cannot complete: ${[...scheduleGaps(task,tasks),...(taskBlockers(task,tasks).length?["completion dependencies"]:[])].join(", ")}.`);
   task.status="ready-for-review";
 }
 const next={...state,tasks};if(!safeSchedule(next))throw new Error("Use valid dates, bounded text and progress between 0 and 100. Nothing was saved.");return next;
}
