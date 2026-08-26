import test from "node:test";
import assert from "node:assert/strict";
import {polygonArea,wallQuantities,carpetQuantity,orderByDate} from "../src/engineering_math.mjs";
import {Outbox} from "../src/offline_outbox.mjs";

test("polygon area",()=>assert.equal(polygonArea([{x:0,y:0},{x:10,y:0},{x:10,y:5},{x:0,y:5}]),50));
test("wall quantities deduct openings",()=>{
 const q=wallQuantities({x:0,y:0},{x:5,y:0},3,0.2,2);
 assert.equal(q.length,5); assert.equal(q.grossArea,15); assert.equal(q.netArea,13); assert.equal(q.volume,2.6);
});
test("carpet waste",()=>assert.equal(carpetQuantity(100,7),107));
test("order by date",()=>assert.equal(orderByDate("2026-12-01",60,7),"2026-09-25"));
test("outbox idempotent enqueue",()=>{
 const o=new Outbox(); assert.equal(o.enqueue({id:"m1",type:"inspection"}),true);
 assert.equal(o.enqueue({id:"m1",type:"inspection"}),false); assert.equal(o.items.length,1);
});
