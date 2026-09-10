import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),"utf8");
const nav=read("apps/web/components/project-journey-nav.tsx");
const css=read("apps/web/components/project-journey-nav.css");
const ledger=read("docs/73_UNIFIED_PRODUCT_UX_100.md");

test("one journey connects every working product area",()=>{
  for(const stage of["Define","Understand","Design","Approve + resource","Build","Open + care"])assert.match(nav,new RegExp(stage.replace("+","\\+")));
  for(const path of["product-area-page.tsx","../app/permits/page.tsx","../app/funding/page.tsx","../app/my-project/page.tsx"]){
    const full=path.startsWith("../")?`apps/web/${path.slice(3)}`:`apps/web/components/${path}`;
    assert.match(read(full),/ProjectJourneyNav/);
  }
});

test("journey distinguishes activity from completion and exposes accessible state",()=>{
  assert.match(nav,/Started means saved here; it does not mean approved or complete/);
  assert.match(nav,/aria-current/);
  assert.match(nav,/aria-label="Mosque project journey"/);
  assert.match(nav,/mosque-build:project-change/);
  assert.match(nav,/removeEventListener/);
  assert.match(nav,/mounted\?deriveWorkflowSignals/);
});

test("journey remains keyboard visible and mobile scrollable",()=>{
  assert.match(css,/:focus-visible/);
  assert.match(css,/min-height:44px/);
  assert.match(css,/overflow-x:auto/);
  assert.match(css,/scroll-snap-type/);
  assert.match(css,/@media\(max-width:620px\)/);
});

test("the implementation ledger records exactly 100 unified UX outcomes",()=>{
  assert.equal(ledger.match(/^\d+\./gm)?.length,100);
  assert.match(ledger,/Status: `executable`/);
  assert.match(ledger,/Next review gates/);
});
