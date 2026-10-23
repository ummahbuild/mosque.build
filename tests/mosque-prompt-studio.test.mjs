import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const source=fs.readFileSync(new URL("../apps/web/components/mosque-prompt-studio.tsx",import.meta.url),"utf8");
const landing=fs.readFileSync(new URL("../apps/web/app/page.tsx",import.meta.url),"utf8");
const styles=fs.readFileSync(new URL("../apps/web/components/mosque-prompt-studio.css",import.meta.url),"utf8");
test("prompt-first homepage offers editable examples and a local-only draft",()=>{
 assert.match(landing,/<MosquePromptStudio\s*\/>/);
 assert.match(source,/textarea/);
 assert.match(source,/maxLength=\{3000\}/);
 assert.match(source,/localStorage\.setItem/);
 assert.match(source,/try\{/);
 assert.match(source,/role="status"/);
 assert.match(source,/prefers-reduced-motion/);
 assert.match(styles,/:focus-visible/);
 assert.match(styles,/@media\(max-width:460px\)/);
});
test("prompt inspiration covers reuse, climate, cost and program",()=>{
 for(const phrase of ["Kilimani","mall","Swahili","rural","warehouse","wudu","school","Sahelian","solar"])assert.match(source,new RegExp(phrase,"i"));
 assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|navigator\.geolocation/);
});
