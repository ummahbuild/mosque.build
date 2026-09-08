import test from "node:test";import assert from "node:assert/strict";import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../apps/web/lib/masjid-intelligence.ts",import.meta.url),"utf8");
test("design intelligence is transparent and bounded",()=>{assert.match(source,/explanation:string/);assert.match(source,/not religious rulings/);assert.match(source,/not a demand forecast/);assert.doesNotMatch(source,/approved|guaranteed|compliant/i)});
test("strategies cover worship, community and phased alternatives",()=>{for(const id of ['id:"worship"','id:"community"','id:"phased"'])assert.match(source,new RegExp(id))});
