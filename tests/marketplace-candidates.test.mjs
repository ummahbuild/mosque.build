import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root=new URL("../",import.meta.url);
const records=JSON.parse(fs.readFileSync(new URL("apps/web/data/marketplace-candidates.json",root),"utf8"));
const library=fs.readFileSync(new URL("apps/web/lib/marketplace-candidates.ts",root),"utf8");
const ui=fs.readFileSync(new URL("apps/web/components/marketplace-candidate-catalog.tsx",root),"utf8");
const planning=fs.readFileSync(new URL("apps/web/lib/marketplace-planning.ts",root),"utf8");
const ledger=fs.readFileSync(new URL("docs/66_MARKETPLACE_100.md",root),"utf8");

test("candidate marketplace is meaningfully populated and uniquely identified",()=>{
  assert.ok(records.length>=35);
  assert.equal(new Set(records.map(item=>item.id)).size,records.length);
  assert.ok(new Set(records.map(item=>item.category)).size>=12);
});

test("candidate records carry traceable review prompts without invented commerce facts",()=>{
  for(const item of records){
    assert.match(item.id,/^MBM-\d{4}$/);
    assert.match(item.sourceUrl,/^https:\/\//);
    assert.match(item.observedAt,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.attributes.length>=4);
    assert.equal("price" in item,false);
    assert.equal("available" in item,false);
  }
  assert.match(library,/sourceRows: 567/);
  assert.match(library,/needs_review/);
  assert.match(library,/rights:/);
});

test("candidate marketplace supports discovery, local shortlisting and safe export",()=>{
  assert.match(ui,/type="search"/);
  assert.match(ui,/Show \{Math\.min/);
  assert.match(ui,/localStorage\.setItem/);
  assert.match(ui,/marketplace-candidate-brief@2/);
  assert.match(ui,/rel="noopener noreferrer"/);
  assert.match(ui,/Verify product, documents, region, price and availability/);
});

test("marketplace planning is bounded, portable and evidence-led",()=>{
  assert.match(planning,/marketplace-candidate-shortlist@2/);
  assert.match(planning,/slice\(0,150\)/);
  assert.match(planning,/Math\.min\(10000/);
  assert.match(planning,/Current regional availability/);
  assert.match(planning,/Product-specific CAD or BIM evidence/);
  assert.match(ui,/FIT COMPARISON/);
  assert.match(ui,/SOURCING PLAN/);
  assert.match(ui,/Project zone/);
  assert.match(ui,/Requirements and exclusions/);
});

test("marketplace delivery ledger records exactly 100 improvements",()=>{
  assert.equal((ledger.match(/^\d+\. /gm)||[]).length,100);
});
