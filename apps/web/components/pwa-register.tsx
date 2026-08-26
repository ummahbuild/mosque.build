"use client";

import {useEffect, useState} from "react";

type InstallEvent = Event & {prompt: () => Promise<void>; userChoice: Promise<{outcome: "accepted" | "dismissed"}>};

export function PwaRegister() {
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const online = () => setOffline(false);
    const offlineHandler = () => setOffline(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", offlineHandler);

    let refreshing = false;
    const controllerChanged = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };
    navigator.serviceWorker?.addEventListener("controllerchange", controllerChanged);

    if (process.env.NODE_ENV !== "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(registration => registration.unregister())).catch(() => undefined);
    }

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(registration => {
        if (registration.waiting) setWaiting(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setWaiting(worker);
          });
        });
      }).catch(() => undefined);
    }

    const beforeInstall = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallEvent);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offlineHandler);
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      navigator.serviceWorker?.removeEventListener("controllerchange", controllerChanged);
    };
  }, []);

  return <>
    {offline && <div className="connectionStatus" role="status">You’re offline. Cached pages remain available.</div>}
    {waiting && <div className="installPrompt" role="status" aria-live="polite"><div><b>An update is ready</b><span>Reload to use the latest mosque.build.</span></div><button onClick={() => waiting.postMessage({type: "SKIP_WAITING"})}>Update</button><button aria-label="Dismiss update prompt" className="dismissInstall" onClick={() => setWaiting(null)}>×</button></div>}
    {!waiting && showInstall && install && <div className="installPrompt" role="status"><div><b>Install mosque.build</b><span>Keep the project workspace one tap away.</span></div><button onClick={async () => {await install.prompt(); await install.userChoice; setShowInstall(false);}}>Install</button><button aria-label="Dismiss install prompt" className="dismissInstall" onClick={() => setShowInstall(false)}>×</button></div>}
  </>;
}
