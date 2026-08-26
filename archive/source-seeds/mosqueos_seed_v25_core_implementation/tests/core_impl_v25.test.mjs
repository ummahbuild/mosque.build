
import test from "node:test";
import assert from "node:assert/strict";
import {snapPoint,buildAdjacency,danglingEndpoints,roomArea,runTakeoff,costRollup,localityTier} from "../src/core_impl_v25.mjs";

test("snap point",()=>assert.deepEqual(snapPoint({x:1.004,y:2.006},0.01),{x:1,y:2.01}));
test("adjacency for rectangle",()=>{
 const walls=[
  {id:"w1",a:{x:0,y:0},b:{x:4,y:0}},
  {id:"w2",a:{x:4,y:0},b:{x:4,y:3}},
  {id:"w3",a:{x:4,y:3},b:{x:0,y:3}},
  {id:"w4",a:{x:0,y:3},b:{x:0,y:0}}
 ];
 assert.equal(buildAdjacency(walls).size,4);
 assert.equal(danglingEndpoints(walls).length,0);
});
test("dangling wall detected",()=>{
 const walls=[{id:"w1",a:{x:0,y:0},b:{x:4,y:0}}];
 assert.equal(danglingEndpoints(walls).length,2);
});
test("room area",()=>assert.equal(roomArea([{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}]),12));
test("takeoff with waste",()=>{
 const rules=[{key:"carpet",object_kind:"space",formula:"floor_area",unit:"m2",waste_default_pct:10}];
 const lines=runTakeoff([{id:"r1",kind:"space",area:100}],rules);
 assert.equal(lines[0].quantity,110);
});
test("cost rollup preserves unknowns",()=>{
 const r=costRollup([{ruleKey:"carpet",quantity:10,unit:"m2"},{ruleKey:"unknown",quantity:1,unit:"ea"}],{carpet:20});
 assert.equal(r.total,200); assert.equal(r.details[1].cost,null);
});
test("locality tier",()=>assert.equal(localityTier({city:"Nairobi",country:"Kenya",region:"East Africa"},{city:"Mombasa",country:"Kenya",region:"East Africa"}),"same_country"));
