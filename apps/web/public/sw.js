const CACHE="mosque-build-shell-v23";
const SHELL=["/","/start","/my-project","/features","/features/priority-100","/features/priority-200","/features/priority-300","/features/priority-400","/features/priority-500","/features/priority-600","/features/priority-700","/features/priority-800","/resources","/patterns","/prototypes","/open-source","/sources","/roadmap","/manifest.webmanifest","/offline.html","/icons/icon-192.png","/icons/icon-512.png"];

self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(SHELL.map(async path=>{const response=await fetch(path,{cache:"no-cache"});if(response.ok)await cache.put(path,response)})))));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);if(url.origin!==location.origin)return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).then(response=>response.ok?response:Promise.reject(new Error("Navigation response was not successful"))).catch(async()=>await caches.match(url.pathname)||await caches.match(event.request)||await caches.match("/offline.html")));
    return;
  }
  if(["style","script"].includes(event.request.destination))event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response}).catch(()=>caches.match(event.request)));
  if(["image","font"].includes(event.request.destination))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response})));
});
