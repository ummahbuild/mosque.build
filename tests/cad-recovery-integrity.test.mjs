import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const studio=readFileSync(new URL("../apps/web/components/cad-authoring-studio.tsx",import.meta.url),"utf8");

test("restored CAD records must pass production geometry validation",()=>{
 const recovery=readFileSync(new URL("../apps/web/lib/cad-local-recovery.ts",import.meta.url),"utf8");
 assert.match(studio,/readCadRecord/);
 assert.match(recovery,/validateCadProduction\(saved\.document\)/);
 assert.match(recovery,/issue\.level === "blocker"/);
});
test("invalid browser records remain available for non-destructive download",()=>{
 assert.match(studio,/setRecoveryRaw\(raw\)/);
 assert.match(studio,/recoveryRaw!==null/);
 assert.match(studio,/Download original saved data/);
});
