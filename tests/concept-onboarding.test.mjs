import test from "node:test";
import assert from "node:assert/strict";
import {parseMosqueConcept} from "../apps/web/lib/concept-onboarding.ts";
import fs from "node:fs";
test("parses Moroccan Nairobi school concept without AI",()=>{
 const x=parseMosqueConcept("Design a Moroccan mosque in Kilimani Nairobi for 450 worshippers with a madrasa under USD 1 million");
 assert.equal(x.location,"Kilimani Nairobi");assert.equal(x.attendance,"450");assert.equal(x.budget,"1000000");assert.equal(x.currency,"USD");assert.equal(x.type,"Mosque + madrasa");assert.ok(x.needs.includes("Madrasa / classrooms"));
});
test("small prayer conversion and floor counts",()=>{
 const x=parseMosqueConcept("Convert an existing mall space into an 80-person prayer room with accessible wudu, 3 storeys under $90k");
 assert.equal(x.attendance,"80");assert.equal(x.budget,"90000");assert.equal(x.storeys,"3");assert.equal(x.type,"Adaptive reuse / conversion");assert.ok(x.needs.includes("Accessibility"));
});
test("no numbers are invented and user input bounded",()=>{
 const x=parseMosqueConcept("A contemporary mosque with a library");assert.equal(x.attendance,"");assert.equal(x.budget,"");assert.equal(x.location,"");assert.equal(x.notes,"A contemporary mosque with a library");assert.equal(parseMosqueConcept("a".repeat(3500)).notes.length,3000);
});
test("onboarding requires explicit acceptance and never fetches an AI model",()=>{
 const wizard=fs.readFileSync(new URL("../apps/web/components/start-project-wizard.tsx",import.meta.url),"utf8");
 const prompt=fs.readFileSync(new URL("../apps/web/components/mosque-prompt-studio.tsx",import.meta.url),"utf8");
 assert.match(wizard,/Apply suggested fields/);assert.match(wizard,/Keep existing brief/);
 assert.match(prompt,/Review detected brief/);assert.match(prompt,/Continue with suggested fields/);
 assert.doesNotMatch(prompt,/fetch\(|XMLHttpRequest/);
});
