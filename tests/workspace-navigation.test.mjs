import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const source=readFileSync(new URL('../apps/web/lib/workspace-navigation.ts',import.meta.url),'utf8');
const module={exports:{}};
new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(module,module.exports);
const {workspaceSlug,workspaceId,filterWorkspaceTools,workspaceHashId,workspaceScrollTop}=module.exports;
const tools=[{id:'cost',label:'Cost and materials',eyebrow:'Regional estimates'},{id:'cafe',label:'Café planning',eyebrow:'Community'},{id:'wudu',label:'Wudu area',eyebrow:'Access and water'}];
test('search matches terms independently of order, case, spacing and accents',()=>{
 for(const query of ['cost materials','  MATERIALS   cost ','regional cost'])assert.deepEqual(filterWorkspaceTools(tools,query).map(t=>t.id),['cost']);
 assert.deepEqual(filterWorkspaceTools(tools,'cafe').map(t=>t.id),['cafe']);
 assert.deepEqual(filterWorkspaceTools(tools,'   '),tools);
 assert.deepEqual(filterWorkspaceTools(tools,'unknown'),[]);
});
test('non-Latin tool titles retain distinct stable identifiers',()=>{assert.notEqual(workspaceSlug('وضوء'),workspaceSlug('مكتبة'));assert.equal(workspaceSlug('Café + Wudu'),'cafe-wudu');});
test('existing unique anchors remain unchanged',()=>assert.equal(workspaceId('cad-authoring-title','Some heading',0,()=>false),'cad-authoring-title'));
test('duplicate existing anchors receive a unique generated anchor',()=>{const taken=new Set(['old-id','tool-wall-design','tool-wall-design-2']);assert.equal(workspaceId('old-id','Wall design',0,id=>taken.has(id)),'tool-wall-design-3');});
test('generated anchors avoid non-workspace DOM IDs too',()=>{assert.equal(workspaceId('','Wudu',2,id=>id==='tool-wudu'),'tool-wudu-2');});
test('blank or punctuation-only titles receive stable fallback identifiers',()=>{assert.equal(workspaceId('','!!!',4,()=>false),'tool-5');});
test('unicode hash links decode safely and malformed URLs do not throw',()=>{assert.equal(workspaceHashId('#%D9%88%D8%B6%D9%88%D8%A1'),'وضوء');assert.equal(workspaceHashId('#%not-valid'),'');assert.equal(workspaceHashId(''),'');assert.equal(workspaceHashId('#cad-authoring-title'),'cad-authoring-title');});
test('target position subtracts the measured header and both toolbars once',()=>{assert.equal(workspaceScrollTop(500,1000,72,62,64),1286);assert.equal(workspaceScrollTop(500,1000,64,62,102),1256);assert.equal(workspaceScrollTop(10,0,64,62,102),0);});
test('interactive workspaces retain stable layout and do not clip the dropdown',()=>{const css=readFileSync(new URL('../apps/web/app/globals.css',import.meta.url),'utf8');assert.match(css,/\.workspaceSection>:where\(article,section,aside\)\{content-visibility:visible/);assert.doesNotMatch(css,/\.workspaceSection>[^{}]*\{content-visibility:auto/);assert.match(css,/\.workspaceSection>\.toolNavigator\{content-visibility:visible;contain:none\}/);assert.doesNotMatch(css,/:where\(button,\[aria-disabled=true\],:disabled\)\{cursor:not-allowed\}/);});
test('all rendered page mains provide exactly one focusable skip-link target',()=>{
 const root=new URL('../apps/web/',import.meta.url);
 const walk=dir=>readdirSync(new URL(dir,root),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(`${dir}/${entry.name}`):entry.name.endsWith('.tsx')?[`${dir}/${entry.name}`]:[]);
 let count=0;
 for(const file of [...walk('app'),...walk('components')]){
  const text=readFileSync(new URL(file,root),'utf8'),mains=[...text.matchAll(/<main\b[^>]*>/g)];
  if(!mains.length)continue;count++;assert.equal(mains.length,1,file);
  assert.match(mains[0][0],/id="main-content"/,file);assert.match(mains[0][0],/tabIndex=\{-1\}/,file);
 }
 assert.ok(count>=30);
 assert.doesNotMatch(readFileSync(new URL('app/layout.tsx',root),'utf8'),/<div[^>]*id="main-content"/);
});
