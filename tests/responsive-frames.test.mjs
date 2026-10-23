import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const layout=fs.readFileSync(new URL("../apps/web/app/layout.tsx",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../apps/web/app/responsive-frames.css",import.meta.url),"utf8");
test("shared responsive styles load after base styles",()=>{
 assert.match(layout,/globals\.css["'];import ["']\.\/responsive-frames\.css/);
});
test("hero, examples and design frames have tablet and phone layout rules",()=>{
 for(const token of [".landingHero",".screenGrid",".showcaseGrid",".cadLayout",".cadPlan",".mosquePromptChips",".studioProjectGrid",".principleStrip"])
 assert.ok(css.includes(token),token);
 for(const width of ["1100","760","390"])assert.match(css,new RegExp("max-width: "+width+"px"));
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/overflow-x:auto/);
});
