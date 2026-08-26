import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";
const library=fs.readFileSync(new URL("../apps/web/data/resource-library.ts",import.meta.url),"utf8");
const ledger=fs.readFileSync(new URL("../docs/FUNCTIONALITY_BATCH_100.md",import.meta.url),"utf8");
test("working resource library contains 40 stable records",()=>{const ids=[...library.matchAll(/\{id:"([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,40);assert.equal(new Set(ids).size,40)});
test("resource library spans every project stage",()=>{for(const stage of ["Brief","Site","Design","Approvals","Fund","Source","Build","Operate"])assert.match(library,new RegExp(`stage:\"${stage}\"`))});
test("regulated resource copy preserves review boundaries",()=>{assert.match(library,/Likely applicable—verify with authority or professional/);assert.match(library,/not a quotation or contract sum/);assert.match(library,/legal and scholarly review/)});
test("functionality ledger contains exactly 100 numbered outcomes",()=>{const numbered=[...ledger.matchAll(/^\d+\./gm)];assert.equal(numbered.length,100)});
