import test from"node:test";import assert from"node:assert/strict";import fs from"node:fs";

const domain=fs.readFileSync(new URL("../apps/web/lib/project-handoff.ts",import.meta.url),"utf8"),
  ui=fs.readFileSync(new URL("../apps/web/components/project-handoff-readiness.tsx",import.meta.url),"utf8"),
  css=fs.readFileSync(new URL("../apps/web/components/project-handoff-readiness.css",import.meta.url),"utf8"),
  page=fs.readFileSync(new URL("../apps/web/app/my-project/page.tsx",import.meta.url),"utf8"),
  contents=fs.readFileSync(new URL("../apps/web/components/my-project-contents.tsx",import.meta.url),"utf8"),
  projectPackage=fs.readFileSync(new URL("../apps/web/lib/project-package.ts",import.meta.url),"utf8");

test("handoff domain is portable workflow-aware and bounded",()=>{
  for(const phrase of["mosque.build/project-handoff@1","HandoffProfileId","evaluateHandoff","missingRequired","dependencyGaps","createHandoffPacket","share-safe","Conceptual local planning handoff only"])assert.ok(domain.includes(phrase),phrase);
  for(const profile of["design-team","authority-review","cost-procurement","construction-coordination","operations-handover"])assert.ok(domain.includes(profile),profile);
  assert.doesNotMatch(domain,/THREE\\.|Object3D|approved|certified|guaranteed/i);
});

test("handoff ui is integrated accessible and mobile-ready",()=>{
  for(const phrase of["HANDOFF READINESS","aria-label=\"Handoff recipients\"","Export share-safe packet","Save handoff record","Handoff boundary","aria-live"])assert.ok(ui.includes(phrase),phrase);
  assert.ok(page.includes("ProjectHandoffReadiness"));
  assert.ok(contents.includes("Handoff readiness"));
  assert.ok(projectPackage.includes("projectHandoff"));
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(css,/min-height:44px/);
  assert.doesNotMatch(ui,/is approved|compliance confirmed|authority accepted/i);
});
