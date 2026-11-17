import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const require=createRequire(new URL('../apps/web/package.json',import.meta.url));
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const cache=new Map();
function load(path){if(path==='react/jsx-runtime')return require(path);path=path.replace('@/lib/','lib/');if(cache.has(path))return cache.get(path);const mod={exports:{}};const file=path.startsWith('components/')?`${path}.tsx`:`${path}.ts`;const js=ts.transpileModule(readFileSync(new URL(`../apps/web/${file}`,import.meta.url),'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports','require',js)(mod,mod.exports,id=>load(id.startsWith('./')?`lib/${id.slice(2)}`:id));cache.set(path,mod.exports);return mod.exports;}
const {starterCadDocument}=load('lib/cad-authoring-core'),{CadPlanView}=load('components/cad-plan-view');
test('rendered plan exposes every wall and opening as a named keyboard target',()=>{
 const doc=starterCadDocument();doc.level.name='Upper study';
 const html=renderToStaticMarkup(React.createElement(CadPlanView,{doc,selected:'door-1',select:()=>{}}));
 assert.match(html,/Editable Upper study wall and opening plan/);
 assert.equal((html.match(/role="button"/g)||[]).length,8);
 assert.equal((html.match(/tabindex="0"/g)||[]).length,8);
 assert.match(html,/aria-pressed="true" aria-label="Prayer hall entry, door, 1.20 metres wide"/);
 assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
});
test('axis-aligned plan targets have nonzero layout bounds without filling rooms',()=>{
 const html=renderToStaticMarkup(React.createElement(CadPlanView,{doc:starterCadDocument(),selected:'',select:()=>{}}));
 const rectangles=[...html.matchAll(/<rect\b[^>]+>/g)].map(match=>match[0]);
 assert.equal(rectangles.length,8);
 for(const rect of rectangles){assert.ok(Number(rect.match(/width="([^"]+)"/)[1])>0);assert.ok(Number(rect.match(/height="([^"]+)"/)[1])>0);assert.match(rect,/fill="transparent"/);assert.match(rect,/pointer-events="none"/);}
});
