import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {inspectProjectDraft} from "../apps/web/lib/project-draft-recovery.ts";
test("malformed or incompatible drafts remain available as raw data",()=>{
 for(const raw of ["{", "null", "[]", '{"needs":"bad"}', '{"name":7}', '{"team":[1]}']){
  const v=inspectProjectDraft(raw);assert.equal(v.status,"invalid");assert.equal(v.raw,raw);assert.equal(v.draft,null);
 }
});
test("valid and empty drafts have separate statuses",()=>{
 assert.equal(inspectProjectDraft(null).status,"empty");
 const raw=JSON.stringify({name:"Mosque",location:"Nairobi",needs:["Prayer hall"]});
 const v=inspectProjectDraft(raw);assert.equal(v.status,"valid");assert.equal(v.draft?.name,"Mosque");
});
test("saved project is not overwritten until recovery is confirmed",()=>{
 const src=fs.readFileSync(new URL("../apps/web/components/start-project-wizard.tsx",import.meta.url),"utf8");
 assert.match(src,/if\(!ready\|\|damaged!==null\)return/);
 assert.match(src,/Download unmodified backup/);
 assert.match(src,/Discard damaged draft and start over/);
 assert.match(src,/window\.confirm/);
});
