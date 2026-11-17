import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const studio=readFileSync(new URL("../apps/web/components/cad-authoring-studio.tsx",import.meta.url),"utf8");
const core=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");

test("associative inspector exposes hosted opening and space selection",()=>{
  assert.match(studio,/Selected opening/);
  assert.match(studio,/Selected space/);
  assert.match(studio,/chosenOpening\?\.id/);
  assert.match(studio,/chosenSpace\?\.id/);
});
test("editing uses existing CAD preview transaction commands instead of changing committed model",()=>{
  assert.match(studio,/preview\(cmd\("resize-opening"/);
  assert.match(studio,/preview\(cmd\("rename-space"/);
  assert.match(core,/commitCadCommand/);
  assert.match(studio,/disabled=\{!!state\.transaction/);
});
test("schedules can navigate to element inspector",()=>{
  assert.match(studio,/select\(String\(row\.id\)\)/);
  assert.match(studio,/setTab\("model"\)/);
});
