import test from"node:test";import assert from"node:assert/strict";import fs from"node:fs";import{floorPlanChecks,floorPlanSummary,fromSchematic,newFloorPlan,safeFloorPlan,FLOOR_PLAN_SCHEMA}from"../apps/web/lib/floor-plan-workspace.ts";import{createSchematicPlan}from"../apps/web/lib/schematic-plan.ts";import{projectSections}from"../apps/web/lib/project-package.ts";
import {removePlanSpace} from "../apps/web/lib/floor-plan-workspace.ts";
const plan=createSchematicPlan({scenario:"compact",widthM:20,depthM:24,wallM:.2,qiblaDeg:45,verification:"user_estimate"});
test("floor-plan restore rejects unusable levels, duplicate IDs and malformed relationships",()=>{
  const state=fromSchematic(plan);
  for(const mutate of [
    x=>{x.activeLevelId="missing";},
    x=>{x.levels.push({...x.levels[0]});},
    x=>{x.spaces.push({...x.spaces[0]});},
    x=>{x.spaces[0].levelId="missing";},
    x=>{x.spaces[0].adjacentTo=[{}];},
    x=>{x.spaces[0].separateFrom=[12];},
    x=>{x.spaces[0].id="";},
    x=>{x.footprint.widthM=0;},
  ]){const bad=structuredClone(state);mutate(bad);assert.equal(safeFloorPlan(bad),null);}
  assert.ok(safeFloorPlan(state));
});
test("room removal cleans both relationship lists and attached records while retaining unrelated work",()=>{
  const state=fromSchematic(plan),removed=state.spaces[0].id,retained=state.spaces[1].id;
  state.spaces[1].adjacentTo=[removed];state.spaces[1].separateFrom=[removed];
  state.openings=[{id:"remove-opening",spaceId:removed},{id:"keep-opening",spaceId:retained}];
  state.annotations=[{id:"remove-note",spaceId:removed},{id:"keep-note",spaceId:retained}];
  const result=removePlanSpace(state,removed);
  assert.equal(state.spaces.length,4);assert.equal(result.spaces.length,3);
  assert.deepEqual(result.spaces[0].adjacentTo,[]);assert.deepEqual(result.spaces[0].separateFrom,[]);
  assert.deepEqual(result.openings.map(o=>o.id),["keep-opening"]);assert.deepEqual(result.annotations.map(a=>a.id),["keep-note"]);
});
test("opening checks detect overhanging edges and heads above the room",()=>{
  const state=fromSchematic(plan),host=state.spaces[0];
  state.openings=[{id:"edge",levelId:host.levelId,spaceId:host.id,label:"Entry",hostEdge:"south",offsetM:0,widthM:1,heightM:2},
    {id:"high",levelId:host.levelId,spaceId:host.id,label:"Window",hostEdge:"west",offsetM:host.depthM/2,widthM:1,heightM:2,sillM:host.clearHeightM}];
  const issues=floorPlanChecks(state).map(c=>c.label);
  assert.ok(issues.includes("Opening outside host edge"));assert.ok(issues.includes("Opening above room height"));
});
test("floor-plan workspace is bounded portable and renderer neutral",()=>{const state=fromSchematic(plan);assert.equal(state.schema,FLOOR_PLAN_SCHEMA);assert.equal(safeFloorPlan(state)?.spaces.length,4);assert.equal(safeFloorPlan({...state,spaces:Array(301).fill(state.spaces[0])}),null);assert.equal(projectSections.find(x=>x.id==="floorPlanWorkspace")?.key,"mosque-build.floor-plan.v1");assert.doesNotMatch(fs.readFileSync(new URL("../apps/web/lib/floor-plan-workspace.ts",import.meta.url),"utf8"),/THREE\.Mesh|Babylon|Filament/)});
test("geometry checks expose overlaps bounds and broken references",()=>{const state=fromSchematic(plan),a=state.spaces[0],broken={...state,spaces:[...state.spaces,{...a,id:"overlap",adjacentTo:["missing"]},{...a,id:"outside",xM:30}]};const labels=floorPlanChecks(broken).map(x=>x.label);assert.ok(labels.includes("Space overlap"));assert.ok(labels.includes("Outside footprint"));assert.ok(labels.includes("Broken room relationship"));assert.ok(floorPlanSummary(broken).blockers>0)});
test("floor-plan UI declares conceptual review boundaries",()=>{const ui=fs.readFileSync(new URL("../apps/web/components/floor-plan-workspace.tsx",import.meta.url),"utf8");for(const phrase of["not establish code compliance","Professional review boundary","not occupancy calculations","Copy current schematic","Accessible journey intended","scenario:\"community\""])assert.match(ui,new RegExp(phrase,"i"));assert.doesNotMatch(ui,/fully compliant|approved drawing|safe capacity/i)});
