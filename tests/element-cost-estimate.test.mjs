import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root=new URL("../",import.meta.url);
const lib=fs.readFileSync(new URL("../apps/web/lib/element-cost-estimate.ts",import.meta.url),"utf8");
const preview=fs.readFileSync(new URL("../apps/web/components/feature-three-preview.tsx",import.meta.url),"utf8");
const hero=fs.readFileSync(new URL("../apps/web/components/hero-cost-summary.tsx",import.meta.url),"utf8");

test("element previews expose evidence-aware low, base and high cost inputs",()=>{
  for(const field of ["Quantity","Currency","Low unit rate","Base unit rate","High unit rate","Market / geography","Price date","Evidence source","Confidence","Exclusions"])assert.match(preview,new RegExp(field.replace(" / "," \\/ ")));
  assert.match(preview,/Planning estimate only/);
  assert.match(lib,/lowRate>x\.baseRate/);
  assert.match(lib,/ELEMENT_COST_KEY/);
});

test("hero cost summary uses saved plans without inferring exchange rates",()=>{
  assert.match(hero,/safeCostPlan/);
  assert.match(hero,/safeElementCosts/);
  assert.match(hero,/no exchange rate is inferred/i);
  assert.match(hero,/Estimate not set/);
});
