import test from "node:test";
import assert from "node:assert/strict";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
import fs from "node:fs";
import vm from "node:vm";

function loadModule(path){let source=fs.readFileSync(path,"utf8").replace(/^import type .*;$/gm,"").replace(/export /g,"");source=ts.transpile(source,{module:ts.ModuleKind.None,target:ts.ScriptTarget.ES2022});const context={structuredClone};vm.createContext(context);vm.runInContext(source,context);return context}
const lib=loadModule(new URL("../apps/web/lib/model-inspection.ts",import.meta.url));

test("inspection preferences reject corrupt or out-of-range state",()=>{const clean=lib.sanitizeInspectionPreferences({view:"qibla",layers:{spaces:false},grid:false,explode:99});assert.equal(clean.view,"qibla");assert.equal(clean.layers.spaces,false);assert.equal(clean.layers.walls,true);assert.equal(clean.grid,false);assert.equal(clean.explode,5);assert.equal(lib.sanitizeInspectionPreferences({view:"broken"}).view,"iso")});
test("model inspection reports coordination quantities",()=>{const stats=lib.inspectRenderModel({footprint:[10,20],boxes:[{id:"site",material:"site",areaM2:200,size:[10,.2,20]},{id:"hall",material:"prayer",areaM2:80,size:[10,4,8]}],walls:[{}],openings:[{}],guides:[{},{}],adjacencies:[{},{}]});assert.deepEqual(JSON.parse(JSON.stringify(stats)),{spaces:1,walls:1,openings:1,guides:2,footprintM2:200,programAreaM2:80,modeledVolumeM3:320,materialRoles:1,adjacencies:2})});
test("qibla camera offset follows compass degrees",()=>{assert.ok(Math.abs(lib.qiblaOffset(0,10)[0])<1e-9);assert.ok(Math.abs(lib.qiblaOffset(0,10)[1]-10)<1e-9);assert.ok(Math.abs(lib.qiblaOffset(90,10)[0]-10)<1e-9)});
