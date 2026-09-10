import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page=fs.readFileSync("apps/web/app/contribute/page.tsx","utf8");
const header=fs.readFileSync("apps/web/components/site-header.tsx","utf8");
const footer=fs.readFileSync("apps/web/components/site-footer.tsx","utf8");
const sitemap=fs.readFileSync("apps/web/app/sitemap.ts","utf8");

test("contribute route connects GitHub and the ummah.build community",()=>{
  assert.match(page,/https:\/\/github\.com\/ummahbuild\/mosque\.build/);
  assert.match(page,/Join ummah\.build/);
  assert.match(page,/https:\/\/ummah\.build/);
  assert.match(header,/\["\/contribute", "Contribute"\]/);
  assert.match(footer,/href="\/contribute">Contribute/);
  assert.match(sitemap,/"\/contribute"/);
});

test("contribute route publishes required trust and verification guidance",()=>{
  for(const term of ["Privacy","Sources","Permits","Safety","Costs","Religious + cultural content","Architecture","Accessibility","pnpm test","pnpm validate","pnpm privacy:scan","pnpm web:build"]){
    assert.match(page,new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
  }
  assert.match(page,/MIT LICENSE/);
  assert.match(page,/renderer-neutral/);
  assert.match(page,/sacred calligraphy/);
});
