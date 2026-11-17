import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from '../apps/web/node_modules/three/build/three.module.js';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const cache=new Map();
function load(name){if(name==='three')return THREE;if(cache.has(name))return cache.get(name);const mod={exports:{}};cache.set(name,mod.exports);const js=ts.transpileModule(readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports','require',js)(mod,mod.exports,id=>load(id.replace('./','')));return mod.exports;}
const core=load('cad-authoring-core'),integrity=load('cad-production-integrity'),recovery=load('cad-local-recovery'),adapter=load('cad-three-adapter');
const fresh=()=>{
 const document=core.starterCadDocument();
 document.openings.push({...document.openings[0],id:'window-high',name:'High window',kind:'window',sillM:2.5,heightM:.8,typeId:'window-concept'});
 return {...core.createCadAuthoringState(),document};
};
const collisions=doc=>integrity.validateCadProduction(doc).filter(issue=>issue.code==='OVERLAPPING_OPENINGS');
const edit=(state,kind,targetId,payload)=>integrity.previewCadProductionCommand(state,{id:'opening-edit',kind,targetId,payload,summary:'Opening geometry test'});
for(const [label,patch,count] of [
 ['window above door',{sillM:2.5,heightM:.8},0],
 ['vertically touching edges',{sillM:2.2,heightM:.8},0],
 ['partial vertical overlap',{sillM:2.1,heightM:.8},1],
 ['contained opening',{sillM:.4,heightM:1},1],
 ['identical extents',{sillM:0,heightM:2.2},1],
 ['horizontal separation',{offsetM:5,sillM:0,heightM:1},0],
 ['horizontally touching edges',{offsetM:4.4,sillM:0,heightM:1},0],
 ['partial horizontal overlap',{offsetM:4.3,sillM:0,heightM:1},1],
 ['different host',{hostWallId:'wall-1',sillM:0,heightM:1},0],
])for(const reverse of [false,true])test(`${label}, ${reverse?'reversed':'original'} array order`,()=>{
 const state=fresh();Object.assign(state.document.openings[1],patch);if(reverse)state.document.openings.reverse();
 const before=JSON.stringify(state),issues=collisions(state.document);
 assert.equal(issues.length,count);assert.equal(JSON.stringify(state),before);
 if(count){assert.equal(issues[0].level,'blocker');assert.match(issues[0].message,/door-1/);assert.match(issues[0].message,/window-high/);}
});
test('stacked model imports, saves and restores with unchanged geometry and history',()=>{
 const state=fresh();state.past=[core.emptyCadDocument()];state.future=[structuredClone(state.document)];
 const raw=recovery.exportCadHistoryJson(state),review=recovery.reviewCadImport(raw);
 assert.equal(review.kind,'ready');assert.deepEqual(review.state,state);
 const values=new Map(),store={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 const saved=recovery.writeCadRecord(store,null,state);assert.equal(saved.ok,true);assert.deepEqual(recovery.readCadRecord(saved.raw).state,state);
 assert.deepEqual(integrity.importCadProductionJson(core.exportCadJson(state)).state.document,state.document);
});
test('true collisions fail model imports and history recovery',()=>{
 const state=fresh();state.document.openings[1].sillM=2;
 assert.equal(integrity.importCadProductionJson(core.exportCadJson(state)).state,null);
 assert.equal(recovery.reviewCadImport(JSON.stringify(state)).kind,'error');
 const valid=fresh();valid.past=[state.document];assert.equal(recovery.readCadRecord(JSON.stringify(valid)).kind,'recovery');
});
test('move and resize previews of vertically separated openings can commit and undo',()=>{
 const state=fresh(),before=structuredClone(state);
 const moved=edit(state,'move-opening','window-high',{offsetM:3.5});assert.equal(moved.transaction.issues.some(x=>x.level==='blocker'),false);
 const committed=core.commitCadCommand(moved);assert.equal(committed.document.revision,state.document.revision+1);assert.deepEqual(core.undoCadCommand(committed).document,state.document);
 const resized=edit(committed,'resize-opening','door-1',{widthM:1.5});assert.equal(resized.transaction.issues.some(x=>x.level==='blocker'),false);
 assert.equal(core.commitCadCommand(resized).document.openings[0].widthM,1.5);assert.deepEqual(state,before);
});
test('moving an adjacent opening into a door blocks commit and preserves the model',()=>{
 const state=fresh();Object.assign(state.document.openings[1],{offsetM:5,sillM:1,heightM:1});
 const pending=edit(state,'move-opening','window-high',{offsetM:3.5});assert.equal(collisions(pending.transaction.preview).length,1);
 assert.equal(core.commitCadCommand(pending),pending);assert.deepEqual(pending.document,state.document);assert.deepEqual(core.cancelCadCommand(pending).document,state.document);
});
test('new doors remain blocked when colliding and allowed below a high window',()=>{
 const state=fresh();state.document.openings=state.document.openings.filter(o=>o.kind==='window');
 const valid=edit(state,'place-door','door-new',{hostWallId:'wall-5',offsetM:3.2,widthM:1.2,heightM:2.2});
 assert.equal(valid.transaction.issues.some(x=>x.level==='blocker'),false);
 const invalid=edit(state,'place-door','door-new',{hostWallId:'wall-5',offsetM:3.2,widthM:1.2,heightM:2.8});
 assert.equal(collisions(invalid.transaction.preview).length,1);assert.equal(core.commitCadCommand(invalid),invalid);
});
for(const [label,patch,code] of [
 ['above wall',{sillM:3.2,heightM:.8},'OPENING_ABOVE_HOST'],
 ['negative sill',{sillM:-1},'OPENING_OUTSIDE_HOST'],
 ['nonfinite sill',{sillM:NaN},'OPENING_OUTSIDE_HOST'],
 ['outside wall length',{offsetM:7.5},'OPENING_OUTSIDE_HOST'],
 ['missing host',{hostWallId:'missing'},'MISSING_HOST'],
])test(`${label} stays blocked independently of collision checks`,()=>{const state=fresh();Object.assign(state.document.openings[1],patch);assert.ok(integrity.validateCadProduction(state.document).some(issue=>issue.level==='blocker'&&issue.code===code));});
test('3D proxies preserve separate vertical positions on an elevated level',()=>{
 const state=fresh();state.document.level.elevationM=4;
 const group=adapter.buildCadThreeGroup(state.document),door=group.children.find(x=>x.userData.elementId==='door-1'),window=group.children.find(x=>x.userData.elementId==='window-high');
 assert.equal(group.position.y,4);assert.equal(door.position.y,1.1);assert.equal(window.position.y,2.9);assert.ok(door.position.y+door.geometry.parameters.height/2<window.position.y-window.geometry.parameters.height/2);assert.equal(window.userData.proxyOnly,true);adapter.disposeCadThreeGroup(group);
});
