import test from "node:test";
import assert from "node:assert/strict";
import {parseMosqueConcept} from "../apps/web/lib/concept-onboarding.ts";
import {previewConceptCadHandoff} from "../apps/web/lib/concept-cad-handoff.ts";
test("concept-to-CAD mapping flags mismatched geometry rather than resizing it",()=>{
 const result=previewConceptCadHandoff(parseMosqueConcept("Mosque in Nairobi for 450 worshippers with a school"));
 assert.equal(result.status,"preview_only");assert.equal(result.validStarter,true);
 assert.equal(result.starterPrayerAreaM2,64);assert.equal(result.requestedPrayerZoneAreaM2,563);
 assert.equal(result.dimensionMismatch,true);assert.ok(result.warnings.some(x=>x.includes("not sized")));
});
test("unknown capacities keep requirements unresolved",()=>{
 const result=previewConceptCadHandoff(parseMosqueConcept("Small mosque with wudu"));
 assert.equal(result.requestedPrayerZoneAreaM2,null);assert.equal(result.dimensionMismatch,false);
});
