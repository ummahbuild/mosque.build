import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read=path=>fs.readFileSync(new URL(path,import.meta.url),"utf8");

test("shared footer links retain accessible touch targets",()=>{
  assert.match(read("../apps/web/components/site-footer.tsx"),/site-footer-accessibility\.css/);
  const styles=read("../apps/web/components/site-footer-accessibility.css");
  assert.match(styles,/\.footerGrid a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(styles,/\.footerAttribution a\s*\{[^}]*min-height:\s*44px/s);
});

test("design entry points expose route-specific metadata and accessible actions",()=>{
  const page=read("../apps/web/app/design/page.tsx");
  assert.match(page,/title:"Mosque planning and design studio"/);
  const component=read("../apps/web/components/model-cultural-context.tsx");
  assert.match(component,/model-cultural-context-accessibility\.css/);
  assert.match(read("../apps/web/components/model-cultural-context-accessibility.css"),/min-height:\s*44px/);
});
