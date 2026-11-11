"use client";
import { useEffect, useRef, useState } from "react";
import { CAD_AUTHORING_KEY, type CadDocument } from "@/lib/cad-authoring-core";
import { readCadRecord } from "@/lib/cad-local-recovery";
import "./cad-three-preview.css";

export function CadThreePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<CadDocument | null>(null);
  const [message, setMessage] = useState("Preparing model view…");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let previous: string | null | undefined;
    const read = () => {
      try {
        const raw = localStorage.getItem(CAD_AUTHORING_KEY);
        if (raw === previous) return;
        previous = raw;
        const result = readCadRecord(raw);
        setDoc(result.kind === "ready" ? result.state.document : null);
      } catch { setDoc(null); }
    };
    const changed = (event: StorageEvent) => { if (event.key === CAD_AUTHORING_KEY || event.key === null) read(); };
    read();
    addEventListener("mosque-build:project-change", read);
    addEventListener("storage", changed);
    return () => { removeEventListener("mosque-build:project-change", read); removeEventListener("storage", changed); };
  }, []);
  useEffect(() => {
    const container = ref.current;
    if (!container || !doc?.walls.length) {
      setMessage("Commit a valid plan to view it in three dimensions.");
      return;
    }
    let stopped = false, dispose = () => {};
    setMessage("Preparing model view…");
    void (async () => {
      try {
        const [THREE, { OrbitControls }, { buildCadThreeGroup, disposeCadThreeGroup }] = await Promise.all([
          import("three"), import("three/examples/jsm/controls/OrbitControls.js"), import("@/lib/cad-three-adapter"),
        ]);
        if (stopped) return;
        const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(46, 1, .1, 20000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const controls = new OrbitControls(camera, renderer.domElement);
        const group = buildCadThreeGroup(doc);
        const bounds = new THREE.Box3().setFromObject(group), center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z, 2);
        scene.background = new THREE.Color(0xf4f0e4);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x355048, 2), group);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        container.replaceChildren(renderer.domElement);
        renderer.domElement.tabIndex = 0;
        renderer.domElement.setAttribute("aria-label", `Interactive conceptual CAD model revision ${doc.revision}. Use arrow keys to pan.`);
        controls.listenToKeyEvents(renderer.domElement);
        controls.target.copy(center);
        const render = () => { if (!stopped && !document.hidden) renderer.render(scene, camera); };
        const resize = () => {
          const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const distance = radius * 1.8 / Math.min(camera.aspect, 1);
          camera.position.copy(center).add(new THREE.Vector3(distance, distance * .75, distance));
          camera.updateProjectionMatrix();
          controls.update();
          render();
        };
        const lost = (event: Event) => { event.preventDefault(); setMessage("The model view paused because graphics became unavailable. Retry, or use the floor plan and schedules."); };
        const observer = new ResizeObserver(resize);
        dispose = () => {
          observer.disconnect(); controls.removeEventListener("change", render); controls.dispose();
          document.removeEventListener("visibilitychange", render);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          disposeCadThreeGroup(group); renderer.dispose(); renderer.domElement.remove();
        };
        controls.addEventListener("change", render);
        document.addEventListener("visibilitychange", render);
        renderer.domElement.addEventListener("webglcontextlost", lost);
        observer.observe(container); resize();
        setMessage(`Showing saved revision ${doc.revision}. Drag to orbit; use arrow keys to pan.`);
      } catch {
        dispose();
        if (!stopped) setMessage("The 3D view is unavailable. Your model is safe; use the floor plan and schedules, or retry.");
      }
    })();
    return () => { stopped = true; dispose(); };
  }, [doc, retry]);
  return <section className="cadThree" aria-labelledby="cad-three-title"><header><h3 id="cad-three-title">Committed three-dimensional model</h3><p role="status" aria-live="polite">{message}</p>{doc && doc.walls.length > 0 && <button type="button" onClick={() => setRetry(value => value + 1)}>Reset / retry model view</button>}</header><div ref={ref}/><footer>Proxy solids show semantic placement. They do not provide construction geometry, clash results, material performance or professional approval.</footer></section>;
}
