
import test from "node:test";
import assert from "node:assert/strict";
import {
 polygonArea,pointInPolygon,segmentsIntersect,polygonIntersectsPolygon,
 extractClosedCycles,smallestRoomCycles,rectanglePolygon,doorSwingPolygon,saffLayoutV2,
 runTakeoff,explodeAssemblies,costRollup,maturityScore
} from "../src/core_algorithms_v26.mjs";

const rectWalls=[
{id:"w1",a:{x:0,y:0},b:{x:4,y:0}},
{id:"w2",a:{x:4,y:0},b:{x:4,y:3}},
{id:"w3",a:{x:4,y:3},b:{x:0,y:3}},
{id:"w4",a:{x:0,y:3},b:{x:0,y:0}}
];

test("polygon area",()=>assert.equal(polygonArea([{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}]),12));
test("point inclusion",()=>assert.equal(pointInPolygon({x:2,y:1},[{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}]),true));
test("segment intersection",()=>assert.equal(segmentsIntersect({x:0,y:0},{x:2,y:2},{x:0,y:2},{x:2,y:0}),true));
test("closed cycle extraction",()=>assert.ok(extractClosedCycles(rectWalls).length>=1));
test("smallest room cycle area",()=>assert.equal(polygonArea(smallestRoomCycles(rectWalls)[0]),12));
test("polygon intersection",()=>{
 const a=rectanglePolygon(0,0,2,2),b=rectanglePolygon(1,0,2,2);
 assert.equal(polygonIntersectsPolygon(a,b),true);
});
test("door swing polygon",()=>assert.ok(doorSwingPolygon({x:0,y:0},1,0,90,8).length===10));
test("saff obstacle exclusion",()=>{
 const room=[{x:0,y:0},{x:6,y:0},{x:6,y:4},{x:0,y:4}];
 const obstacle=rectanglePolygon(3,2,1,1);
 const s=saffLayoutV2(room,{rowSpacing:1,personWidth:.5,obstaclePolygons:[obstacle]});
 assert.ok(s.theoretical>s.usable); assert.ok(s.blocked>0); assert.ok(s.rowContinuity<1);
});
test("takeoff assembly explosion",()=>{
 const rules=[{key:"carpet",object_kind:"space",formula:"floor_area",unit:"m2",waste_default_pct:10}];
 const lines=runTakeoff([{id:"r1",kind:"space",area:100}],rules);
 const exp=explodeAssemblies(lines,[{key:"prayer_carpet_system",takeoff_rule:"carpet",cost_inputs:["underlay","carpet"]}]);
 assert.equal(exp.length,2); assert.equal(exp[0].quantity,110);
});
test("cost rollup unknown preserved",()=>{
 const r=costRollup([{component:"carpet",quantity:10},{component:"unknown",quantity:1}],{carpet:20});
 assert.equal(r.total,200); assert.equal(r.unknown,1);
});
test("maturity score",()=>assert.equal(maturityScore({geometryVerified:100,quantityConfidence:80,pricedShare:60,quoteShare:20}),65));
