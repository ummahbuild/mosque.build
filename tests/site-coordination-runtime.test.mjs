import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
import * as THREE from '../apps/web/node_modules/three/build/three.module.js';
function load(name){const mod={exports:{}};const source=readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports',js)(mod,mod.exports);return mod.exports;}
const {readSiteCoordinationInputs:read,SITE_COORDINATION_KEYS:keys,subscribeSiteCoordinationChanges:subscribe}=load('site-coordination-inputs');
const {createSiteCoordinationModel:create}=load('site-coordination-model');
const {initialSiteLayerVisibility:initial,applySiteLayerVisibility:apply,SITE_LAYERS:layers}=load('site-coordination-view-state');
const storage=(values={})=>({getItem:key=>Object.hasOwn(values,key)?JSON.stringify(values[key]):null});
const model=values=>create(read(storage(values)).inputs,'2026-11-17T00:00:00.000Z');
const bearing=m=>m.features.find(f=>f.id==='qibla-axis');
for(const zero of [0,'0'])test(`context bearing ${JSON.stringify(zero)} remains north despite older bearings`,()=>{
 const m=model({[keys[0]]:{qiblaBearing:80,reference:'older source'},[keys[1]]:{qibla:{bearingDeg:zero,methodRef:'north study',mode:'cross-checked',toleranceDeg:2}},[keys[2]]:{qiblaDeg:120}});
 assert.equal(bearing(m).properties.bearingDeg,0);assert.equal(bearing(m).sourceRef,'north study');assert.equal(bearing(m).properties.toleranceDeg,2);
});
test('zero in site evidence overrides an older schematic bearing',()=>{assert.equal(bearing(model({[keys[0]]:{qiblaBearing:'0'},[keys[2]]:{qiblaDeg:90}})).properties.bearingDeg,0);});
test('missing or blank bearing falls back without inheriting unrelated confidence or tolerance',()=>{
 const result=read(storage({[keys[1]]:{qibla:{bearingDeg:'',methodRef:'unrelated',mode:'cross-checked',toleranceDeg:25}},[keys[0]]:{qiblaBearing:42,reference:'evidence source',qiblaAccuracy:'approximate'}}));
 assert.equal(result.inputs.qiblaDeg,42);assert.equal(result.inputs.qiblaRef,'evidence source');assert.equal(result.inputs.qiblaToleranceDeg,0);assert.equal(result.inputs.qiblaConfidence,'approximate');
});
test('bearing without its own source is never labelled referenced using an older source',()=>{
 const f=bearing(model({[keys[1]]:{qibla:{bearingDeg:0}},[keys[0]]:{qiblaBearing:80,reference:'old source'}}));assert.equal(f.sourceRef,'');assert.equal(f.evidence,'unknown');
});
for(const invalid of [false,{},[],360,-1,'Infinity','not a bearing'])test(`invalid bearing ${JSON.stringify(invalid)} falls back with a warning`,()=>{
 const result=read(storage({[keys[1]]:{qibla:{bearingDeg:invalid}},[keys[2]]:{qiblaDeg:23}}));assert.equal(result.inputs.qiblaDeg,23);assert.ok(result.warnings.includes('qibla bearing'));
});
for(const invalid of [null,[],true,17,'unexpected'])test(`malformed saved root ${JSON.stringify(invalid)} does not crash the preview`,()=>{
 const result=read(storage(Object.fromEntries(keys.map(key=>[key,invalid]))));assert.equal(result.warnings.length,7);assert.ok(create(result.inputs).features.length>0);
});
test('invalid JSON and inaccessible storage are reported without writing saved records',()=>{
 for(const getItem of [()=>'{broken',()=>{throw new Error('blocked');}]){const result=read({getItem});assert.equal(result.warnings.length,7);assert.equal(result.inputs.siteWidthM,48);}
});
test('missing storage uses provisional defaults without claiming a read failure',()=>{const result=read(storage());assert.deepEqual(result.warnings,[]);assert.equal(result.inputs.siteWidthM,48);assert.equal(result.inputs.siteDepthM,64);});
test('malformed nested access and criterion values cannot throw on find or evidenceRef',()=>{
 const result=read(storage({[keys[3]]:{access:{}},[keys[6]]:{candidates:[null,{criteria:{one:null,two:42,three:{evidenceRef:'report'}}}]}}));
 assert.equal(result.inputs.accessibleRouteRef,'');assert.deepEqual(result.inputs.constraints,[{id:'three',label:'three',sourceRef:'report'}]);assert.ok(result.warnings.length);
});
test('invalid terrain rows are omitted and valid zero elevations survive',()=>{
 const result=read(storage({[keys[1]]:{terrain:{points:[null,{xM:0,zM:0,elevationM:0,sourceRef:'survey'},{xM:1,zM:2,elevationM:'Infinity'},{xM:2,zM:3,elevationM:'bad'}]}}}));
 assert.equal(result.inputs.terrainPoints.length,1);assert.equal(result.inputs.terrainPoints[0].elevationM,0);assert.ok(result.warnings.includes('terrain samples'));
 for(const feature of create(result.inputs).features){assert.ok(Number.isFinite(feature.heightM));assert.ok(feature.points.flat().every(Number.isFinite));}
});
test('extreme terrain values are bounded before relative heights are calculated',()=>{
 const result=read(storage({[keys[1]]:{terrain:{points:[{xM:1e308,zM:-1e308,elevationM:1e308},{xM:0,zM:0,elevationM:-1e308}]}}}));
 const terrain=create(result.inputs).features.filter(f=>f.layer==='terrain');assert.equal(terrain.length,2);assert.ok(terrain.every(f=>Number.isFinite(f.heightM)&&f.heightM<=10100.15));
});
test('invalid flood and solar records are excluded instead of creating invalid geometry',()=>{
 const result=read(storage({[keys[1]]:{flood:{zones:[null,{widthM:'bad'},{id:'f',xM:0,zM:0,widthM:10,depthM:10,waterDepthM:0,designLevelM:0,sourceRef:'screening'}]}},[keys[4]]:{roofZones:[null,{areaM2:'bad'},{id:'s',areaM2:10,structureRef:'roof study'}]}}));
 assert.equal(result.inputs.floodZones.length,1);assert.equal(result.inputs.solarZones.length,1);assert.ok(result.warnings.includes('flood zones'));assert.ok(result.warnings.includes('solar zones'));
 assert.ok(create(result.inputs).features.every(f=>Number.isFinite(f.heightM)&&f.points.flat().every(Number.isFinite)));
});
test('array preview limits bound imported records and report truncation',()=>{
 const result=read(storage({[keys[1]]:{terrain:{points:Array.from({length:110},()=>({xM:0,zM:0,elevationM:0}))}},[keys[4]]:{roofZones:Array.from({length:25},()=>({areaM2:10}))}}));
 assert.equal(result.inputs.terrainPoints.length,100);assert.equal(result.inputs.solarZones.length,20);assert.ok(result.warnings.length);
});
test('reading inputs does not mutate raw records or fabricate source text from objects',()=>{
 const original={[keys[0]]:{width:'50',reference:{secret:'not a source'}},[keys[1]]:{terrain:{points:[{xM:0,zM:0,elevationM:1}]}}};const before=JSON.stringify(original);const result=read(storage(original));assert.equal(JSON.stringify(original),before);assert.equal(result.inputs.boundaryRef,'');assert.equal(result.inputs.siteWidthM,50);
});
const renderObjects=()=>{const group=new THREE.Group();for(const layer of layers){const o=new THREE.Object3D();o.userData={id:layer,layer};group.add(o);}return group.children;};
test('hidden layers remain hidden when project refresh creates entirely new scene objects',()=>{
 const visibility=initial(),before=renderObjects();visibility.building=false;visibility.constraints=false;apply(before,visibility);
 const after=renderObjects();apply(after,visibility);assert.deepEqual(after.map(o=>o.visible),before.map(o=>o.visible));assert.equal(after.find(o=>o.userData.id==='building').visible,false);
});
test('hiding a selected layer clears its selection while unrelated selections survive',()=>{
 const visibility=initial(),objects=renderObjects();assert.equal(apply(objects,visibility,'building'),'building');visibility.solar=false;assert.equal(apply(objects,visibility,'building'),'building');visibility.building=false;assert.equal(apply(objects,visibility,'building'),'');
});
test('new visibility state is isolated for each viewer and unknown layers stay hidden',()=>{
 const a=initial(),b=initial();a.site=false;assert.equal(b.site,true);const unknown={visible:true,userData:{layer:'unknown',id:'unknown'}};assert.equal(apply([unknown],b,'unknown'),'');assert.equal(unknown.visible,false);
});
function event(key,storageArea){const result=new Event('storage');Object.defineProperties(result,{key:{value:key},storageArea:{value:storageArea}});return result;}
test('subscription handles current-tab edits, relevant cross-tab edits and storage clear only',()=>{
 const target=new EventTarget(),store={},other={};let calls=0;const stop=subscribe(()=>calls++,()=>store,target);
 target.dispatchEvent(new Event('mosque-build:project-change'));for(const key of keys)target.dispatchEvent(event(key,store));target.dispatchEvent(event(null,store));assert.equal(calls,9);
 target.dispatchEvent(event('unrelated',store));target.dispatchEvent(event(keys[0],other));assert.equal(calls,9);stop();target.dispatchEvent(event(null,store));target.dispatchEvent(new Event('mosque-build:project-change'));assert.equal(calls,9);
});
test('restricted storage cannot throw from a cross-tab event or prevent local updates',()=>{
 const target=new EventTarget();let calls=0;const stop=subscribe(()=>calls++,()=>{throw new Error('blocked');},target);target.dispatchEvent(event(keys[0],{}));target.dispatchEvent(new Event('mosque-build:project-change'));assert.equal(calls,1);stop();
});
test('viewer connects the tested read/refresh/layer adapters and accessible loading controls',()=>{
 const ui=readFileSync(new URL('../apps/web/components/site-three-coordination.tsx',import.meta.url),'utf8');
 for(const token of ['readSiteCoordinationInputs','subscribeSiteCoordinationChanges','applySiteLayerVisibility(group.children,visibleRef.current)','visibleRef.current=next','api.current=null','disabled={!ready}','aria-pressed={viewMode','saved records are unchanged'])assert.ok(ui.includes(token),token);
});
