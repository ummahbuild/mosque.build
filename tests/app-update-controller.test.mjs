import test from 'node:test';
import assert from 'node:assert/strict';
import {observeAppUpdates,requestAppInstall,unregisterDevelopmentWorker} from '../apps/web/lib/app-update-controller.ts';
const script='https://mosque.build/sw.js';
class Events{
  events=new Map();
  addEventListener(name,fn){const list=this.events.get(name)??new Set();list.add(fn);this.events.set(name,list)}
  removeEventListener(name,fn){this.events.get(name)?.delete(fn)}
  emit(name){for(const fn of this.events.get(name)??[])fn()}
  get size(){return [...this.events.values()].reduce((sum,list)=>sum+list.size,0)}
}
function worker(state='installed',scriptURL=script){return Object.assign(new Events(),{state,scriptURL,sent:[],postMessage(message){this.sent.push(message)}})}
function fixture({controlled=true,delayed=false}={}){
 const waiting=worker(),registration=Object.assign(new Events(),{waiting,installing:null});
 let resolve;
 const ready=delayed?new Promise(r=>{resolve=r}):Promise.resolve(registration);
 const container=Object.assign(new Events(),{controller:controlled?worker('activated'):null,register:()=>ready});
 const published=[],activated=[],errors=[];
 const controller=observeAppUpdates(container,{waiting:w=>published.push(w),activated:a=>activated.push(a),error:m=>errors.push(m)},script);
 return {waiting,registration,container,controller,published,activated,errors,activate:()=>{container.controller=worker('activated');container.emit('controllerchange')},resolve:()=>resolve(registration)};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('an update activated by another tab never approves an automatic reload',async()=>{
 const f=fixture();await flush();f.activate();
 assert.deepEqual(f.activated,[false]);assert.equal(f.published.at(-1),null);f.controller.dispose();
});
test('only this tab explicitly requesting an update approves one reload',async()=>{
 const f=fixture();await flush();assert.equal(f.controller.request(),true);assert.equal(f.controller.request(),false);
 assert.deepEqual(f.waiting.sent,[{type:'SKIP_WAITING'}]);
 f.activate();f.container.emit('controllerchange');assert.deepEqual(f.activated,[true]);f.controller.dispose();
});
test('initial installation does not prompt a reload, nor does an unrelated controller',async()=>{
 const f=fixture({controlled:false});await flush();assert.deepEqual(f.published,[]);
 f.container.controller=worker('activated');f.container.emit('controllerchange');assert.deepEqual(f.activated,[]);f.activate();assert.deepEqual(f.activated,[false]);f.controller.dispose();
 const other=fixture();await flush();other.container.controller=worker('activated','https://mosque.build/another/sw.js');other.container.emit('controllerchange');assert.deepEqual(other.activated,[]);other.controller.dispose();
});
test('unmount removes all listeners and ignores a late registration result',async()=>{
 const f=fixture();await flush();assert.ok(f.waiting.size>0);f.controller.dispose();
 assert.equal(f.waiting.size,0);assert.equal(f.registration.size,0);assert.equal(f.container.size,0);assert.equal(f.controller.request(),false);
 const delayed=fixture({delayed:true});delayed.controller.dispose();delayed.resolve();await flush();assert.deepEqual(delayed.published,[]);assert.equal(delayed.registration.size,0);
});
test('an already-installing worker and later updatefound events are both observed',async()=>{
 const f=fixture();f.registration.waiting=null;const first=worker('installing');f.registration.installing=first;await flush();
 first.state='installed';first.emit('statechange');assert.equal(f.published.at(-1),first);
 const second=worker('installing');f.registration.installing=second;f.registration.emit('updatefound');second.state='installed';second.emit('statechange');assert.equal(f.published.at(-1),second);
 f.registration.emit('updatefound');assert.equal(second.size,1);f.controller.dispose();assert.equal(first.size,0);assert.equal(second.size,0);
});
test('redundant and failed workers release pending state without approving reload',async()=>{
 const f=fixture();await flush();f.controller.request();f.waiting.state='redundant';f.waiting.emit('statechange');
 assert.equal(f.published.at(-1),null);assert.equal(f.controller.request(),false);assert.equal(f.errors.length,1);assert.deepEqual(f.activated,[]);f.controller.dispose();
 const bad=fixture();await flush();bad.waiting.postMessage=()=>{throw Error('Unavailable')};assert.equal(bad.controller.request(),false);assert.equal(bad.errors.length,1);bad.controller.dispose();
});
test('timed-out activation permits recovery and late activation does not reload',async(t)=>{
 t.mock.timers.enable({apis:['setTimeout']});const f=fixture();await flush();f.controller.request();t.mock.timers.tick(15000);
 assert.equal(f.errors.length,1);f.activate();assert.deepEqual(f.activated,[false]);f.controller.dispose();
});
test('dispose clears a pending activation timer',async(t)=>{
 t.mock.timers.enable({apis:['setTimeout']});const f=fixture();await flush();f.controller.request();f.controller.dispose();t.mock.timers.tick(15000);assert.deepEqual(f.errors,[]);
});
test('development cleanup removes only this app worker and awaits failures safely',async()=>{
 const removed=[];const registration=(id,url)=>({active:worker('activated',url),waiting:null,installing:null,unregister:async()=>{removed.push(id);if(id==='app')throw Error('Unavailable')}});
 await unregisterDevelopmentWorker({getRegistrations:async()=>[registration('app',script),registration('other','https://mosque.build/other/sw.js'),registration('external','https://example.org/sw.js'),{...registration('mixed',script),installing:worker('installing','https://mosque.build/other/sw.js')}]},script);
 assert.deepEqual(removed,['app']);
});
test('install accepted, dismissed and rejected outcomes all settle without uncaught errors',async()=>{
 for(const outcome of ['accepted','dismissed'])assert.equal(await requestAppInstall({prompt:async()=>{},userChoice:Promise.resolve({outcome})}),outcome);
 assert.equal(await requestAppInstall({prompt:async()=>{throw Error('Blocked')},userChoice:Promise.resolve({outcome:'dismissed'})}),'failed');
 assert.equal(await requestAppInstall({prompt:async()=>{},userChoice:Promise.reject(Error('Unavailable'))}),'failed');
});
test('subsequent releases can still activate after an earlier update in another tab',async()=>{
 const f=fixture();await flush();f.activate();assert.deepEqual(f.activated,[false]);
 const next=worker('installing');f.registration.installing=next;f.registration.emit('updatefound');next.state='installed';next.emit('statechange');
 assert.equal(f.controller.request(),true);f.activate();assert.deepEqual(f.activated,[false,true]);f.controller.dispose();
});
test('blocked worker registration does not report a ready update or break page loading',async()=>{
 const container=Object.assign(new Events(),{controller:null,register:async()=>{throw Error('Blocked')}});
 const output=[];const observer=observeAppUpdates(container,{waiting:w=>output.push(w),activated:a=>output.push(a),error:m=>output.push(m)},script);
 await flush();assert.deepEqual(output,[]);assert.equal(observer.request(),false);observer.dispose();assert.equal(container.size,0);
});
