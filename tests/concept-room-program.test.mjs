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

const {draftChoices}=await import('../apps/web/lib/project-draft.ts');
const expectedIds={"Prayer hall":"prayer","Wudu":"wudu","Madrasa / classrooms":"classrooms","Women / family":"family","Library":"library","Community hall":"community","Accessibility":"access","Parking":"parking","Youth":"youth","Kitchen / iftar":"kitchen","Janazah":"janazah","Waqf / income-generating space":"waqf"};
for(const need of draftChoices.needs)test(`brief need has a corresponding room requirement: ${need}`,()=>{
 const fields={...parseMosqueConcept('A mosque for 300 people.'),needs:[need],evidence:undefined};
 const plan=deriveConceptProgram(fields),room=plan.rooms.find(room=>room.id===expectedIds[need]);
 assert.ok(room,need);assert.equal(room.reviewRequired,true);assert.ok(room.basis.length>25);
 if(need!=='Prayer hall')assert.equal(room.areaM2,null);
 assert.equal(plan.totalAreaM2,null);assert.equal(plan.rooms.length,need==='Prayer hall'?1:2);
});
test('all supported needs appear exactly once and support areas are never invented',()=>{
 const fields={...parseMosqueConcept('A mosque for 300 people.'),needs:[...draftChoices.needs,...draftChoices.needs],evidence:undefined};
 const before=structuredClone(fields),plan=deriveConceptProgram(fields);
 assert.equal(plan.rooms.length,draftChoices.needs.length);assert.equal(new Set(plan.rooms.map(room=>room.id)).size,plan.rooms.length);
 assert.ok(plan.rooms.filter(room=>room.id!=='prayer').every(room=>room.areaM2===null));assert.deepEqual(fields,before);
 plan.rooms[1].label='Changed output';assert.notEqual(deriveConceptProgram(fields).rooms[1].label,'Changed output');
});
for(const [phrase,id] of [['youth space','youth'],['kitchen for iftar','kitchen'],['janazah facilities','janazah']])test(`parser-recognized requirement reaches the room program: ${phrase}`,()=>{
 const fields=parseMosqueConcept(`A mosque for 300 people with ${phrase}.`),plan=deriveConceptProgram(fields);
 assert.equal(fields.evidence.needs.status,'suggested');assert.ok(plan.rooms.some(room=>room.id===id));
 assert.equal(plan.rooms.find(room=>room.id===id).areaM2,null);
});
for(const text of ['A mosque without a kitchen or youth space.','A mosque, no janazah facilities.'])test(`negated needs remain absent: ${text}`,()=>{
 const plan=deriveConceptProgram(parseMosqueConcept(text));assert.deepEqual(plan.rooms.map(room=>room.id),['prayer']);
});
for(const status of ['ambiguous','unspecified','missing'])test(`stale needs with ${status} evidence do not create room requirements`,()=>{
 const fields=parseMosqueConcept('A mosque with youth, kitchen and janazah facilities.');
 fields.evidence.needs=status==='missing'?undefined:{...fields.evidence.needs,status};
 const plan=deriveConceptProgram(fields);assert.deepEqual(plan.rooms.map(room=>room.id),['prayer']);assert.ok(plan.warnings.some(w=>w.includes('require clarification')));
});
test('unrecognized or unreadable program needs remain visible as review gaps',()=>{
 const base={...parseMosqueConcept('A mosque for 300 people.'),evidence:undefined};
 for(const needs of [null,{},'Youth']){const plan=deriveConceptProgram({...base,needs});assert.deepEqual(plan.rooms.map(r=>r.id),['prayer']);assert.ok(plan.warnings.some(w=>w.includes('could not be read')))}
 const plan=deriveConceptProgram({...base,needs:['Youth','Unrecognized program',null]});assert.deepEqual(plan.rooms.map(r=>r.id),['prayer','youth']);assert.ok(plan.warnings.some(w=>w.includes('not supported')));
});
test('missing attendance leaves every requested space unresolved',()=>{
 const plan=deriveConceptProgram(parseMosqueConcept('A mosque with youth space, kitchen and janazah facilities.'));
 assert.equal(plan.rooms.length,4);assert.ok(plan.rooms.every(room=>room.areaM2===null));assert.equal(plan.totalAreaM2,null);
});
