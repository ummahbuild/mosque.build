import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";
const domain=fs.readFileSync(new URL("../apps/web/lib/model-planning-tools.ts",import.meta.url),"utf8"),ui=fs.readFileSync(new URL("../apps/web/components/model-planning-tools.tsx",import.meta.url),"utf8"),viewer=fs.readFileSync(new URL("../apps/web/components/three-schematic-viewer.tsx",import.meta.url),"utf8"),doc=fs.readFileSync(new URL("../docs/45_THREE_MODEL_PLANNING_100.md",import.meta.url),"utf8");
test("model planning remains renderer neutral",()=>{assert.match(domain,/mosque\.build\/model-planning@1/);assert.doesNotMatch(domain,/from ["']three|THREE\./)});
test("advanced tools drive the Three renderer",()=>{assert.match(viewer,/localClippingEnabled=true/);assert.match(viewer,/clippingPlanes/);assert.match(viewer,/controls\.autoRotate/);assert.match(ui,/mosque-build:model-tools/)});
test("measurements state their conceptual boundary",()=>{assert.match(ui,/not route length, clearance, travel distance or surveyed geometry/);assert.match(ui,/not BIM clash detection/)});
test("issues require portable accountability fields",()=>{for(const x of ["ownerRole","evidenceRef","discipline","severity","resolved-user-record"])assert.match(domain+ui,new RegExp(x))});
test("project package contains model planning",()=>assert.match(fs.readFileSync(new URL("../apps/web/lib/project-package.ts",import.meta.url),"utf8"),/modelPlanning/));
test("ledger contains exactly 100 improvements",()=>assert.equal((doc.match(/^\d+\. /gm)||[]).length,100));
