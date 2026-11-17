const CACHE="mosque-build-shell-v26";
const SHELL=["/","/start","/my-project","/features","/features/priority-100","/features/priority-200","/features/priority-300","/features/priority-400","/features/priority-500","/features/priority-600","/features/priority-700","/features/priority-800","/resources","/patterns","/prototypes","/open-source","/sources","/roadmap","/manifest.webmanifest","/icons/icon-192.png","/icons/icon-512.png"];

self.addEventListener("install",event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  // A replacement must have an offline response before it can activate.
  const offline=await fetch("/offline.html",{cache:"no-cache"});
  if(!offline.ok)throw new Error("Offline page could not be saved");
  await cache.put("/offline.html",offline);
  await Promise.allSettled(SHELL.map(async path=>{
    const response=await fetch(path,{cache:"no-cache"});
    if(response.ok&&!response.redirected)await cache.put(path,response);
  }));
})()));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("mosque-build-shell-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

async function cached(request){
  // Never read another application's cache, even on a shared origin.
  return (await caches.open(CACHE)).match(request);
}
function unavailable(){
  return new Response("This page is unavailable offline. Reconnect and try again.",{
    status:503,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}
  });
}
function remember(event,response){
  if(response.ok&&!response.redirected){
    const copy=response.clone();
    // A full cache must not turn a successful network response into an error.
    event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>undefined));
  }
  return response;
}
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);if(url.origin!==location.origin)return;
  if(event.request.mode==="navigate"){
    // Preserve real HTTP errors; fallback is only for a failed connection.
    event.respondWith(fetch(event.request).catch(async()=>{
      try{return await cached(event.request)||await cached(url.pathname)||await cached("/offline.html")||unavailable()}
      catch{return unavailable()}
    }));
    return;
  }
  if(["style","script"].includes(event.request.destination)){
    event.respondWith(fetch(event.request).then(response=>remember(event,response)).catch(async()=>{
      try{return await cached(event.request)||unavailable()}catch{return unavailable()}
    }));
  }
  if(["image","font"].includes(event.request.destination)){
    event.respondWith((async()=>{
      let response;try{response=await cached(event.request)}catch{/* Network remains usable if storage is blocked. */}
      return response||fetch(event.request).then(response=>remember(event,response));
    })());
  }
});
