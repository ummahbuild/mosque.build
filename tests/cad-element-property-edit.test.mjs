import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
const src=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function("module","exports","require",js)(mod,mod.exports,()=>{throw Error("Unexpected import")});
const {createCadAuthoringState,previewCadCommand,commitCadCommand,starterCadDocument}=mod.exports;
const command=(kind,targetId,payload)=>({id:"test-command",kind,targetId,payload,summary:kind});
function seeded(){return {...createCadAuthoringState(),document:starterCadDocument()}}
test("renaming a wall preserves stable ID and allows undo",()=>{
 const prior=seeded();const id=prior.document.walls[0].id;
 const preview=previewCadCommand(prior,command("rename-wall",id,{name:"Qibla wall"}));
 assert.equal(preview.document.walls[0].name,prior.document.walls[0].name);
 assert.equal(preview.transaction.preview.walls[0].name,"Qibla wall");
 const next=commitCadCommand(preview);
 assert.equal(next.document.walls[0].id,id);
 assert.equal(next.past.length,1);
});
test("moving opening along host retains association and changes offset",()=>{
 const prior=seeded(),opening=prior.document.openings[0];
 const preview=previewCadCommand(prior,command("move-opening",opening.id,{offsetM:4}));
 assert.equal(preview.transaction.preview.openings[0].hostWallId,opening.hostWallId);
 assert.equal(preview.transaction.preview.openings[0].offsetM,4);
});
test("commands to missing IDs do not mutate geometry",()=>{
 const prior=seeded(),preview=previewCadCommand(prior,command("rename-wall","missing",{name:"Wrong"}));
 assert.deepEqual(preview.transaction.preview.walls,prior.document.walls);
});
