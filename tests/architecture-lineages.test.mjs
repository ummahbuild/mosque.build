import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const root = new URL("../apps/web/data/", import.meta.url);
const lineages = JSON.parse(await readFile(new URL("architecture-lineages.json", root), "utf8"));
const patterns = JSON.parse(await readFile(new URL("pattern-library.json", root), "utf8"));
const allowed = ["concept", "specified", "scaffolded", "executable", "source_backed", "beta", "production_ready"];

test("architecture lineages are sourced, bounded and connected to pattern studies", () => {
  const patternIds = new Set(patterns.map(item => item.id));
  assert.ok(lineages.length >= 5);
  assert.equal(new Set(lineages.map(item => item.id)).size, lineages.length);
  for (const item of lineages) {
    assert.ok(item.title && item.region && item.period && item.summary);
    assert.ok(allowed.includes(item.status));
    assert.ok(item.spatialPrinciples.length >= 3);
    assert.ok(item.climateAndMaterial.length >= 3);
    assert.ok(item.designMoves.length >= 3);
    assert.ok(item.avoid.length >= 3);
    assert.ok(item.compatiblePatternIds.length >= 3);
    item.compatiblePatternIds.forEach(id => assert.ok(patternIds.has(id), `${item.id} references missing pattern ${id}`));
    assert.match(item.source.observedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.source.label && item.source.url && item.source.rights && item.source.confidence);
  }
});

test("architecture guidance avoids unsafe or false authority claims", () => {
  const text = JSON.stringify(lineages).toLowerCase();
  assert.doesNotMatch(text, /authority approved|structurally valid|guaranteed authentic|universal islamic style/);
  assert.match(text, /qualified structural|structural.*professional/);
  assert.match(text, /sacred text as decorative filler/);
});
