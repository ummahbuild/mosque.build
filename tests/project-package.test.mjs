import assert from "node:assert/strict";
import test from "node:test";
import {createOriginalRecordsArchive,snapshotProjectSections,serializeProjectPackage,PROJECT_PACKAGE_MAX_BYTES,createProjectPackage,PROJECT_PACKAGE_SCHEMA,projectSections,restoreProjectPackage,restoreProjectPackageSafely,validateProjectPackage} from "../apps/web/lib/project-package.ts";

test("share-safe project package redacts sensitive brief fields",()=>{
  const values=new Map([["mosque-build.project-draft.v2",JSON.stringify({name:"Community project",location:"Private location",owner:"Private person",email:"private@example.test",notes:"Private notes",needs:["Prayer hall"]})],["mosque-build.pattern-shortlist.v1",JSON.stringify(["iran-cross-star"])]]);
  const result=createProjectPackage(key=>values.get(key)??null,"share-safe","2026-09-08T10:00:00.000Z");
  assert.equal(result.schema,PROJECT_PACKAGE_SCHEMA);assert.equal(result.privacy,"share-safe");assert.deepEqual(result.sections.brief,{name:"Community project",location:"",owner:"",email:"",notes:"",needs:["Prayer hall"]});assert.deepEqual(result.sections.patterns,["iran-cross-star"]);
});

test("share-safe redaction reaches nested contact data",()=>{
  const values=new Map([["mosque-build.project-draft.v2",JSON.stringify({name:"Community project",committee:{contactEmail:"private@example.test",phone:"+1 555 0100"},options:[{address:"Private address",label:"Option A"}]})]]);
  const result=createProjectPackage(key=>values.get(key)??null,"share-safe","2026-09-08T10:00:00.000Z");
  assert.deepEqual(result.sections.brief,{name:"Community project",committee:{contactEmail:"",phone:""},options:[{address:"",label:"Option A"}]});
});

test("validator rejects foreign and empty package data",()=>{
  assert.equal(validateProjectPackage({schema:"other",product:"other",sections:{}}).ok,false);
  assert.equal(validateProjectPackage({schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z",sections:{}}).ok,false);
  assert.equal(validateProjectPackage({schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-99-99T99:99:99Z",sections:{brief:{}}}).ok,false);
});

test("restore writes only allowlisted supported sections",()=>{
  const input={schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z",sections:{brief:{name:"Restored"},patterns:["one"],unknown:{unsafe:true}}};
  const checked=validateProjectPackage(input);assert.equal(checked.ok,true);if(!checked.ok)return;const written=new Map();const count=restoreProjectPackage(checked.data,(key,value)=>written.set(key,value));assert.equal(count,2);assert.equal(written.size,2);assert.equal(written.has(projectSections.find(item=>item.id==="brief").key),true);assert.equal([...written.values()].some(value=>value.includes("unsafe")),false);
});

test("project restore snapshots before writes and rolls back only successful writes",()=>{
  const brief=projectSections.find(s=>s.id==="brief").key,patterns=projectSections.find(s=>s.id==="patterns").key;
  const data={sections:{brief:{name:"Replacement"},patterns:["new"]}};
  const values=new Map([[brief,"original"]]);let writes=0;
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>{writes++;if(key===patterns)throw new Error("full");values.set(key,value)},removeItem:key=>values.delete(key)};
  assert.throws(()=>restoreProjectPackageSafely(data,storage),/previous project sections were kept/);
  assert.equal(values.get(brief),"original");assert.equal(values.has(patterns),false);assert.equal(writes,3);
  writes=0;
  assert.throws(()=>restoreProjectPackageSafely(data,{...storage,getItem:()=>{throw new Error("blocked")}}),/No project sections were changed/);
  assert.equal(writes,0);
});

test("project restore reports incomplete rollback honestly and removes newly created sections",()=>{
  const values=new Map(),brief=projectSections.find(s=>s.id==="brief").key,patterns=projectSections.find(s=>s.id==="patterns").key;
  const data={sections:{brief:{name:"Replacement"},patterns:["new"]}};
  const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>{if(key===patterns)throw new Error("full");values.set(key,value)},removeItem:key=>values.delete(key)};
  assert.throws(()=>restoreProjectPackageSafely(data,storage),/previous project sections were kept/);assert.equal(values.size,0);
  assert.throws(()=>restoreProjectPackageSafely(data,{...storage,removeItem:()=>{throw new Error("blocked")}}),/could not be recovered/);
  assert.equal(values.has(brief),true);
});

test("design intelligence is a portable allowlisted section",()=>{
  const section=projectSections.find(item=>item.id==="designIntelligence");assert.equal(section?.key,"mosque-build.masjid-intelligence.v1");
  const values=new Map([[section.key,JSON.stringify({schemaVersion:"mosque.build/masjid-intelligence@1",selected:"phased"})]]);const result=createProjectPackage(key=>values.get(key)??null,"share-safe","2026-09-08T10:00:00.000Z");assert.equal(result.sections.designIntelligence.selected,"phased");
});
test("quote comparison is a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="quoteComparison")?.key,"mosque-build.quote-comparison.v1")});
test("asset register is a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="assetRegister")?.key,"mosque-build.asset-register.v1")});
test("work orders are a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="workOrders")?.key,"mosque-build.work-orders.v1")});
test("emergency readiness is a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="emergencyReadiness")?.key,"mosque-build.emergency-readiness.v1")});
test("people privacy plan is a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="peoplePrivacy")?.key,"mosque-build.people-privacy.v1")});
test("field sync history is a portable allowlisted section",()=>{assert.equal(projectSections.find(item=>item.id==="fieldSync")?.key,"mosque-build.field-sync.v1")});

test("validator rejects prototype keys and resource-exhaustion shapes",()=>{
  const base={schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z"};
  const poisoned=JSON.parse('{"brief":{"__proto__":{"polluted":true}}}');
  const checked=validateProjectPackage({...base,sections:poisoned});assert.equal(checked.ok,false);if(!checked.ok)assert.match(checked.errors.join(" "),/forbidden object key/);
  let deep={value:true};for(let index=0;index<22;index++)deep={next:deep};
  const nested=validateProjectPackage({...base,sections:{brief:deep}});assert.equal(nested.ok,false);if(!nested.ok)assert.match(nested.errors.join(" "),/nesting depth/);
  const oversized=validateProjectPackage({...base,sections:{brief:{notes:"x".repeat(100_001)}}});assert.equal(oversized.ok,false);if(!oversized.ok)assert.match(oversized.errors.join(" "),/oversized text/);
});

const basePackage={schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"full-local-backup",exportedAt:"2026-11-11T10:00:00.000Z"};
const briefKey=projectSections.find(s=>s.id==="brief").key,patternKey=projectSections.find(s=>s.id==="patterns").key;
function memory(entries=[]){const values=new Map(entries);return {values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}}
for(const raw of ["{broken", "", "undefined"]){test(`unreadable saved section is not silently omitted: ${JSON.stringify(raw)}`,()=>{
  const store=memory([[briefKey,raw],[patternKey,'["one"]']]);
  assert.throws(()=>createProjectPackage(store.getItem,"full-local-backup"),/Project brief.*without omitting/);
  assert.equal(store.getItem(briefKey),raw);
})}
test("raw recovery archive preserves exact malformed, empty and multilingual records",()=>{
  const store=memory([[briefKey,"  {broken\n"],[patternKey,""]]);
  const archive=createOriginalRecordsArchive(snapshotProjectSections(store.getItem));
  assert.equal(archive.records[briefKey],"  {broken\n");assert.equal(archive.records[patternKey],"");assert.equal(Object.keys(archive.records).length,2);
  assert.equal(validateProjectPackage(archive).ok,false);assert.match(archive.boundary,/Private recovery/);
});
test("snapshot read failures stop before generating partial archives",()=>{
  assert.throws(()=>snapshotProjectSections(()=>{throw new Error("blocked")}),/blocked/);
});
test("compact export bytes round trip through the same package limit",()=>{
  const p={...basePackage,sections:{patterns:Array.from({length:1000},()=>"نمط")}};
  const text=serializeProjectPackage(p);assert.ok(new TextEncoder().encode(text).byteLength<PROJECT_PACKAGE_MAX_BYTES);
  assert.deepEqual(validateProjectPackage(JSON.parse(text)).data,p);
});
test("UTF-8 package limit rejects exports that cannot be imported",()=>{
  const p={...basePackage,sections:{patterns:Array.from({length:25},()=>"界".repeat(30000))}};
  assert.ok(JSON.stringify(p).length<PROJECT_PACKAGE_MAX_BYTES);
  assert.throws(()=>serializeProjectPackage(p),/2 MB limit/);assert.equal(validateProjectPackage(p).ok,false);
});
for(const date of ["2026-02-30T10:00:00Z","2025-02-29T10:00:00.000Z","2026-04-31T10:00:00Z"]){test(`impossible calendar date is rejected: ${date}`,()=>assert.equal(validateProjectPackage({...basePackage,exportedAt:date,sections:{patterns:[]}}).ok,false))}
for(const date of ["2024-02-29T10:00:00Z","2026-01-01T10:00:00.1Z","2026-01-01T10:00:00.12Z"]){test(`valid UTC date is accepted: ${date}`,()=>assert.equal(validateProjectPackage({...basePackage,exportedAt:date,sections:{patterns:[]}}).ok,true))}
test("non-finite parsed numbers cannot become null in backup exports",()=>{
  assert.equal(validateProjectPackage({...basePackage,sections:{patterns:[Infinity]}}).ok,false);
  assert.throws(()=>createProjectPackage(key=>key===patternKey?'[1e999]':null,"full-local-backup"),/non-finite/);
});
for(const newer of ['{"name":"Newer"}',null])test(`stale review blocks changed or removed target: ${newer}`,()=>{
  const store=memory([[briefKey,'{"name":"Original"}']]),data={...basePackage,sections:{brief:{name:"Import"}}};
  const snapshot=snapshotProjectSections(store.getItem,data);
  if(newer===null)store.removeItem(briefKey);else store.setItem(briefKey,newer);
  assert.throws(()=>restoreProjectPackageSafely(data,store,snapshot),/changed after this preview/);assert.equal(store.getItem(briefKey),newer);
});
test("new target created during review cannot be overwritten",()=>{
  const store=memory(),data={...basePackage,sections:{patterns:["import"]}},snapshot=snapshotProjectSections(store.getItem,data);
  store.setItem(patternKey,'["new"]');assert.throws(()=>restoreProjectPackageSafely(data,store,snapshot),/No sections were changed/);assert.equal(store.getItem(patternKey),'["new"]');
});
test("missing snapshot target fails closed",()=>{
  assert.throws(()=>restoreProjectPackageSafely({...basePackage,sections:{patterns:[]}},memory(),new Map()),/changed after this preview/);
});
test("unrelated newer sections stay untouched and do not block partial restore",()=>{
  const store=memory([[briefKey,'{"name":"Original"}']]),data={...basePackage,sections:{patterns:["import"]}},snapshot=snapshotProjectSections(store.getItem,data);
  store.setItem(briefKey,'{"name":"Newer"}');assert.equal(restoreProjectPackageSafely(data,store,snapshot),1);assert.equal(store.getItem(briefKey),'{"name":"Newer"}');assert.equal(store.getItem(patternKey),'["import"]');
});
test("pre-replacement archive contains only reviewed originals and survives later changes",()=>{
  const store=memory([[briefKey,"original"],[patternKey,"unrelated"]]),data={...basePackage,sections:{brief:{name:"Import"}}},snapshot=snapshotProjectSections(store.getItem,data);
  store.setItem(briefKey,"newer");const archive=createOriginalRecordsArchive(snapshot);assert.deepEqual(archive.records,{[briefKey]:"original"});
});
test("redacted-copy warning does not promise anonymity outside the brief",()=>{
  const p={...basePackage,privacy:"share-safe",sections:{patterns:["private note"]}},result=validateProjectPackage(p);assert.equal(result.ok,true);assert.match(result.warnings.join(" "),/Other sections and project names/);
});
test("inherited sections are never restored",()=>{
  const store=memory(),data={...basePackage,sections:Object.create({brief:{name:"inherited"}})};assert.equal(restoreProjectPackageSafely(data,store),0);assert.equal(store.values.size,0);
});
