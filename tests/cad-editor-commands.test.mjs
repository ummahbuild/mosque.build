import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name);const mod={exports:{}};cache.set(name,mod.exports);const js=ts.transpileModule(readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports','require',js)(mod,mod.exports,id=>load(id.replace('./','')));return mod.exports;}
const core=load('cad-authoring-core'), integrity=load('cad-production-integrity'), projection=load('cad-plan-projection');
const fresh=()=>({...core.createCadAuthoringState(),document:core.starterCadDocument()});
const preview=(kind,payload,state=fresh(),targetId='test-element')=>integrity.previewCadProductionCommand(state,{id:'command-test',kind,payload,targetId,summary:'Test edit'});
const blocked=state=>state.transaction.issues.some(issue=>issue.level==='blocker');
for(const field of ['thicknessM','heightM'])test(`zero wall ${field} is blocked rather than defaulted`,()=>{
 const state=preview('create-wall',{x1:20,y1:20,x2:24,y2:20,thicknessM:.24,heightM:3,[field]:0});
 assert.equal(blocked(state),true);assert.equal(state.transaction.preview.walls.at(-1)[field],0);assert.equal(core.commitCadCommand(state),state);
});
test('zero door height is not replaced with a plausible default',()=>{const state=preview('place-door',{hostWallId:'wall-1',offsetM:1,widthM:1,heightM:0});assert.equal(blocked(state),true);assert.equal(state.transaction.preview.openings.at(-1).heightM,0);});
for(const invalid of ['', '2', false, null, undefined, NaN, Infinity, -Infinity])test(`invalid coordinate ${String(invalid)} requires correction`,()=>{
 const state=fresh(),next=preview('create-wall',{x1:invalid,y1:0,x2:5,y2:0},state);
 assert.equal(next.transaction.issues[0].code,'INVALID_COMMAND_INPUT');assert.equal(next.transaction.preview,state.document);assert.equal(core.commitCadCommand(next),next);
});
for(const [kind,payload] of [
 ['move-wall-end',{x:1,y:''}],['place-door',{hostWallId:'wall-1',widthM:1}],['resize-opening',{widthM:NaN}],
 ['move-opening',{offsetM:null}],['set-level-properties',{elevationM:0,heightM:'3'}],
 ['create-wall',{x1:20,y1:20,x2:24,y2:20,thicknessM:undefined}],
])test(`${kind} rejects missing or nonnumeric required dimensions`,()=>assert.equal(preview(kind,payload).transaction.issues[0].code,'INVALID_COMMAND_INPUT'));
test('omitted optional dimensions keep documented defaults',()=>{const next=preview('create-wall',{x1:20,y1:20,x2:24,y2:20});assert.equal(blocked(next),false);assert.equal(next.transaction.preview.walls.at(-1).thicknessM,.24);assert.equal(next.transaction.preview.walls.at(-1).heightM,3.6);});
test('zero door offset remains valid and reaches the host start',()=>{const next=preview('place-door',{hostWallId:'wall-1',offsetM:0,widthM:1,heightM:2});assert.equal(blocked(next),false);const opening=projection.cadPlanOpenings(next.transaction.preview).find(o=>o.id==='test-element');assert.deepEqual(opening.start,{x:0,y:0});assert.deepEqual(opening.end,{x:1,y:0});});
test('negative level elevations are valid numeric values',()=>{assert.equal(blocked(preview('set-level-properties',{elevationM:-3,heightM:3.6})),false);});
test('a pending preview cannot be replaced by a second command or undo/redo',()=>{
 let state=core.commitCadCommand(preview('rename-wall',{name:'Changed'},fresh(),'wall-1'));
 state=core.undoCadCommand(state);
 const pending=preview('rename-wall',{name:'Pending'},state,'wall-1');
 assert.equal(core.previewCadCommand(pending,{id:'second',kind:'load-starter',payload:{},targetId:'document',summary:'Replace'}),pending);
 assert.equal(core.undoCadCommand(pending),pending);assert.equal(core.redoCadCommand(pending),pending);
});
test('cancel keeps saved geometry and history intact',()=>{const original=fresh();const pending=preview('rename-wall',{name:'Pending'},original,'wall-1');const canceled=core.cancelCadCommand(pending);assert.deepEqual(canceled.document,original.document);assert.deepEqual(canceled.past,original.past);assert.equal(canceled.transaction,null);});
test('wall count is blocked before a revision becomes unsaveable',()=>{const state=fresh();state.document.spaces=[];state.document.openings=[];state.document.walls=Array.from({length:500},(_,i)=>({...state.document.walls[0],id:`w-${i}`,start:{x:i*2,y:0},end:{x:i*2+1,y:0}}));const next=preview('create-wall',{x1:0,y1:10,x2:4,y2:10},state);assert.ok(next.transaction.issues.some(i=>i.code==='ELEMENT_LIMIT'));assert.equal(core.commitCadCommand(next),next);});
test('vertical opening aligns to its wall and preserves metadata',()=>{const doc=core.starterCadDocument(),opening=projection.cadPlanOpenings(doc)[0];assert.deepEqual(opening.start,{x:8,y:3.2});assert.deepEqual(opening.end,{x:8,y:4.4});assert.equal(opening.name,'Prayer hall entry');assert.equal(opening.kind,'door');});
test('reversed and diagonal host directions are projected without axis assumptions',()=>{const doc=core.starterCadDocument();doc.walls[4].start={x:6,y:8};doc.walls[4].end={x:0,y:0};doc.openings[0].offsetM=2;doc.openings[0].widthM=3;const opening=projection.cadPlanOpenings(doc)[0];assert.deepEqual(opening.start,{x:4.8,y:6.4});assert.deepEqual(opening.end,{x:3,y:4});});
test('missing and degenerate hosts produce no NaN display geometry',()=>{const doc=core.starterCadDocument();doc.walls=[];assert.deepEqual(projection.cadPlanOpenings(doc),[]);const next=core.starterCadDocument();next.walls[4].end={...next.walls[4].start};assert.deepEqual(projection.cadPlanOpenings(next),[]);});
