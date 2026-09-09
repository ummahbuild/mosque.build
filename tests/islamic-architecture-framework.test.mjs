import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const domain=fs.readFileSync("apps/web/lib/islamic-architecture-framework.ts","utf8");
const ui=fs.readFileSync("apps/web/components/islamic-architecture-framework.tsx","utf8");
const css=fs.readFileSync("apps/web/components/islamic-architecture-framework.css","utf8");
const actions=fs.readFileSync("apps/web/components/islamic-architecture-actions.css","utf8");
const page=fs.readFileSync("apps/web/app/patterns/page.tsx","utf8");
const pkg=fs.readFileSync("apps/web/lib/project-package.ts","utf8");
const workflow=fs.readFileSync("apps/web/lib/workflow-integration.ts","utf8");
const ledger=fs.readFileSync("docs/66_ISLAMIC_ARCHITECTURE_100.md","utf8");

test("architecture framework is versioned, bounded and renderer-neutral",()=>{
 assert.match(domain,/mosque\.build\/islamic-architecture-framework@1/);
 assert.match(domain,/responses\.length!==architecturePrompts\.length/);
 assert.match(domain,/options\.length>20/);
 assert.doesNotMatch(domain,/THREE\.Mesh|WebGLRenderer|Babylon/);
});

test("saved architecture records reject partial duplicate and oversized shapes",()=>{
 assert.match(domain,/responses\.length!==architecturePrompts\.length/);
 assert.match(domain,/expected\.has\(r\.promptId\)/);
 assert.match(domain,/!seen\.has\(r\.promptId\)/);
 assert.match(domain,/short\(r\.projectResponse,1400\)/);
 assert.match(domain,/o\.principleIds\.length<=architecturePrompts\.length/);
 assert.match(domain,/selectedOptionId&&!x\.options\.some/);
});

test("framework covers worship, place, performance, culture and stewardship",()=>{
 for(const lens of ["worship","arrival","community","learning","care","climate","water","light","sound","structure","craft","landscape","adaptation","operations"])assert.match(domain,new RegExp(`\\"${lens}\\"`));
 assert.match(domain,/Never generate sacred calligraphy as decorative filler/);
 assert.match(domain,/Similarity is not suitability|Do not infer|Do not claim/);
 assert.ok((domain.match(/\["[a-z]+","/g)||[]).length>=36);
});

test("external sources carry provenance, observation, rights and confidence",()=>{
 for(const field of ["url","observedAt","rights","confidence"])assert.match(domain,new RegExp(`${field}:`));
 for(const authority of ["The Metropolitan Museum of Art","UNESCO","Archnet"])assert.match(domain,new RegExp(authority));
});

test("interactive UI supports authoring, options, review, saving and export",()=>{
 for(const value of ["Project response","Evidence or drawing reference","Accountable owner role","Add option","Trade-offs, exclusions","Save framework","Export record"])assert.match(ui,new RegExp(value));
 assert.match(ui,/role="tablist"/);
 assert.match(ui,/aria-live="polite"/);
 assert.match(css,/min-height:44px/);
 assert.match(css,/focus-visible/);
 assert.match(css,/safe-area-inset/);
});

test("workspace explains recovery and always offers a concrete next action",()=>{
 assert.match(ui,/We could not safely open the saved architecture record/);
 assert.match(ui,/unreadable record has not been deleted/);
 assert.match(ui,/Start with a clean framework/);
 assert.match(ui,/Restore a project backup/);
 assert.match(ui,/NEXT BEST ACTION/);
 assert.match(ui,/Review blockers/);
 assert.match(ui,/Export this work/);
 assert.match(ui,/role=\{saveFailed\?"alert":"status"\}/);
 assert.match(actions,/\.architectureNotice/);
 assert.match(actions,/\.architectureRecoveryActions/);
});

test("architecture framework is integrated into page, project package and workflow",()=>{
 assert.match(page,/IslamicArchitectureFramework/);
 assert.match(pkg,/islamicArchitectureFramework/);
 assert.match(pkg,/mosque-build\.islamic-architecture-framework\.v1/);
 assert.match(workflow,/islamicArchitectureFramework/);
 assert.match(workflow,/dependencies:\["brief","siteAnalysis","designIntelligence"\]/);
});

test("implementation ledger records exactly 100 numbered improvements",()=>{
 const numbered=ledger.match(/^\d+\. /gm)||[];
 assert.equal(numbered.length,100);
 assert.match(ledger,/Unit: schema/);
 assert.match(ledger,/Human review:/);
});
