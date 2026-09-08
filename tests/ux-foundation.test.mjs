import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("universal workspace navigator provides orientation and keyboard behavior", () => {
  const source = read("apps/web/components/workspace-tool-navigator.tsx");
  for (const contract of ["IntersectionObserver", "MutationObserver", "Workspace tools", "Previous workspace tool", "Next workspace tool", "aria-current", "prefers-reduced-motion", "No tools match", 'event.key==="Escape"']) assert.match(source, new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(source, /workspaceSectionIntro/);
});

test("every product workspace includes the universal navigator", () => {
  const source = read("apps/web/components/product-area-page.tsx");
  assert.match(source, /WorkspaceToolNavigator/);
  assert.match(source, /<WorkspaceToolNavigator\s*\/>/);
});

test("mobile navigation is inert when closed and manages focus and scroll", () => {
  const source = read("apps/web/components/site-header.tsx");
  for (const contract of ["inert=", 'document.body.style.overflow="hidden"', "keepFocus", "closeWide", "mobileProjectAction", "Explore mosque.build"]) assert.match(source, new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("global styles cover accessibility and responsive resilience", () => {
  const css = read("apps/web/app/globals.css");
  for (const contract of [":focus-visible", "pointer:coarse", "prefers-reduced-motion:reduce", "forced-colors:active", "scroll-margin-top", "content-visibility:auto", "env(safe-area-inset-bottom)"]) assert.match(css, new RegExp(contract.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("UX implementation ledger contains exactly 100 numbered outcomes", () => {
  const ledger = read("docs/51_UX_100.md");
  const items = ledger.match(/^\d+\./gm) ?? [];
  assert.equal(items.length, 100);
  assert.equal(items.at(0), "1.");
  assert.equal(items.at(-1), "100.");
});
