import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name);const module={exports:{}};cache.set(name,module.exports);const js=ts.transpileModule(readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(id=>load(id.replace('./','')),module,module.exports);return module.exports;}
const {evaluateHandoff,createHandoffPacket,handoffProfiles}=load('project-handoff');
const {workflowNodes,deriveWorkflowSignals}=load('workflow-integration');
const {projectSections}=load('project-package');
test('absent workflow signals are missing, never included',()=>{
  for(const profile of handoffProfiles){const result=evaluateHandoff(profile.id,[]);assert.equal(result.includedNodes.length,0);assert.equal(result.readyCount,0);assert.equal(result.status,'not-started')}
});
for(const profile of handoffProfiles)test(`${profile.id} packet includes only recipient requirements`,()=>{
  const values=new Map(projectSections.map(section=>[section.key,JSON.stringify(section.id==='brief'?{name:'Private project',notes:'Private notes',location:'Private location'}:{records:[{label:section.id}]})]));
  const read=key=>values.get(key)??null,signals=deriveWorkflowSignals(read);
  const packet=createHandoffPacket(read,profile.id,signals);
  const allowed=new Set(profile.requirements.map(r=>workflowNodes.find(n=>n.id===r.nodeId)?.key));
  const included=Object.keys(packet.projectPackage.sections);
  assert.ok(included.length>0);
  for(const id of included)assert.ok(allowed.has(projectSections.find(s=>s.id===id).key),id);
  assert.ok(!included.includes('projectHandoff'));
  if(packet.projectPackage.sections.brief){assert.equal(packet.projectPackage.sections.brief.notes,'');assert.equal(packet.projectPackage.sections.brief.location,'')}
});
test('unrelated malformed sections do not block a focused handoff',()=>{
  const read=key=>key==='mosque-build.project-draft.v2'?'{"name":"Sample"}':key==='mosque-build.asset-register.v1'?'{broken':null;
  assert.doesNotThrow(()=>createHandoffPacket(read,'design-team',deriveWorkflowSignals(read)));
});
test('malformed included section stops handoff instead of hiding it',()=>{
  const read=key=>key==='mosque-build.project-draft.v2'?'{broken':null;
  assert.throws(()=>createHandoffPacket(read,'design-team',[]),/unreadable/);
});
test('empty handoff is not reported as a successful export',()=>{
  assert.throws(()=>createHandoffPacket(()=>null,'design-team',[]),/no supported project sections/);
});
