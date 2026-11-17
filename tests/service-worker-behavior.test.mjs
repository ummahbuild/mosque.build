import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../apps/web/public/sw.js',import.meta.url),'utf8');
const origin='https://mosque.build';
function worker({network=async()=>new Response('network'),entries=[],storageFailure=false,writeFailure=false}={}){
  const listeners={},saved=new Map(entries),writes=[],deleted=[],opened=[];
  let claimed=false,skipped=false;
  const key=r=>typeof r==='string'?r:r.url;
  const cache={match:async r=>saved.get(key(r))?.clone(),put:async(r,response)=>{if(writeFailure)throw Error('Quota');writes.push(key(r));saved.set(key(r),response)}};
  vm.runInNewContext(source,{URL,Response,location:{origin},fetch:network,self:{addEventListener:(n,fn)=>listeners[n]=fn,clients:{claim:async()=>{claimed=true}},skipWaiting:()=>{skipped=true}},caches:{open:async n=>{opened.push(n);if(storageFailure)throw Error('Blocked');return cache},keys:async()=>['foreign-cache','mosque-build-shell-v24','mosque-build-shell-v26'],delete:async n=>deleted.push(n),match:()=>{throw Error('Global cache lookup must never be used')}}});
  async function lifecycle(name){let pending;listeners[name]({waitUntil:p=>{pending=p}});await pending}
  async function request(path='/',{method='GET',mode='navigate',destination=''}={}){
    const pending=[];let response;
    listeners.fetch({request:{url:new URL(path,origin).href,method,mode,destination},respondWith:p=>{response=p},waitUntil:p=>pending.push(p)});
    const result=await response;await Promise.all(pending);return result;
  }
  return {request,lifecycle,listeners,writes,deleted,opened,get claimed(){return claimed},get skipped(){return skipped}};
}
const offline=()=>Promise.reject(Error('Offline'));
test('activation deletes only obsolete app caches before claiming clients',async()=>{
  const w=worker();await w.lifecycle('activate');assert.deepEqual(w.deleted,['mosque-build-shell-v24']);assert.equal(w.claimed,true);
});
test('install requires an offline page, but tolerates unavailable optional routes',async()=>{
  const w=worker({network:async path=>path==='/offline.html'?new Response('Offline page'):new Response('Unavailable',{status:503})});
  await w.lifecycle('install');assert.deepEqual(w.writes,['/offline.html']);
  await assert.rejects(worker({network:async()=>new Response('No',{status:404})}).lifecycle('install'),/Offline page/);
  await assert.rejects(worker({network:offline}).lifecycle('install'),/Offline/);
});
test('successful navigations and HTTP errors stay network authoritative without being cached',async()=>{
  for(const status of [200,401,403,404,500,503]){
    const w=worker({network:async()=>new Response('Server result',{status}),entries:[['/',new Response('Stale page')]]});
    const response=await w.request();assert.equal(response.status,status);assert.equal(await response.text(),'Server result');assert.deepEqual(w.writes,[]);
  }
});
test('offline navigation uses only current app cache and preserves exact query matches',async()=>{
  const w=worker({network:offline,entries:[[origin+'/start?step=2',new Response('Exact')],['/start',new Response('Shell')],['/offline.html',new Response('Offline')]]});
  assert.equal(await (await w.request('/start?step=2')).text(),'Exact');
  assert.equal(await (await w.request('/start?step=3')).text(),'Shell');
  assert.equal(await (await w.request('/uncached')).text(),'Offline');
  assert.ok(w.opened.every(n=>n==='mosque-build-shell-v26'));
});
test('missing or unavailable caches return a real 503 response instead of undefined',async()=>{
  for(const storageFailure of [false,true]){
    const w=worker({network:offline,storageFailure});
    assert.equal((await w.request('/uncached')).status,503);
    assert.equal((await w.request('/app.js',{mode:'cors',destination:'script'})).status,503);
  }
});
test('script cache writes cannot break successful downloads when storage quota is full',async()=>{
  const w=worker({writeFailure:true});assert.equal(await (await w.request('/app.js',{mode:'cors',destination:'script'})).text(),'network');
});
test('scripts and styles fall back to cached assets after a connection failure',async()=>{
  for(const destination of ['script','style']){
    const w=worker({network:offline,entries:[[origin+'/asset',new Response('Cached asset')]]});
    assert.equal(await (await w.request('/asset',{mode:'cors',destination})).text(),'Cached asset');
  }
});
test('image and font requests remain online-capable when cache storage is blocked',async()=>{
  for(const destination of ['image','font']){
    const w=worker({storageFailure:true});assert.equal(await (await w.request('/asset',{mode:'cors',destination})).text(),'network');
  }
});
test('HTTP asset failures are not cached and foreign or modifying requests are untouched',async()=>{
  const w=worker({network:async()=>new Response('Missing',{status:404})});
  assert.equal((await w.request('/app.js',{mode:'cors',destination:'script'})).status,404);assert.deepEqual(w.writes,[]);
  assert.equal(await w.request('https://example.org/asset',{destination:'script'}),undefined);
  assert.equal(await w.request('/api',{method:'POST'}),undefined);
});
test('worker updates only skip waiting after an explicit update message',()=>{
  const w=worker();w.listeners.message({data:{type:'OTHER'}});assert.equal(w.skipped,false);
  w.listeners.message({data:{type:'SKIP_WAITING'}});assert.equal(w.skipped,true);
});
