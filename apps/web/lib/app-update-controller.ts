/** Browser lifecycle orchestration; no project storage is read or written here. */
export function observeAppUpdates(
  container: ServiceWorkerContainer,
  callbacks: {waiting:(worker:ServiceWorker|null)=>void; activated:(reloadApproved:boolean)=>void; error:(message:string)=>void},
  scriptUrl: string,
){
  let disposed=false,requested=false;
  let waiting:ServiceWorker|null=null;
  let timeout:ReturnType<typeof setTimeout>|undefined;
  const clearPending=()=>{if(timeout!==undefined)clearTimeout(timeout);timeout=undefined};
  let lastController=container.controller;
  const cleanups:Array<()=>void>=[];
  const watched=new Set<ServiceWorker>();
  const owns=(worker:ServiceWorker|null)=>worker?.scriptURL===scriptUrl;
  const publish=(worker:ServiceWorker|null)=>{
    waiting=worker;
    if(!disposed)callbacks.waiting(worker);
  };
  const changed=()=>{
    if(disposed||!owns(container.controller)||container.controller===lastController)return;
    const hadController=!!lastController,approved=requested;
    lastController=container.controller;requested=false;clearPending();publish(null);
    // A different tab activating a worker must never discard this tab's edits.
    if(hadController||approved)callbacks.activated(approved);
  };
  container.addEventListener("controllerchange",changed);
  cleanups.push(()=>container.removeEventListener("controllerchange",changed));
  container.register(scriptUrl).then(registration=>{
    if(disposed)return;
    const watch=(worker:ServiceWorker|null)=>{
      if(!worker||!owns(worker)||watched.has(worker))return;
      watched.add(worker);
      const stateChanged=()=>{
        if(disposed)return;
        if(worker.state==="installed"&&container.controller)publish(worker);
        if(worker.state==="redundant"&&waiting===worker){
          publish(null);
          if(requested){clearPending();requested=false;callbacks.error("The update could not finish. Your page is unchanged. Save your work, then reload to try again.")}
        }
      };
      worker.addEventListener("statechange",stateChanged);
      cleanups.push(()=>worker.removeEventListener("statechange",stateChanged));
      stateChanged();
    };
    const updateFound=()=>watch(registration.installing);
    registration.addEventListener("updatefound",updateFound);
    cleanups.push(()=>registration.removeEventListener("updatefound",updateFound));
    watch(registration.waiting);
    watch(registration.installing);
  }).catch(()=>{/* Browsing stays available when service-worker registration is blocked. */});
  return {
    request(){
      if(disposed||requested||!waiting||waiting.state!=="installed")return false;
      requested=true;
      try{
        waiting.postMessage({type:"SKIP_WAITING"});
        if(requested)timeout=setTimeout(()=>{requested=false;callbacks.error("The update is taking longer than expected. Your work is still here. Save or download it before trying again.")},15000);
        return true;
      }
      catch{requested=false;callbacks.error("The update could not start. Save your work, then reload to try again.");return false}
    },
    dispose(){disposed=true;clearPending();for(const cleanup of cleanups)cleanup();watched.clear()},
  };
}

export async function unregisterDevelopmentWorker(container:ServiceWorkerContainer,scriptUrl:string){
  const registrations=await container.getRegistrations();
  // Do not unregister other apps/workers that happen to share a development origin.
  await Promise.allSettled(registrations.filter(registration=>{const workers=[registration.active,registration.waiting,registration.installing].filter(worker=>worker!==null);return workers.length>0&&workers.every(worker=>worker.scriptURL===scriptUrl)}).map(registration=>registration.unregister()));
}

export type AppInstallPrompt={prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export async function requestAppInstall(event:AppInstallPrompt):Promise<"accepted"|"dismissed"|"failed">{
  try{const [,choice]=await Promise.all([event.prompt(),event.userChoice]);return choice.outcome}catch{return "failed"}
}
