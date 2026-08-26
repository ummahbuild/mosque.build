import test from "node:test";
import assert from "node:assert/strict";
import {area,pointInPolygon,saffLayout,takeoffLine,withWaste,scoreAlternative} from "../src/core_next_tasks.mjs";

const room=[{x:0,y:0},{x:8,y:0},{x:8,y:5},{x:0,y:5}];
test("area",()=>assert.equal(area(room),40));
test("point in polygon",()=>{assert.equal(pointInPolygon({x:1,y:1},room),true);assert.equal(pointInPolygon({x:9,y:1},room),false);});
test("saff creates rows and usable positions",()=>{
 const s=saffLayout(room,{qiblaDeg:0,rowSpacing:1,personWidth:0.5,obstacles:[{x:4,y:2.5,radius:0.6}]});
 assert.ok(s.rowCount>0); assert.ok(s.theoretical>s.usable);
});
test("takeoff net wall area",()=>assert.equal(takeoffLine({formula:"net_wall_area"},{length:5,height:3,openingArea:3}),12));
test("waste",()=>assert.equal(withWaste(100,7),107));
test("sourcing hard gate",()=>assert.equal(scoreAlternative({failedGates:["technical"]},{technical_fit:30}).eligible,false));
test("sourcing weighted",()=>{
 const r=scoreAlternative({technical_fit:90,landed_cost:80,confidence:80},{technical_fit:70,landed_cost:30});
 assert.equal(Math.round(r.score),87);
});
