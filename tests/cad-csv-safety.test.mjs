import test from "node:test";
import assert from "node:assert/strict";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function("module","exports","require",js)(mod,mod.exports,()=>{throw Error("Unexpected dependency")});
const {cadCsvCell}=mod.exports;
test("CSV export prevents spreadsheet formula evaluation",()=>{
 for(const value of ["=HYPERLINK(\"https://example.org\")","+SUM(1,2)","-1+2","@SUM(1,2)","  =1+1","\t=1+1"]){
  assert.ok(cadCsvCell(value).startsWith('"\''),value);
 }
});
test("CSV export preserves ordinary values and quotes",()=>{
 assert.equal(cadCsvCell("Prayer hall"),'"Prayer hall"');
 assert.equal(cadCsvCell('A "quoted" hall'),'"A ""quoted"" hall"');
 assert.equal(cadCsvCell(-2),'"-2"');
});
