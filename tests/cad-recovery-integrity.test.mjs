import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const studio=readFileSync(new URL("../apps/web/components/cad-authoring-studio.tsx",import.meta.url),"utf8");

test("restored CAD records must pass production geometry validation",()=>{
 assert.match(studio,/validateCadProduction\(saved\.document\)/);
 assert.match(studio,/issue\.level==="blocker"/);
});
test("invalid browser records remain available for non-destructive download",()=>{
 assert.match(studio,/setRecoveryRaw\(raw\)/);
 assert.match(studio,/recoveryRaw!==null/);
 assert.match(studio,/Download original saved data/);
});
