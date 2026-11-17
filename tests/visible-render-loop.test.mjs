import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
const source=readFileSync(new URL('../apps/web/lib/visible-render-loop.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};
new Function('module','exports',compiled)(mod,mod.exports);
const {startVisibleRenderLoop}=mod.exports;
function harness({hidden=false,onDraw=()=>{}}={}) {
  let next=0,visibility,intersection,draws=0,removed=0,disconnected=0;
  const pending=new Map(),all=new Map(),cancelled=[];
  const env={
    requestFrame(callback){const id=next++;pending.set(id,callback);all.set(id,callback);return id;},
    cancelFrame(id){cancelled.push(id);pending.delete(id);},
    isHidden:()=>hidden,
    onVisibilityChange(callback){visibility=callback;return()=>removed++;},
    observeVisibility(element,callback){intersection=callback;return()=>disconnected++;},
  };
  const stop=startVisibleRenderLoop({},()=>{draws++;onDraw();},env);
  return {pending,all,cancelled,stop,show:value=>intersection(value),hide:value=>{hidden=value;visibility();},
    tick(){const [id,callback]=pending.entries().next().value;pending.delete(id);callback();},
    get draws(){return draws;},get removed(){return removed;},get disconnected(){return disconnected;}};
}
test('does no work until the preview intersects, then maintains one frame',()=>{
 const h=harness();assert.equal(h.pending.size,0);assert.equal(h.draws,0);
 h.show(true);assert.equal(h.pending.size,1);h.tick();assert.equal(h.draws,1);assert.equal(h.pending.size,1);h.stop();
});
test('offscreen previews cancel the pending frame, including frame id zero',()=>{
 const h=harness();h.show(true);h.show(false);assert.deepEqual(h.cancelled,[0]);assert.equal(h.pending.size,0);assert.equal(h.draws,0);h.stop();
});
test('scrolling back resumes the same callback and retains camera-like state',()=>{
 const camera={angle:23};const h=harness({onDraw:()=>camera.angle++});h.show(true);h.tick();h.show(false);assert.equal(camera.angle,24);
 h.show(true);h.tick();assert.equal(camera.angle,25);h.stop();
});
test('initially hidden documents wait for visibility even when intersecting',()=>{
 const h=harness({hidden:true});h.show(true);assert.equal(h.pending.size,0);h.hide(false);h.tick();assert.equal(h.draws,1);h.stop();
});
test('hiding the tab cancels work; returning offscreen does not resume',()=>{
 const h=harness();h.show(true);h.hide(true);assert.equal(h.pending.size,0);h.show(false);h.hide(false);assert.equal(h.pending.size,0);h.show(true);assert.equal(h.pending.size,1);h.stop();
});
test('repeated visibility notifications cannot create duplicate loops',()=>{
 const h=harness();for(let i=0;i<10;i++){h.show(true);h.hide(false);}assert.equal(h.pending.size,1);h.tick();assert.equal(h.pending.size,1);h.stop();
});
test('stale cancelled callbacks cannot draw or overwrite a newly scheduled frame',()=>{
 const h=harness();h.show(true);const stale=h.all.get(0);h.show(false);h.show(true);stale();assert.equal(h.draws,0);assert.equal(h.pending.size,1);
 h.show(false);assert.deepEqual(h.cancelled,[0,1]);assert.equal(h.pending.size,0);h.stop();
});
test('cleanup is idempotent and disconnects listeners, observer and pending work',()=>{
 const h=harness();h.show(true);const stale=h.all.get(0);h.stop();h.stop();h.show(true);h.hide(false);stale();
 assert.equal(h.pending.size,0);assert.equal(h.draws,0);assert.equal(h.removed,1);assert.equal(h.disconnected,1);
});
test('cleanup inside draw does not schedule another frame',()=>{
 let h;h=harness({onDraw:()=>h.stop()});h.show(true);h.tick();assert.equal(h.pending.size,0);assert.equal(h.draws,1);
});
test('visibility change during draw does not schedule another frame',()=>{
 let h;h=harness({onDraw:()=>h.hide(true)});h.show(true);h.tick();assert.equal(h.pending.size,0);h.stop();
});
test('a failed draw does not create a hot error loop',()=>{
 const h=harness({onDraw:()=>{throw new Error('context failure');}});h.show(true);assert.throws(()=>h.tick(),/context failure/);assert.equal(h.pending.size,0);h.stop();
});
test('each viewer owns an independent lifecycle',()=>{
 const a=harness(),b=harness();a.show(true);b.show(true);a.stop();b.tick();assert.equal(a.draws,0);assert.equal(b.draws,1);b.stop();
});
// Exercise the real browser adapter with browser API doubles, not just its scheduler.
function browserHarness(withObserver=true){
 const frames=new Map(),listeners=new Set();let id=0,observed,observerCallback,disconnects=0;
 const doc={hidden:false,addEventListener(name,cb){assert.equal(name,'visibilitychange');listeners.add(cb);},removeEventListener(name,cb){listeners.delete(cb);}};
 class Observer {constructor(cb){observerCallback=cb;}observe(element){observed=element;}disconnect(){disconnects++;}}
 const module={exports:{}};
 new Function('module','exports','document','requestAnimationFrame','cancelAnimationFrame','IntersectionObserver',compiled)(module,module.exports,doc,cb=>{frames.set(++id,cb);return id;},id=>frames.delete(id),withObserver?Observer:undefined);
 const target={},stop=module.exports.startVisibleRenderLoop(target,()=>{});
 return {target,doc,frames,listeners,stop,notify:entries=>observerCallback(entries),get observed(){return observed;},get disconnects(){return disconnects;}};
}
test('browser observer uses the last matching entry and resumes at the viewport edge',()=>{
 const h=browserHarness();assert.equal(h.observed,h.target);assert.equal(h.frames.size,0);
 h.notify([{target:h.target,isIntersecting:true,intersectionRatio:1},{target:h.target,isIntersecting:false,intersectionRatio:0}]);assert.equal(h.frames.size,0);
 h.notify([{target:{},isIntersecting:true,intersectionRatio:1}]);assert.equal(h.frames.size,0);
 h.notify([{target:h.target,isIntersecting:true,intersectionRatio:0}]);assert.equal(h.frames.size,1);
 h.notify([{target:h.target,isIntersecting:true,intersectionRatio:.01}]);assert.equal(h.frames.size,1);
 h.stop();assert.equal(h.disconnects,1);assert.equal(h.listeners.size,0);assert.equal(h.frames.size,0);
});
test('older browsers without IntersectionObserver still render and pause for hidden tabs',()=>{
 const h=browserHarness(false);assert.equal(h.frames.size,1);h.doc.hidden=true;for(const cb of h.listeners)cb();assert.equal(h.frames.size,0);
 h.doc.hidden=false;for(const cb of h.listeners)cb();assert.equal(h.frames.size,1);h.stop();assert.equal(h.listeners.size,0);assert.equal(h.frames.size,0);
});
for(const name of ['interior-systems-three','interior-three-preview','site-three-coordination','ornamental-three-preview','three-schematic-viewer']) {
 test(`${name} uses the shared lifecycle and stops it before resource disposal`,()=>{
   const component=readFileSync(new URL(`../apps/web/components/${name}.tsx`,import.meta.url),'utf8');
   assert.match(component,/startVisibleRenderLoop\(host.current,/);assert.doesNotMatch(component,/requestAnimationFrame/);
   assert.match(component,/stopRendering\(\);[\s\S]*controls.dispose\(\)/);
 });
}
