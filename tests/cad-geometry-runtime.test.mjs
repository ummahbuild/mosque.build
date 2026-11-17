import test from "node:test";
import assert from "node:assert/strict";
import ts from "../apps/web/node_modules/typescript/lib/typescript.js";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const source=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function("module","exports","require",js)(mod,mod.exports,require);
const {cadClosedBoundaryArea}=mod.exports;
const wall=(id,a,b)=>({id,name:id,start:{x:a[0],y:a[1]},end:{x:b[0],y:b[1]},thicknessM:.2,heightM:3,typeId:"concept",phase:"new"});
const area=(walls,ids=walls.map(w=>w.id))=>cadClosedBoundaryArea({id:"room",name:"Room",kind:"prayer",boundaryWallIds:ids,areaM2:0,levelId:"ground"},walls);
test("rectangular room returns exact shoelace area with reversed segments",()=>{
 const walls=[wall("a",[0,0],[4,0]),wall("b",[4,3],[4,0]),wall("c",[4,3],[0,3]),wall("d",[0,0],[0,3])];
 assert.equal(area(walls),12);
});
test("concave L-shaped room preserves notch instead of convex hull",()=>{
 const p=[[0,0],[4,0],[4,1],[1,1],[1,4],[0,4]];
 const walls=p.map((v,i)=>wall("w"+i,v,p[(i+1)%p.length]));
 assert.equal(area(walls),7);
});
test("disconnected boundaries are rejected",()=>{
 const walls=[wall("a",[0,0],[2,0]),wall("b",[2,0],[2,2]),wall("c",[5,5],[0,0])];
 assert.equal(area(walls),null);
});
test("self crossing bow-tie boundary is rejected",()=>{
 const p=[[0,0],[2,2],[0,2],[2,0]];
 assert.equal(area(p.map((v,i)=>wall("w"+i,v,p[(i+1)%p.length]))),null);
});
test("duplicate boundary reference is rejected",()=>{
 const walls=[wall("a",[0,0],[1,0]),wall("b",[1,0],[0,1]),wall("c",[0,1],[0,0])];
 assert.equal(area(walls,["a","b","c","a"]),null);
});
