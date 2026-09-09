import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page=fs.readFileSync("apps/web/app/my-project/page.tsx","utf8");
const contents=fs.readFileSync("apps/web/components/my-project-contents.tsx","utf8");

test("project contents links resolve to unique workspace targets",()=>{
  const hrefs=[...contents.matchAll(/href=\{`#\$\{item\.id\}`\}/g)];
  assert.equal(hrefs.length,1,"contents should build local fragment links");
  for(const id of ["project-action-plan","connected-project-map","project-controls","project-planning","project-schedule","project-shura","project-records","project-lifecycle","project-data"]){
    assert.equal((page.match(new RegExp(`id=\\"${id}\\"`,"g"))||[]).length,1,`${id} should have one target`);
    assert.match(contents,new RegExp(`id:\\"${id}\\"`));
  }
});

test("project contents communicates local record status without completion claims",()=>{
  assert.match(contents,/Saved locally/);
  assert.match(contents,/No record yet/);
  assert.match(contents,/not that the work is complete, verified or approved/);
  assert.match(contents,/aria-current=\{active===item\.id\?"location"/);
});
