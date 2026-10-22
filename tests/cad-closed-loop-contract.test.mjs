import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const source=readFileSync(new URL("../apps/web/lib/cad-production-integrity.ts",import.meta.url),"utf8");
test("room boundary continuity is a blocking model issue",()=>{assert.match(source,/level:"blocker",code:"BOUNDARY_CONTINUITY"/);assert.match(source,/length!==2/);});
test("disconnected wall loops are blocked before commit",()=>{assert.match(source,/DISCONNECTED_SPACE_BOUNDARY/);assert.match(source,/connected\.size!==walls\.length/);});
