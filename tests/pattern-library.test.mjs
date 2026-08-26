import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const library=JSON.parse(await readFile(new URL("../apps/web/data/pattern-library.json",import.meta.url),"utf8"));

test("pattern studies have unique ids and required provenance",()=>{
  assert.ok(library.length>=10);
  assert.equal(new Set(library.map(item=>item.id)).size,library.length);
  for(const item of library){
    assert.ok(item.title&&item.category&&item.application&&item.description);
    assert.ok(["concept","specified","scaffolded","executable","source_backed","beta","production_ready"].includes(item.status));
    assert.ok(item.reviewPoints.length>=3);
    assert.match(item.source.observedAt,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.historicalContext&&item.source.url&&item.source.path&&item.source.rights&&item.source.confidence&&item.source.label);
  }
});

test("gallery does not imply products, pricing, approvals or sacred decoration",()=>{
  const text=JSON.stringify(library).toLowerCase();
  assert.doesNotMatch(text,/\$\d|approved vendor|authority approved|buy now/);
  assert.doesNotMatch(text,/authentic replica|historically exact|authority approved/);
});
