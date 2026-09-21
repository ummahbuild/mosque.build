import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {applyBuildingPreset,buildingErrors,buildingPresets,buildingToFloorPlan,createBuilding,defaultBuilding,safeBuilding} from "../apps/web/lib/parametric-building.ts";
import {newFloorPlan,safeFloorPlan,floorPlanChecks} from "../apps/web/lib/floor-plan-workspace.ts";
import {exportBuildingIfc,buildingIfcGuid,ifcText} from "../apps/web/lib/building-ifc.ts";
import {projectSections} from "../apps/web/lib/project-package.ts";
import {workflowNodes} from "../apps/web/lib/workflow-integration.ts";

const area=pts=>pts.reduce((sum,p,i)=>{const q=pts[(i+1)%pts.length];return sum+p[0]*q[1]-q[0]*p[1];},0)/2;
test("all architectural templates produce finite positive swept geometry at dimension limits",()=>{
  for(const preset of buildingPresets) for(const size of ["small","default","large"]) {
    const p=applyBuildingPreset(defaultBuilding(),preset.id);
    if(size==="small")Object.assign(p,{widthM:10,depthM:10,heightM:3.2,wallM:.8,slabM:.6,doorHeightM:2,bays:9,domeRiseM:1});
    if(size==="large")Object.assign(p,{widthM:60,depthM:80,heightM:12,wallM:.15,slabM:.15,doorWidthM:5,doorHeightM:4,bays:3,domeRiseM:12});
    const m=createBuilding(p);assert.equal(m.elements.length,new Set(m.elements.map(e=>e.id)).size);
    for(const e of m.elements) for(const s of e.solids) {
      if(s.kind!=="extrusion")continue;
      assert.ok(s.depth>0,`${preset.id}: ${e.id} depth`);assert.ok(area(s.profile)>0,`${preset.id}: ${e.id} profile winding`);
      assert.ok([...s.origin,...s.profile.flat(),...s.holes.flat(2)].every(Number.isFinite));
      assert.ok(Math.abs(area(s.profile))>s.holes.reduce((sum,h)=>sum+Math.abs(area(h)),0));
      for(let i=0;i<s.profile.length;i++)assert.notDeepEqual(s.profile[i],s.profile[(i+1)%s.profile.length]);
    }
  }
});
test("dome is a closed oriented shell with positive volume and a real hollow interior",()=>{
  const dome=createBuilding(defaultBuilding()).elements.find(e=>e.id==="roof-dome").solids[0],edges=new Map();let volume=0;
  for(const face of dome.faces) {
    const [a,b,c]=face.map(i=>dome.vertices[i]);
    volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
    for(let i=0;i<3;i++){const x=face[i],y=face[(i+1)%3],key=[x,y].sort((a,b)=>a-b).join(":");const entry=edges.get(key)||[];entry.push(x<y?1:-1);edges.set(key,entry);}
  }
  assert.ok(volume>0&&volume<200);for(const directions of edges.values()){assert.equal(directions.length,2);assert.equal(directions[0]+directions[1],0);}
  const deck=createBuilding(defaultBuilding()).elements.find(e=>e.id==="roof-deck").solids[0];assert.equal(deck.holes.length,1);
});
test("entrance and side windows have hosts and no wall solid fills the opening",()=>{
  const model=createBuilding(defaultBuilding());
  for(const opening of model.elements.filter(e=>e.role==="opening")) {
    const host=model.elements.find(e=>e.id===opening.hostId);assert.equal(host.ifcClass,"IfcWall");
    const o=opening.solids[0],center=[o.origin[0]+o.profile[2][0]/2,o.origin[1]+o.profile[2][1]/2,o.origin[2]+o.depth/2];
    for(const solid of host.solids)assert.ok(!center.every((n,i)=>n>solid.origin[i]+1e-6&&n<solid.origin[i]+(i===2?solid.depth:solid.profile[2][i])-1e-6));
  }
});
test("invalid imports are rejected without exceptions and unknown fields are removed",()=>{
  for(const value of [null,[],{},"abc",{...defaultBuilding(),widthM:NaN},{...defaultBuilding(),roof:"unknown"},{...defaultBuilding(),bays:3.5},{...defaultBuilding(),doorHeightM:4,heightM:3.2},{...defaultBuilding(),referenceNotes:"x".repeat(2001)}])assert.equal(safeBuilding(value),null);
  assert.equal(safeBuilding({...defaultBuilding(),secret:"excluded"}).secret,undefined);
  assert.throws(()=>createBuilding({...defaultBuilding(),depthM:-2}));assert.equal(buildingErrors(defaultBuilding()).length,0);
});
test("preset changes preserve user dimensions and notes",()=>{
  const original={...defaultBuilding(),widthM:31.5,referenceNotes:"Study daylight"},next=applyBuildingPreset(original,"swahili-threshold");
  assert.equal(next.widthM,31.5);assert.equal(next.referenceNotes,original.referenceNotes);assert.equal(next.roof,"pitched");assert.equal(original.roof,"dome");
});
test("floor-plan handoff produces valid non-overlapping rooms and never overwrites existing work",()=>{
  for(const preset of buildingPresets){const p=applyBuildingPreset(defaultBuilding(),preset.id),initial=newFloorPlan(),plan=buildingToFloorPlan(p,initial);
    assert.ok(safeFloorPlan(plan));assert.equal(floorPlanChecks(plan).filter(c=>c.severity==="blocker").length,0);
    assert.equal(plan.spaces[0].widthM,p.widthM-2*p.wallM);assert.equal(plan.openings.length,1+2*p.bays);assert.equal(initial.spaces.length,0);
    assert.throws(()=>buildingToFloorPlan(p,plan),/already contains work/);
    assert.equal(plan.spaces[0].accessibleJourney,false);
  }
});
test("IFC exports real solids, containment, voids, unique identifiers and safe strings",()=>{
  const model=createBuilding(defaultBuilding());model.elements[0].name="Test ' ; Café \\ reference";
  const ifc=exportBuildingIfc(model),ids=[...ifc.matchAll(/^#(\d+)=/gm)].map(m=>m[1]),known=new Set(ids);
  assert.equal(known.size,ids.length);for(const match of ifc.matchAll(/#(\d+)/g))assert.ok(known.has(match[1]));
  for(const entity of ["IFCEXTRUDEDAREASOLID","IFCFACETEDBREP","IFCRELVOIDSELEMENT","IFCRELCONTAINEDINSPATIALSTRUCTURE","IFCPROPERTYSET","IFCUNITASSIGNMENT"])assert.ok(ifc.includes(entity));
  assert.equal((ifc.match(/IFCRELVOIDSELEMENT\(/g)||[]).length,model.elements.filter(e=>e.role==="opening").length);
  assert.ok(ifc.includes("Test '' ; Caf\\X2\\00E9\\X0\\"));assert.equal(ifcText("a'b"),"'a''b'");
  const guids=model.elements.map(e=>buildingIfcGuid(e.id));assert.equal(new Set(guids).size,guids.length);for(const id of guids)assert.match(id,/^[0-3][0-9A-Za-z_$]{21}$/);
  assert.equal(buildingIfcGuid("wall"),buildingIfcGuid("wall"));
  assert.equal(projectSections.find(s=>s.id==="parametricBuilding").key,"mosque-build.parametric-building.v1");
  assert.equal(workflowNodes.find(s=>s.id==="parametricBuilding").href,"/design#building-geometry");
});
test("independent IFC4 schema validation and geometry tessellation",{skip:!process.env.IFC_VALIDATION_PYTHON},()=>{
  const directory=mkdtempSync(join(tmpdir(),"mosque-building-ifc-"));
  for(const preset of buildingPresets)writeFileSync(join(directory,`${preset.id}.ifc`),exportBuildingIfc(createBuilding(applyBuildingPreset(defaultBuilding(),preset.id))));
  const run=spawnSync(process.env.IFC_VALIDATION_PYTHON,["scripts/validate-building-ifc.py",directory],{encoding:"utf8",timeout:120000});
  assert.equal(run.status,0,run.stdout+run.stderr);
});
