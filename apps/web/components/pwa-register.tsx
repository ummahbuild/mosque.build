"use client";

import {useEffect,useRef,useState} from "react";
import {observeAppUpdates,requestAppInstall,unregisterDevelopmentWorker,type AppInstallPrompt} from "@/lib/app-update-controller";
import "./pwa-register.css";

type InstallEvent=Event&AppInstallPrompt;

export function PwaRegister(){
  const [install,setInstall]=useState<InstallEvent|null>(null);
  const [waiting,setWaiting]=useState(false),[updating,setUpdating]=useState(false),[installing,setInstalling]=useState(false);
  const [reloadReady,setReloadReady]=useState(false),[offline,setOffline]=useState(false),[offlineDismissed,setOfflineDismissed]=useState(false);
  const [dismissed,setDismissed]=useState(false),[error,setError]=useState("");
  const updates=useRef<ReturnType<typeof observeAppUpdates>|null>(null);
  const installBusy=useRef(false),mounted=useRef(false);

  useEffect(()=>{
    mounted.current=true;
    setOffline(!navigator.onLine);
    const online=()=>{setOffline(false);setOfflineDismissed(false)};
    const offlineHandler=()=>{setOffline(true);setOfflineDismissed(false)};
    window.addEventListener("online",online);
    window.addEventListener("offline",offlineHandler);
    if("serviceWorker" in navigator){
      const scriptUrl=new URL("/sw.js",location.href).href;
      if(process.env.NODE_ENV==="production")updates.current=observeAppUpdates(navigator.serviceWorker,{
        waiting:worker=>{setWaiting(!!worker);if(worker){setDismissed(false);setReloadReady(false)}},
        activated:approved=>{
          setUpdating(false);setError("");
          if(approved)window.location.reload();
          else{setReloadReady(true);setDismissed(false)}
        },
        error:message=>{setUpdating(false);setError(message)},
      },scriptUrl);
      else void unregisterDevelopmentWorker(navigator.serviceWorker,scriptUrl).catch(()=>undefined);
    }
    const beforeInstall=(event:Event)=>{
      event.preventDefault();setInstall(event as InstallEvent);setError("");
    };
    const installed=()=>{setInstall(null);setInstalling(false);setError("")};
    window.addEventListener("beforeinstallprompt",beforeInstall);
    window.addEventListener("appinstalled",installed);
    return ()=>{
      mounted.current=false;
      updates.current?.dispose();updates.current=null;
      window.removeEventListener("online",online);
      window.removeEventListener("offline",offlineHandler);
      window.removeEventListener("beforeinstallprompt",beforeInstall);
      window.removeEventListener("appinstalled",installed);
    };
  },[]);

  const installApp=async()=>{
    if(!install||installBusy.current)return;
    installBusy.current=true;setInstalling(true);setError("");
    const result=await requestAppInstall(install);
    installBusy.current=false;
    if(!mounted.current)return;
    // Browser install events are single-use, including dismissed or failed prompts.
    setInstall(null);setInstalling(false);
    if(result==="failed")setError("Installation could not start. You can keep using mosque.build in this browser, or install it from your browser menu.");
  };
  const update=()=>{
    setError("");
    if(reloadReady){window.location.reload();return}
    if(updates.current?.request())setUpdating(true);
    else setError("This update is no longer waiting. Save your work, then reload to check the latest version.");
  };
  const showUpdate=(waiting||reloadReady)&&!dismissed;
  return <>
    {offline&&!offlineDismissed&&<div className="appConnectionStatus"><p role="status">You’re offline. Some saved pages may be available; online services need a connection.</p><button type="button" aria-label="Dismiss offline notice" onClick={()=>setOfflineDismissed(true)}>×</button></div>}
    {showUpdate?<aside className="appInstallPrompt" aria-label="App update"><div role="status"><b>{reloadReady?"A new version is available":"An update is ready"}</b><p>Save or download any unsaved work in this tab before reloading.</p></div><button type="button" disabled={updating} onClick={update}>{updating?"Updating…":reloadReady?"Reload now":"Update and reload"}</button><button type="button" className="appPromptDismiss" aria-label="Dismiss update prompt" disabled={updating} onClick={()=>setDismissed(true)}>×</button></aside>:
      install&&<aside className="appInstallPrompt" aria-label="Install mosque.build"><div role="status"><b>Install mosque.build</b><p>Keep your project workspace one tap away.</p></div><button type="button" onClick={installApp} disabled={installing}>{installing?"Opening…":"Install"}</button><button type="button" className="appPromptDismiss" aria-label="Dismiss install prompt" disabled={installing} onClick={()=>setInstall(null)}>×</button></aside>}
    {error&&<aside className="appPromptError"><p role="alert">{error}</p><button type="button" aria-label="Dismiss app notice" onClick={()=>setError("")}>×</button></aside>}
  </>;
}
