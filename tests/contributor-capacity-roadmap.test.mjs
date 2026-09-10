import test from"node:test";import assert from"node:assert/strict";import fs from"node:fs";
const roadmap=fs.readFileSync(new URL("../docs/76_CONTRIBUTOR_CAPACITY_PARTNERSHIPS_100.md",import.meta.url),"utf8");
test("capacity and partnership roadmap specifies exactly 100 ordered features",()=>{const numbers=[...roadmap.matchAll(/^(\d+)\. /gm)].map(x=>Number(x[1]));assert.deepEqual(numbers,Array.from({length:100},(_,i)=>i+1))});
test("roadmap preserves privacy safety consent and production gates",()=>{for(const term of["RLS","safeguarding","consent","professional","share-safe","accessibility","schema migrations","not implemented"])assert.match(roadmap,new RegExp(term,"i"));assert.doesNotMatch(roadmap,/verified partner directory|automatically hire|guaranteed approval/i)});
