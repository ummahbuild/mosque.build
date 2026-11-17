import test from "node:test";
import assert from "node:assert/strict";
import {parseMosqueConcept} from "../apps/web/lib/concept-onboarding.ts";
import {deriveConceptProgram} from "../apps/web/lib/concept-room-program.ts";
test("room program derives only bounded conceptual prayer-zone area",()=>{
 const fields=parseMosqueConcept("A Moroccan mosque in Kilimani Nairobi for 450 worshippers with a madrasa and accessible wudu under USD 1 million");
 const plan=deriveConceptProgram(fields);
 assert.equal(plan.status,"conceptual");assert.equal(plan.attendance,450);assert.equal(plan.rooms.find(x=>x.id==="prayer")?.areaM2,563);
 assert.equal(plan.rooms.find(x=>x.id==="wudu")?.areaM2,null);
 assert.equal(plan.rooms.find(x=>x.id==="classrooms")?.areaM2,null);
 assert.equal(plan.totalAreaM2,null);
 assert.ok(plan.rooms.every(x=>x.reviewRequired));
});
test("unknown or malformed attendance never creates a fake area",()=>{
 const fields=parseMosqueConcept("A minimalist prayer room with wudu");
 const plan=deriveConceptProgram(fields);
 assert.equal(plan.attendance,null);assert.equal(plan.rooms[0].areaM2,null);
 assert.ok(plan.warnings.some(x=>x.includes("attendance")));
});
test("extreme capacity is not treated as a safe concept",()=>{
 const fields=parseMosqueConcept("Build a mosque for 999999 worshippers");
 const plan=deriveConceptProgram(fields);assert.equal(plan.attendance,null);assert.equal(plan.totalAreaM2,null);
});
