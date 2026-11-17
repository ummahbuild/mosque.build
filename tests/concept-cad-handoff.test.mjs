import test from "node:test";
import assert from "node:assert/strict";
import {parseMosqueConcept} from "../apps/web/lib/concept-onboarding.ts";
import {readFileSync} from "node:fs";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
const source=readFileSync(new URL("../apps/web/lib/concept-cad-handoff.ts",import.meta.url),"utf8");
let js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
for(const name of ["cad-authoring-core","concept-room-program"])js=js.replace(`"./${name}"`,JSON.stringify(new URL(`../apps/web/lib/${name}.ts`,import.meta.url).href));
const {previewConceptCadHandoff}=await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
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

test("comparison keeps program input intact and missing support-space dimensions explicit",()=>{
 const fields=parseMosqueConcept("Mosque for 450 worshippers with wudu and classrooms"),before=structuredClone(fields);
 const result=previewConceptCadHandoff(fields);
 assert.deepEqual(fields,before);assert.equal(result.areaDifferenceM2,499);
 assert.ok(result.unresolvedSpaceIds.includes("wudu"));assert.ok(result.unresolvedSpaceIds.includes("classrooms"));
 assert.equal(result.professionalReviewRequired,true);
});
test("rounded area matches and smaller briefs never imply design approval",()=>{
 const match=previewConceptCadHandoff(parseMosqueConcept("Mosque for 51 worshippers"));
 assert.equal(match.dimensionMismatch,false);assert.equal(match.requestedPrayerZoneAreaM2,64);
 assert.equal(match.status,"preview_only");assert.ok(match.warnings.some(x=>x.includes("do not establish")));
 const smaller=previewConceptCadHandoff(parseMosqueConcept("Mosque for 20 worshippers"));
 assert.equal(smaller.areaDifferenceM2,-39);assert.equal(smaller.dimensionMismatch,true);
});
test("invalid attendance keeps comparisons unresolved rather than suggesting a fit",()=>{
 for(const attendance of ["", "0", "-1", "NaN", "Infinity", "1.5", "50001"]){
  const result=previewConceptCadHandoff({...parseMosqueConcept("Mosque with wudu"),attendance});
  assert.equal(result.requestedPrayerZoneAreaM2,null);assert.equal(result.areaDifferenceM2,null);
  assert.ok(result.unresolvedSpaceIds.includes("prayer"));
 }
});

test('youth, kitchen and janazah requirements remain unresolved in the sample comparison',()=>{
 const fields=parseMosqueConcept('A mosque for 300 people with youth space, kitchen for iftar and janazah facilities.');
 const before=structuredClone(fields),result=previewConceptCadHandoff(fields);
 assert.deepEqual(result.spaceRequirements.map(room=>room.id),['prayer','youth','kitchen','janazah']);
 assert.deepEqual(result.unresolvedSpaceIds,['youth','kitchen','janazah']);assert.equal(result.requestedPrayerZoneAreaM2,375);
 assert.equal(result.starterPrayerAreaM2,64);assert.equal(result.modelRevision,1);assert.deepEqual(fields,before);
});
test('unknown attendance does not hide requested support spaces in comparison',()=>{
 const result=previewConceptCadHandoff(parseMosqueConcept('A mosque with youth space, kitchen and janazah facilities.'));
 assert.deepEqual(result.unresolvedSpaceIds,['prayer','youth','kitchen','janazah']);assert.equal(result.areaDifferenceM2,null);
});
