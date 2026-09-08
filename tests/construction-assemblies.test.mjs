import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const assemblies=JSON.parse(await readFile(new URL("../apps/web/data/construction-assemblies.json",import.meta.url),"utf8"));

test("construction assembly studies have review and maintenance evidence",()=>{assert.ok(assemblies.length>=8);assert.equal(new Set(assemblies.map(item=>item.id)).size,assemblies.length);for(const item of assemblies){assert.ok(item.group&&item.title&&item.summary);assert.ok(item.designUses.length>=2);assert.ok(item.evidenceNeeded.length>=4);assert.ok(item.maintenance.length>=2);assert.match(item.source.observedAt,/^\d{4}-\d{2}-\d{2}$/);assert.ok(item.source.label&&item.source.rights&&item.source.confidence);assert.ok(["concept","specified","scaffolded","executable","source_backed","beta","production_ready"].includes(item.status))}});
test("construction studies do not invent price, certification or approval",()=>{const text=JSON.stringify(assemblies).toLowerCase();assert.doesNotMatch(text,/\$\d|approved product|certified performance|guaranteed|in stock|authority approved/)});
