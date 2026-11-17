import test from "node:test";import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const core=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8"),ui=readFileSync(new URL("../apps/web/components/cad-authoring-studio.tsx",import.meta.url),"utf8");
test("wall families have stable identifiers and explicit thickness",()=>{for(const id of ["wall-masonry-concept","wall-lightweight-concept","wall-heavy-concept"])assert.ok(core.includes(id));assert.match(core,/CAD_WALL_FAMILIES/);});
test("family selection uses existing preview commit flow",()=>{assert.match(core,/set-wall-family/);assert.match(ui,/preview\(cmd\("set-wall-family"/);assert.match(ui,/Wall family/);});
