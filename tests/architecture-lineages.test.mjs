import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const root = new URL("../apps/web/data/", import.meta.url);
const lineages = JSON.parse(await readFile(new URL("architecture-lineages.json", root), "utf8"));
const references = JSON.parse(await readFile(new URL("architecture-image-references.json", root), "utf8"));
const patterns = JSON.parse(await readFile(new URL("pattern-library.json", root), "utf8"));
const actionLib = await readFile(new URL("../apps/web/lib/architecture-reference-actions.ts", import.meta.url), "utf8");
const atlasLib = await readFile(new URL("../apps/web/lib/mosque-architecture-atlas.ts", import.meta.url), "utf8");
const atlasComponent = await readFile(new URL("../apps/web/components/mosque-architecture-atlas.tsx", import.meta.url), "utf8");
const atlasCss = await readFile(new URL("../apps/web/components/mosque-architecture-atlas.css", import.meta.url), "utf8");
const explorer = await readFile(new URL("../apps/web/components/architecture-lineage-explorer.tsx", import.meta.url), "utf8");
const patternsPage = await readFile(new URL("../apps/web/app/patterns/page.tsx", import.meta.url), "utf8");
const referenceCss = await readFile(new URL("../apps/web/components/architecture-reference.css", import.meta.url), "utf8");
const packageLib = await readFile(new URL("../apps/web/lib/project-package.ts", import.meta.url), "utf8");
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

test("every architecture lineage has one rights-aware built reference image", () => {
  assert.equal(references.length, lineages.length);
  assert.deepEqual(new Set(references.map(item => item.lineageId)), new Set(lineages.map(item => item.id)));
  for (const item of references) {
    assert.ok(item.exampleName && item.classificationFocus && item.relationship);
    assert.match(item.imageUrl, /^https:\/\/thumb\.wikimedia\.org\//);
    assert.match(item.sourcePage, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    assert.ok(item.creator && item.license && item.licenseUrl);
    assert.match(item.observedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(item.confidence, "source_backed");
  }
});

test("architecture guidance avoids unsafe or false authority claims", () => {
  const text = JSON.stringify(lineages).toLowerCase();
  assert.doesNotMatch(text, /authority approved|structurally valid|guaranteed authentic|universal islamic style/);
  assert.match(text, /qualified structural|structural.*professional/);
  assert.match(text, /sacred text as decorative filler/);
});

test("built references generate one hundred plus reviewable design actions", () => {
  const generatedCount = lineages.reduce((sum, item) => sum + item.spatialPrinciples.length + item.climateAndMaterial.length + item.designMoves.length + item.avoid.length, 0);
  assert.ok(generatedCount >= 100);
  for (const phrase of [
    "mosque.build/architecture-reference-actions@1",
    "spatial",
    "climate-material",
    "test-move",
    "misuse-guard",
    "sourceLabel",
    "imageSourcePage",
    "safeReferenceActions"
  ]) assert.ok(actionLib.includes(phrase), phrase);
  assert.doesNotMatch(actionLib, /production_ready|authority approved|guaranteed authentic|construction instructions/i);
});

test("reference actions are usable in the lineage explorer and portable package", () => {
  for (const phrase of [
    "REFERENCE TO DESIGN",
    "Reference action filters",
    "Export selected actions",
    "Save reference actions",
    "ARCHITECTURE_REFERENCE_ACTIONS_KEY",
    "project-change",
    "not authenticity findings"
  ]) assert.ok(explorer.includes(phrase), phrase);
  assert.ok(packageLib.includes("architectureReferenceActions"));
  assert.match(referenceCss, /min-height:44px/);
  assert.match(referenceCss, /@media\(max-width:800px\)/);
});

test("mosque architecture atlas turns every sourced lineage into a study profile", () => {
  const expectedMockupFrames = lineages.length * 5;
  for (const phrase of [
    "mosque.build/mosque-architecture-atlas@1",
    "lineages.map(profileFor)",
    "referenceImage",
    "referenceSource",
    "textbookAnatomy",
    "mockupFrames",
    "reviewPrompts",
    "not a design approval",
    "not a design approval, cultural-authenticity finding, specification, structural analysis, code review or permission to build"
  ]) assert.ok(atlasLib.includes(phrase), phrase);
  assert.equal((atlasLib.match(/frame\(`/g) ?? []).length, 5);
  assert.ok(expectedMockupFrames >= 75);
  assert.doesNotMatch(atlasLib, /guaranteed authentic|authority approved|structurally valid|production_ready/i);
});

test("architecture atlas is interactive, responsive and included in project packages", () => {
  for (const phrase of [
    "MOSQUE ARCHITECTURE ATLAS",
    "Textbook anatomy",
    "Mockup reference frames",
    "Save atlas study",
    "Export atlas packet",
    "MOSQUE_ARCHITECTURE_ATLAS_KEY",
    "project-change",
    "not approvals, specifications or claims of authenticity"
  ]) assert.ok(atlasComponent.includes(phrase), phrase);
  assert.ok(patternsPage.includes("MosqueArchitectureAtlas"));
  assert.ok(packageLib.includes("mosqueArchitectureAtlas"));
  assert.match(atlasCss, /min-height:44px/);
  assert.match(atlasCss, /@media\(max-width:760px\)/);
});
