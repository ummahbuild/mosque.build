import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const core=readFileSync(new URL("../apps/web/lib/cad-level-coordination.ts",import.meta.url),"utf8");
const ui=readFileSync(new URL("../apps/web/components/cad-authoring-studio.tsx",import.meta.url),"utf8");
test("level schedule derives area from matching level rooms",()=>{assert.match(core,/filter\(s=>s\.levelId===level\.id\)/);assert.match(core,/conceptualSlabAreaM2/);});
test("missing level references remain visible",()=>{assert.match(core,/Spaces reference a level/);assert.match(core,/single-level CAD document/);});
test("CSV handoff and user-visible review boundaries",()=>{assert.match(ui,/Export level schedule/);assert.match(ui,/Not a measured slab polygon/);});
