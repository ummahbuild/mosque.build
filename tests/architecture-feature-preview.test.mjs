import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("architecture proposals expose a type-specific Three.js preview and quick-add path",async()=>{
  const [planner,preview,mapper]=await Promise.all([
    read("apps/web/components/architecture-feature-planner.tsx"),
    read("apps/web/components/feature-three-preview.tsx"),
    read("apps/web/lib/architecture-feature-preview.ts")
  ]);
  assert.match(planner,/<FeatureThreePreview feature=\{active\}/);
  assert.match(planner,/Quick add to mosque design/);
  assert.match(planner,/mosque-build:architecture-kit-change/);
  assert.match(planner,/\/design#architecture-kit-title/);
  assert.match(preview,/buildArchitectureKitGroup\(featurePreviewKit\(feature\)\)/);
  assert.match(preview,/prefers-reduced-motion/);
  assert.match(preview,/ResizeObserver/);
  assert.match(mapper,/featurePreviewType/);
  assert.match(mapper,/reason\?:"duplicate"\|"capacity"/);
  assert.doesNotMatch(mapper,/THREE\.|from "three"/);
});

test("editable architecture canvas reloads when a preview is added",async()=>{
  const studio=await read("apps/web/components/architecture-kit-studio.tsx");
  assert.match(studio,/addEventListener\("mosque-build:architecture-kit-change",load\)/);
  assert.match(studio,/removeEventListener\("mosque-build:architecture-kit-change",load\)/);
});
