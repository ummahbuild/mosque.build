import test from "node:test";
import assert from "node:assert/strict";
import {newProjectDraft,safeProjectDraft} from "../apps/web/lib/project-draft.ts";
import {parseMosqueConcept} from "../apps/web/lib/concept-onboarding.ts";
import {readFileSync} from "node:fs";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
const source=readFileSync(new URL("../apps/web/lib/concept-brief-review.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace('"./project-draft"',JSON.stringify(new URL("../apps/web/lib/project-draft.ts",import.meta.url).href));
const {mergeReviewedConcept,conceptReviewFields}=await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);

const proposal=parseMosqueConcept("A Moroccan mosque in Rabat for 400 worshippers with a school, 3 storeys, under USD 1 million.");
const existing={...newProjectDraft(),name:"Existing brief",type:"Mosque expansion",location:"Existing location",budget:"50000",currency:"EUR",notes:"Existing notes",style:["Swahili"],storeys:"1"};
test("no selected suggestions leaves existing brief untouched, including unnamed projects",()=>{
  for(const current of [existing,{...existing,name:""},newProjectDraft()])assert.deepEqual(mergeReviewedConcept(current,proposal,[]),current);
});
test("every field can be individually accepted without overwriting unrelated data",()=>{
  for(const field of conceptReviewFields){
    const result=mergeReviewedConcept(existing,proposal,[field]);
    for(const key of Object.keys(existing))if(key!==field&&!(field==="budget"&&key==="currency"))assert.deepEqual(result[key],existing[key],`${field} changed ${key}`);
    assert.ok(safeProjectDraft(result));
  }
  assert.equal(existing.type,"Mosque expansion");
});
test("programs merge, styles/storeys persist, and raw source is appended only when accepted",()=>{
  const result=mergeReviewedConcept(existing,proposal,["needs","style","storeys","notes"]);
  assert.ok(result.needs.includes("Prayer hall"));assert.ok(result.needs.includes("Madrasa / classrooms"));
  assert.deepEqual(result.style,["Moroccan"]);assert.equal(result.storeys,"3");
  assert.equal(result.notes,`${existing.notes}\n\n${proposal.notes}`);
  assert.deepEqual(safeProjectDraft(JSON.parse(JSON.stringify(result))),result);
});
test("currency and amount form one reviewed change; unknown currency never inherits the previous one",()=>{
  const result=mergeReviewedConcept(existing,parseMosqueConcept("Budget 700000"),["budget"]);
  assert.equal(result.budget,"700000");assert.equal(result.currency,"");
  assert.equal(mergeReviewedConcept(existing,proposal,["location"]).currency,"EUR");
});
test("oversized notes and unsupported suggestions cannot replace existing data",()=>{
  assert.throws(()=>mergeReviewedConcept({...existing,notes:"a".repeat(30000)},proposal,["notes"]),/unchanged/);
  assert.throws(()=>mergeReviewedConcept(existing,{...proposal,type:"unknown"},["type"]),/unchanged/);
  assert.throws(()=>mergeReviewedConcept(existing,proposal,["owner"]),/Unsupported/);
});
test("small mosque does not accidentally match mall conversion",()=>{
  assert.equal(parseMosqueConcept("A small mosque for 50 people").type,"New mosque");
  assert.equal(parseMosqueConcept("A 35-person musalla").type,"Prayer room / musalla");
});
test("ranges, dimensions, unit rates and negated needs are not silently promoted to confirmed values",()=>{
  for(const text of ["300–500 people", "300 to 500 worshippers", "300 or 500 attendees"]){const c=parseMosqueConcept(text);assert.equal(c.attendance,"");assert.ok(c.warnings.length);}
  for(const text of ["A wall under 1m", "budget USD 100 per person", "budget 90 per square metre"]){const c=parseMosqueConcept(text);assert.equal(c.budget,"");assert.ok(c.warnings.length);}
  for(const text of ["A mosque without a school.","A mosque, no madrasa or library.","Do not include classrooms."]){const c=parseMosqueConcept(text);assert.ok(!c.needs.includes("Madrasa / classrooms"));assert.notEqual(c.type,"Mosque + madrasa");assert.ok(c.warnings.length);}
});
