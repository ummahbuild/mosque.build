import test from "node:test";
import assert from "node:assert/strict";
import {PROJECT_DRAFT_KEY,LEGACY_DRAFT_KEY,DRAFT_RECOVERY_KEY,MAX_DRAFT_LENGTH,MAX_DRAFT_FILE_BYTES,newProjectDraft,safeProjectDraft,parseProjectDraft,readProjectDraft,persistProjectDraft,initialDraftStep} from "../apps/web/lib/project-draft.ts";

function memory(entries=[]) {const values=new Map(entries);return {values,getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};}
test("malformed drafts and unsupported versions/types never become usable drafts",()=>{
  for(const raw of ["", "{", "null", "[]", "42", "{}", JSON.stringify({schema:"future",name:"Study"}), JSON.stringify({name:12}), JSON.stringify({owner:[]}), JSON.stringify({needs:"Prayer hall"}), JSON.stringify({needs:[{}]}), JSON.stringify({needs:["not an option"]}), JSON.stringify({type:"unknown"}), JSON.stringify({currency:"invented"}), JSON.stringify({team:["Architect","Architect"]}), JSON.stringify({notes:null}), JSON.stringify({__futureField:true}), "x".repeat(MAX_DRAFT_LENGTH+1)])assert.equal(parseProjectDraft(raw),null,raw.slice(0,80));
  assert.equal(safeProjectDraft(Object.create(null)),null);
  for(const value of [{name:null},{type:null},{name:"A",projectName:"B"},{type:"New mosque",projectType:"Mosque expansion"}])assert.equal(safeProjectDraft(value),null);
});
test("legacy names and partial known drafts restore without modifying the saved source",()=>{
  const raw=JSON.stringify({projectName:"Local study",projectType:"Mosque expansion",needs:[]});
  const storage=memory([[LEGACY_DRAFT_KEY,raw]]),snapshot=readProjectDraft(storage),draft=parseProjectDraft(snapshot.raw);
  assert.equal(draft.name,"Local study");assert.equal(draft.type,"Mosque expansion");assert.deepEqual(draft.needs,[]);
  assert.equal(storage.getItem(PROJECT_DRAFT_KEY),null);assert.equal(storage.getItem(LEGACY_DRAFT_KEY),raw);
  assert.equal(safeProjectDraft({...newProjectDraft(),futureField:1}),null);
});
test("a corrupt current draft cannot be hidden by a valid legacy fallback",()=>{
  const storage=memory([[PROJECT_DRAFT_KEY,""],[LEGACY_DRAFT_KEY,JSON.stringify(newProjectDraft())]]);
  assert.deepEqual(readProjectDraft(storage),{key:PROJECT_DRAFT_KEY,raw:""});
  assert.equal(parseProjectDraft(readProjectDraft(storage).raw),null);
});
test("valid multilingual briefs fit the recovery upload limit with their export envelope",()=>{
  const draft={...newProjectDraft(),notes:"漢".repeat(30000),name:"漢".repeat(2000),location:"漢".repeat(2000),owner:"漢".repeat(2000)};
  assert.ok(safeProjectDraft(draft));
  const exported=JSON.stringify({schema:"mosque.build/project-brief@1",project:draft});
  assert.ok(Buffer.byteLength(exported)>100000);assert.ok(Buffer.byteLength(exported)<MAX_DRAFT_FILE_BYTES);
  assert.deepEqual(parseProjectDraft(JSON.stringify(draft)),draft);
});
test("explicit replacement preserves exact raw backup and unrelated project data",()=>{
  const storage=memory([[PROJECT_DRAFT_KEY,"{broken"],["mosque-build.cad-authoring.v1","drawing"]]);
  const snapshot=persistProjectDraft(storage,newProjectDraft(),readProjectDraft(storage),true);
  assert.equal(JSON.parse(storage.getItem(DRAFT_RECOVERY_KEY)).raw,"{broken");
  assert.equal(storage.getItem("mosque-build.cad-authoring.v1"),"drawing");
  assert.ok(parseProjectDraft(snapshot.raw));
});
test("failed backup or write never removes an original draft",()=>{
  for(const failingKey of [DRAFT_RECOVERY_KEY,PROJECT_DRAFT_KEY]){
    const storage=memory([[PROJECT_DRAFT_KEY,"{broken"]]),set=storage.setItem;
    storage.setItem=(k,v)=>{if(k===failingKey)throw new Error("Quota exceeded");set(k,v)};
    assert.throws(()=>persistProjectDraft(storage,newProjectDraft(),readProjectDraft(storage),true),/Quota/);
    assert.equal(storage.getItem(PROJECT_DRAFT_KEY),"{broken");
  }
});
test("stale tabs cannot overwrite newer data or resurrect a removed brief",()=>{
  const storage=memory(),snapshot=readProjectDraft(storage);
  storage.setItem(PROJECT_DRAFT_KEY,JSON.stringify({...newProjectDraft(),name:"Other tab"}));
  assert.throws(()=>persistProjectDraft(storage,newProjectDraft(),snapshot),/another tab/);
  const current=readProjectDraft(storage);storage.values.delete(PROJECT_DRAFT_KEY);
  assert.throws(()=>persistProjectDraft(storage,newProjectDraft(),current),/another tab/);
});
test("incomplete saved drafts return to a reachable step; completed drafts resume first plan",()=>{
  for(const stored of [null,"NaN","Infinity","5","99","-1"])assert.equal(initialDraftStep(newProjectDraft(),stored),0);
  const draft={...newProjectDraft(),name:"Study",location:"User location",owner:"Trustee"};
  assert.equal(initialDraftStep(draft,"2"),5);
  assert.equal(initialDraftStep({...draft,needs:[]},"5"),1);
});
