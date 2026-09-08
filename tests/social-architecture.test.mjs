import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import {scoreSocialArchitecture} from "../apps/web/lib/social-architecture.ts";

const criteria=JSON.parse(await readFile(new URL("../apps/web/data/social-architecture-criteria.json",import.meta.url),"utf8"));
test("social architecture criteria span people, modes and spatial gradients",()=>{assert.ok(criteria.length>=18);assert.equal(new Set(criteria.map(item=>item.id)).size,criteria.length);for(const item of criteria){assert.ok(item.title&&item.category&&item.description&&item.tradeoff);assert.ok(item.personas.length>=2);assert.ok(item.modes.length>=1);assert.ok(item.adjacentTo.length>=3);assert.ok(["no-cost","low-cost","renovation","capital"].includes(item.level));assert.ok(item.privacy&&item.acoustic)}});
test("social coverage heuristic is deterministic and explains missing provisions",()=>{const empty=scoreSocialArchitecture({selected:[],priorityPersonas:["New Muslim"],mode:"Friday"},criteria);assert.equal(empty.overall,0);assert.ok(empty.risks.length>=4);assert.equal(empty.recommendations[0].id,"clear-welcome");const full=scoreSocialArchitecture({selected:criteria.map(item=>item.id),priorityPersonas:["New Muslim"],mode:"Friday"},criteria);assert.equal(full.overall,100);assert.equal(full.recommendations.length,0);assert.equal(full.risks.length,0)});
test("social architecture copy does not turn the heuristic into a theological or measured claim",()=>{const text=JSON.stringify(criteria).toLowerCase();assert.doesNotMatch(text,/guarantees belonging|theological score|proves community|certified inclusion/)});
