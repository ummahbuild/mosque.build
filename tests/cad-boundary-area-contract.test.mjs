import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const core=readFileSync(new URL("../apps/web/lib/cad-authoring-core.ts",import.meta.url),"utf8");
const integrity=readFileSync(new URL("../apps/web/lib/cad-production-integrity.ts",import.meta.url),"utf8");
test("area follows connected wall topology, not centroid angle order",()=>{
 assert.match(core,/cadClosedBoundaryArea/);
 assert.match(core,/remaining\.filter\(w=>close\(w\.start,current\)/);
 assert.doesNotMatch(core,/Math\.atan2/);
});
test("non-simple polygons block CAD commits",()=>{
 assert.match(integrity,/INVALID_ROOM_POLYGON/);
 assert.match(core,/intersects\(ring\[i\]/);
});
