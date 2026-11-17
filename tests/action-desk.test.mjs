import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
import {deriveWorkflowSignals,workflowNodes} from '../apps/web/lib/workflow-integration.ts';
function moduleUrl(path,replacements={}){
  let js=ts.transpileModule(fs.readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  for(const [key,value] of Object.entries(replacements))js=js.replaceAll(JSON.stringify(key),JSON.stringify(value));
  return `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;
}
const workflowUrl=new URL('../apps/web/lib/workflow-integration.ts',import.meta.url).href;
const planUrl=moduleUrl('../apps/web/lib/project-action-plan.ts',{'./workflow-integration':workflowUrl});
const {blankProjectActionPlan,defaultDecision,deriveProjectActions,PROJECT_ACTION_PLAN_KEY}=await import(planUrl);
const {safeActionDeskPlan,parseActionDeskPlan,validActionDate,filterActionDesk,actionDeadline,actionSaveGaps,persistActionDeskPlan,actionDeskCsv}=await import(moduleUrl('../apps/web/lib/action-desk.ts',{'./workflow-integration':workflowUrl,'./project-action-plan':planUrl}));
const decision=(id='brief',patch={})=>({...defaultDecision(id),...patch});
const plan=(decisions=[])=>({...blankProjectActionPlan(),decisions});
const actions=(decisions=[])=>deriveProjectActions(deriveWorkflowSignals(()=>null),plan(decisions),new Date('2026-11-11T12:00:00Z'));
const view=(filter,extra={})=>({query:'',stage:'All',sort:'attention',filter,...extra});

test('action schema round-trips existing data without silently dropping unknown or invalid values',()=>{
  const valid=plan([decision('brief',{ownerRole:'Project lead',note:'x'.repeat(2000),targetDate:'2028-02-29'})]);
  assert.deepEqual(parseActionDeskPlan(JSON.stringify(valid)),valid);
  const bad=[null,[],{}, {...valid,schema:'future'},{...valid,newField:1},{...valid,decisions:[...valid.decisions,...valid.decisions]},plan([decision('unknown')]),plan([decision('brief',{targetDate:'2026-02-30'})]),plan([decision('brief',{note:'x'.repeat(2001)})]),plan([decision('brief',{ownerRole:'x'.repeat(101)})]),plan([decision('brief',{pinned:'yes'})]),plan([decision('brief',{state:'approved'})]),plan([decision('brief',{priority:'urgent'})]),plan([decision('brief',{updatedAt:'invalid'})])];
  for(const value of bad)assert.equal(safeActionDeskPlan(value),null);
  for(const raw of ['{','null','', 'x'.repeat(300001)])assert.equal(parseActionDeskPlan(raw),null);
});
test('calendar validation rejects impossible dates and due dates use calendar days',()=>{
  for(const value of ['2026-02-29','2026-04-31','0000-01-01','2026-13-01','2026-01-00','2026-1-1'])assert.equal(validActionDate(value),false,value);
  assert.equal(validActionDate('2028-02-29'),true);
  const a=actions([decision('brief',{targetDate:'2026-11-11'})]).find(a=>a.node.id==='brief');
  assert.equal(actionDeadline(a,'2026-11-11'),'today');assert.equal(actionDeadline(a,'2026-11-12'),'overdue');
  assert.equal(actionDeadline({...a,decision:{...a.decision,state:'deferred'}},'2026-11-12'),'none');
  assert.equal(actionDeadline({...a,decision:{...a.decision,state:'closed-user-record'}},'2026-11-12'),'none');
});
test('all actions remain reachable; filters, search, sorting and empty states are deterministic',()=>{
  const rows=actions([decision('brief',{ownerRole:'  Design lead  ',targetDate:'2026-11-10',pinned:true,priority:'critical'}),decision('controls',{targetDate:'2026-11-15'}),decision('siteAnalysis',{state:'closed-user-record'}),decision('funding',{state:'deferred'}),decision('peoplePrivacy',{state:'ready-for-review'})]);
  assert.equal(filterActionDesk(rows,view('all')).length,workflowNodes.length);assert.ok(workflowNodes.length>24);
  assert.deepEqual(filterActionDesk(rows,view('overdue'),'2026-11-11').map(a=>a.node.id),['brief']);
  assert.deepEqual(filterActionDesk(rows,view('week'),'2026-11-11').map(a=>a.node.id),['controls']);
  assert.deepEqual(filterActionDesk(rows,view('pinned')).map(a=>a.node.id),['brief']);
  assert.deepEqual(filterActionDesk(rows,view('closed')).map(a=>a.node.id),['siteAnalysis']);
  assert.deepEqual(filterActionDesk(rows,view('deferred')).map(a=>a.node.id),['funding']);
  assert.deepEqual(filterActionDesk(rows,view('review')).map(a=>a.node.id),['peoplePrivacy']);
  assert.ok(!filterActionDesk(rows,view('unowned')).some(a=>['brief','siteAnalysis','funding'].includes(a.node.id)));
  assert.deepEqual(filterActionDesk(rows,view('all',{query:'  DESIGN LEAD  '})).map(a=>a.node.id),['brief']);
  assert.equal(filterActionDesk(rows,view('all',{query:'nothing-matches-this'})).length,0);
  assert.ok(filterActionDesk(rows,view('all',{stage:'Design'})).every(a=>a.node.stage==='Design'));
  assert.deepEqual(filterActionDesk(rows,view('all',{sort:'deadline'})).slice(0,2).map(a=>a.node.id),['brief','controls']);
  assert.equal(filterActionDesk(rows,view('all',{sort:'priority'}))[0].node.id,'brief');
  assert.equal(filterActionDesk(rows,view('attention')).length,workflowNodes.length-2);
  assert.ok(filterActionDesk(rows,view('blocked')).every(a=>a.signal.dependencyGaps.length>0));
});
test('review and closure require an owner and evidence; missing dependencies block review',()=>{
  const row=actions().find(a=>a.node.id==='controls'),base=decision('controls',{state:'ready-for-review'});
  assert.equal(actionSaveGaps(base,row).length,4);
  const ready={...base,ownerRole:'Project lead',note:'Evidence register reference',targetDate:'2026-11-20'};
  assert.equal(actionSaveGaps(ready,row).length,1);
  assert.equal(actionSaveGaps(ready,{...row,signal:{...row.signal,dependencyGaps:[]}}).length,0);
  assert.equal(actionSaveGaps({...ready,state:'closed-user-record'},row).length,0);
  assert.equal(actionSaveGaps({...base,state:'open'},row).length,0);
});
test('saving and undo preserve revisions, and stale tabs or quota failure never replace saved work',()=>{
  const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
  const original=plan(),raw=persistActionDeskPlan(storage,original,null),next=plan([decision('brief',{ownerRole:'Lead'})]);
  const updated=persistActionDeskPlan(storage,next,raw);
  assert.throws(()=>persistActionDeskPlan(storage,original,raw),/another tab/);assert.equal(values.get(PROJECT_ACTION_PLAN_KEY),updated);
  assert.throws(()=>persistActionDeskPlan({...storage,setItem:()=>{throw new Error('full')}},original,updated),/full/);assert.equal(values.get(PROJECT_ACTION_PLAN_KEY),updated);
  const undone=persistActionDeskPlan(storage,original,updated);assert.deepEqual(JSON.parse(undone),original);
  assert.throws(()=>persistActionDeskPlan(storage,{...original,schema:'future'},undone),/unsupported/);
});
test('CSV escapes formulas, newlines and quotes and exports all matched actions with workspace links',()=>{
  for(const value of ['=SUM(A1)','+cmd','-2','@formula',' \t=HYPERLINK("x")']){
    const csv=actionDeskCsv(actions([decision('brief',{ownerRole:value,note:'Line one\n"Line two"'})]));
    assert.ok(csv.includes(`"'${value.replaceAll('"','""')}"`));assert.ok(csv.includes('Line one\n""Line two""'));assert.ok(csv.includes('https://mosque.build/start'));
  }
  assert.equal(actionDeskCsv(actions()).split('\r\n').length,workflowNodes.length+1);
});
test('null, empty and malformed storage do not satisfy upstream dependencies',()=>{
  for(const value of ['null','[]','{}','42','true','"text"','{','x'.repeat(2000001)]){
    const signals=deriveWorkflowSignals(key=>key==='mosque-build.project-draft.v2'?value:null);
    assert.equal(signals.find(s=>s.id==='brief').state,'no-record');assert.ok(signals.find(s=>s.id==='controls').dependencyGaps.includes('brief'));
  }
});
test('service worker update deletes only obsolete mosque.build shell caches',async()=>{
  const events={},deleted=[];let completion;
  vm.runInNewContext(fs.readFileSync(new URL('../apps/web/public/sw.js',import.meta.url),'utf8'),{self:{addEventListener:(name,callback)=>events[name]=callback,clients:{claim:async()=>{}}},caches:{keys:async()=>['unrelated-app','mosque-build-shell-v23','mosque-build-shell-v24'],delete:async key=>deleted.push(key)}});
  events.activate({waitUntil:value=>completion=value});await completion;
  assert.deepEqual(deleted,['mosque-build-shell-v23']);
});
