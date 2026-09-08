import assert from "node:assert/strict";
import test from "node:test";
import {createProjectPackage,PROJECT_PACKAGE_SCHEMA,projectSections,restoreProjectPackage,validateProjectPackage} from "../apps/web/lib/project-package.ts";

test("share-safe project package redacts sensitive brief fields",()=>{
  const values=new Map([["mosque-build.project-draft.v2",JSON.stringify({name:"Community project",location:"Private location",owner:"Private person",email:"private@example.test",notes:"Private notes",needs:["Prayer hall"]})],["mosque-build.pattern-shortlist.v1",JSON.stringify(["iran-cross-star"])]]);
  const result=createProjectPackage(key=>values.get(key)??null,"share-safe","2026-09-08T10:00:00.000Z");
  assert.equal(result.schema,PROJECT_PACKAGE_SCHEMA);assert.equal(result.privacy,"share-safe");assert.deepEqual(result.sections.brief,{name:"Community project",location:"",owner:"",email:"",notes:"",needs:["Prayer hall"]});assert.deepEqual(result.sections.patterns,["iran-cross-star"]);
});

test("validator rejects foreign and empty package data",()=>{
  assert.equal(validateProjectPackage({schema:"other",product:"other",sections:{}}).ok,false);
  assert.equal(validateProjectPackage({schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z",sections:{}}).ok,false);
});

test("restore writes only allowlisted supported sections",()=>{
  const input={schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z",sections:{brief:{name:"Restored"},patterns:["one"],unknown:{unsafe:true}}};
  const checked=validateProjectPackage(input);assert.equal(checked.ok,true);if(!checked.ok)return;const written=new Map();const count=restoreProjectPackage(checked.data,(key,value)=>written.set(key,value));assert.equal(count,2);assert.equal(written.size,2);assert.equal(written.has(projectSections.find(item=>item.id==="brief").key),true);assert.equal([...written.values()].some(value=>value.includes("unsafe")),false);
});

test("design intelligence is a portable allowlisted section",()=>{
  const section=projectSections.find(item=>item.id==="designIntelligence");assert.equal(section?.key,"mosque-build.masjid-intelligence.v1");
  const values=new Map([[section.key,JSON.stringify({schemaVersion:"mosque.build/masjid-intelligence@1",selected:"phased"})]]);const result=createProjectPackage(key=>values.get(key)??null,"share-safe","2026-09-08T10:00:00.000Z");assert.equal(result.sections.designIntelligence.selected,"phased");
});

test("validator rejects prototype keys and resource-exhaustion shapes",()=>{
  const base={schema:PROJECT_PACKAGE_SCHEMA,product:"mosque.build",privacy:"share-safe",exportedAt:"2026-09-08T10:00:00.000Z"};
  const poisoned=JSON.parse('{"brief":{"__proto__":{"polluted":true}}}');
  const checked=validateProjectPackage({...base,sections:poisoned});assert.equal(checked.ok,false);if(!checked.ok)assert.match(checked.errors.join(" "),/forbidden object key/);
  let deep={value:true};for(let index=0;index<22;index++)deep={next:deep};
  const nested=validateProjectPackage({...base,sections:{brief:deep}});assert.equal(nested.ok,false);if(!nested.ok)assert.match(nested.errors.join(" "),/nesting depth/);
  const oversized=validateProjectPackage({...base,sections:{brief:{notes:"x".repeat(100_001)}}});assert.equal(oversized.ok,false);if(!oversized.ok)assert.match(oversized.errors.join(" "),/oversized text/);
});
