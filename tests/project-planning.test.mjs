import test from "node:test";
import assert from "node:assert/strict";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
import fs from "node:fs";
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name);const module={exports:{}};cache.set(name,module.exports);const js=ts.transpileModule(fs.readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function("require","module","exports",js)(id=>load(id.replace("@/lib/","").replace("./","")),module,module.exports);return module.exports;}
const api=load("project-planning");
const task=(patch={})=>({id:"a",name:"Brief",phase:"Brief",start:"2026-01-01",finish:"2026-01-10",progress:50,status:"in-progress",dependsOn:[],responsibleRole:"Lead",evidenceRef:"",notes:"",...patch});
test("phase rollups expose progress and readiness gaps",()=>{const rows=api.phaseRollups([task(),task({id:"b",progress:100,status:"complete",responsibleRole:"",start:"2026-01-11",finish:"2026-01-20"})]);assert.equal(rows[0].progress,75);assert.equal(rows[0].missingOwner,1);assert.equal(rows[0].missingEvidence,1)});
test("lookahead includes activities intersecting the window",()=>{const rows=api.lookahead([task(),task({id:"b",start:"2026-03-01",finish:"2026-03-10"})],"2026-01-05",30);assert.deepEqual(rows.map(x=>x.id),["a"])});
test("role load groups scheduled duration",()=>{const rows=api.roleLoad([task(),task({id:"b",responsibleRole:"",start:"2026-01-11",finish:"2026-01-12"})]);assert.equal(rows.find(x=>x.role==="Lead").days,10);assert.equal(rows.find(x=>x.role==="Unassigned").tasks,1)});
test("accepted milestones require evidence",()=>{const milestone={id:"m",title:"Review",targetDate:"2026-02-01",phase:"Design",ownerRole:"Design lead",status:"accepted",evidenceRef:"",acceptanceCriteria:"Recorded review"};assert.equal([...api.milestoneGaps(milestone)].join(","),"acceptance evidence");milestone.evidenceRef="record-1";assert.equal(api.milestoneGaps(milestone).length,0)});
test("safe parser rejects oversized and unsafe state",()=>{const state=api.createProjectPlanning("2026-01-01");assert.equal(api.safeProjectPlanning(state).schema,api.PROJECT_PLANNING_SCHEMA);assert.equal(api.safeProjectPlanning({...state,scenarioShiftDays:999}),null);assert.equal(api.safeProjectPlanning({...state,milestones:Array(101).fill({})}),null)});

test("empty and malformed lookahead dates do not throw or invent dates",()=>{for(const date of ["","bad","2026-02-30"]){assert.equal(api.addDays(date,30),"");assert.deepEqual(api.lookahead([task()],date,30),[])}});
test("30-day lookahead counts the start day once",()=>{const rows=api.lookahead([task({id:"last",start:"2026-01-30",finish:"2026-01-30"}),task({id:"outside",start:"2026-01-31",finish:"2026-01-31"})],"2026-01-01",30);assert.deepEqual(rows.map(x=>x.id),["last"])});
test("non-finite and fractional date shifts are rejected",()=>{for(const n of [Infinity,NaN,1.5,1e20])assert.equal(api.addDays("2026-01-01",n),"")});
test("phase dates ignore undated rows without introducing an empty minimum",()=>{const row=api.phaseRollups([task(),task({id:"b",start:"",finish:""})])[0];assert.equal(row.start,"2026-01-01");assert.equal(row.finish,"2026-01-10");assert.equal(row.progress,50)});
test("invalid date windows and NaN planning shifts are rejected",()=>{const plan=api.createProjectPlanning("2026-01-01");assert.equal(api.safeProjectPlanning({...plan,scenarioShiftDays:NaN}),null);assert.equal(api.safeProjectPlanning({...plan,anchorDate:"2026-02-30"}),null)});
