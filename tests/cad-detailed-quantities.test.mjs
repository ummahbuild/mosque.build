import test from "node:test";
import assert from "node:assert/strict";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
import {readFileSync} from "node:fs";
const src=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function("module","exports","require",js)(mod,mod.exports,()=>{throw Error("Unexpected dependency")});
const {starterCadDocument,exportCadDetailedSchedulesCsv,cadSchedules}=mod.exports;
test("detail schedule exports wall thickness and hosted opening placement",()=>{
 const doc=starterCadDocument();
 const csv=exportCadDetailedSchedulesCsv(doc);
 const lines=csv.split("\n");
 assert.ok(lines.length>3);
 assert.match(lines[0],/thickness_m/);
 assert.match(lines[0],/offset_m/);
 assert.match(lines.join("\n"),/"0.24"/);
 assert.match(lines.join("\n"),/"3.2"/);
 assert.ok(!csv.includes("\\n"));
});
test("associative records expose additional dimensions",()=>{
 const schedules=cadSchedules(starterCadDocument());
 assert.equal(schedules.walls[0].thicknessM,.24);
 assert.equal(schedules.openings[0].offsetM,3.2);
});
