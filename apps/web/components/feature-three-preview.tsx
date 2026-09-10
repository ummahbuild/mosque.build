"use client";

import {useEffect,useRef,useState} from "react";
import type {ArchitectureFeature} from "@/lib/architecture-feature-plan";
import {featurePreviewKit} from "@/lib/architecture-feature-preview";
import {ELEMENT_COST_KEY,elementCostGaps,elementCostTotals,emptyElementCost,formatEstimate,safeElementCosts,type ElementCostEstimate} from "@/lib/element-cost-estimate";
import "./architecture-feature-preview.css";

export function FeatureThreePreview({feature}:{feature:ArchitectureFeature}){
  const host=useRef<HTMLDivElement>(null);
  const [state,setState]=useState<"loading"|"ready"|"unavailable">("loading");
  const [cost,setCost]=useState<ElementCostEstimate>(()=>emptyElementCost(feature.id));

  useEffect(()=>{try{const all=safeElementCosts(JSON.parse(localStorage.getItem(ELEMENT_COST_KEY)||"{}"));setCost(all[feature.id]??emptyElementCost(feature.id))}catch{setCost(emptyElementCost(feature.id))}},[feature.id]);
  const patchCost=(next:Partial<ElementCostEstimate>)=>setCost(current=>{const updated={...current,...next,updatedAt:new Date().toISOString()};try{const all=safeElementCosts(JSON.parse(localStorage.getItem(ELEMENT_COST_KEY)||"{}"));localStorage.setItem(ELEMENT_COST_KEY,JSON.stringify({...all,[feature.id]:updated}));window.dispatchEvent(new Event("mosque-build-cost-update"))}catch{}return updated});

  useEffect(()=>{
    const container=host.current;
    if(!container)return;
    let stopped=false,frame=0,cleanup=()=>{};
    setState("loading");
    Promise.all([import("three"),import("three/examples/jsm/controls/OrbitControls.js"),import("@/lib/architecture-kit-three-adapter")]).then(([THREE,{OrbitControls},{buildArchitectureKitGroup,disposeArchitectureKitGroup}])=>{
      if(stopped)return;
      const scene=new THREE.Scene();
      scene.background=new THREE.Color(0xf2eee4);
      const camera=new THREE.PerspectiveCamera(38,1,.1,1000);
      const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"low-power",alpha:false});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      container.append(renderer.domElement);
      renderer.domElement.setAttribute("aria-label",`Interactive 3D concept preview of ${feature.feature}`);
      renderer.domElement.setAttribute("role","img");
      renderer.domElement.tabIndex=0;
      const group=buildArchitectureKitGroup(featurePreviewKit(feature));
      scene.add(group,new THREE.HemisphereLight(0xfffbef,0x4b6258,2.4));
      const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(8,12,7);scene.add(key);
      const grid=new THREE.GridHelper(24,12,0x9d8b6b,0xd8d0c0);scene.add(grid);
      const box=new THREE.Box3().setFromObject(group),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),span=Math.max(size.x,size.y,size.z,2);
      group.position.sub(center);group.position.y+=size.y/2;
      camera.position.set(span*1.15,span*.8,span*1.25);camera.lookAt(0,size.y*.35,0);
      const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=span*.65;controls.maxDistance=span*4;controls.target.set(0,size.y*.35,0);controls.update();
      const render=()=>{controls.update();renderer.render(scene,camera)};
      const resize=()=>{const rect=container.getBoundingClientRect();renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false);camera.aspect=Math.max(1,rect.width)/Math.max(1,rect.height);camera.updateProjectionMatrix();render()};
      const observer=new ResizeObserver(resize);observer.observe(container);resize();
      const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
      const animate=()=>{render();frame=requestAnimationFrame(animate)};
      if(reduced)controls.addEventListener("change",render);else animate();
      setState("ready");
      cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();controls.removeEventListener("change",render);controls.dispose();disposeArchitectureKitGroup(group);grid.geometry.dispose();grid.material.dispose();renderer.dispose();renderer.domElement.remove()};
    }).catch(()=>{if(!stopped)setState("unavailable")});
    return()=>{stopped=true;cleanup()};
  },[feature]);

  const totals=elementCostTotals(cost),gaps=elementCostGaps(cost),number=(key:keyof Pick<ElementCostEstimate,"quantity"|"lowRate"|"baseRate"|"highRate">)=>(e:React.ChangeEvent<HTMLInputElement>)=>patchCost({[key]:Math.max(0,Number(e.target.value)||0)});
  return <div className="featurePreviewWithCost"><div className="featureThreePreview" aria-busy={state==="loading"}>
    <div className="featureThreeCanvas" ref={host}/>{state==="loading"?<span role="status">Preparing 3D preview…</span>:null}{state==="unavailable"?<span role="status">3D preview is unavailable on this device.</span>:null}
  </div><details className="elementCost" open><summary><span>Element cost study</span><b>{formatEstimate(totals.base,cost.currency)}</b></summary><div className="elementCostGrid"><label>Quantity<input type="number" min="0" step="any" value={cost.quantity} onChange={number("quantity")}/></label><label>Unit<input value={cost.unit} maxLength={30} onChange={e=>patchCost({unit:e.target.value})}/></label><label>Currency<input value={cost.currency} maxLength={3} placeholder="e.g. USD" onChange={e=>patchCost({currency:e.target.value.replace(/[^a-z]/gi,"").slice(0,3).toUpperCase()})}/></label><label>Low unit rate<input type="number" min="0" step="any" value={cost.lowRate} onChange={number("lowRate")}/></label><label>Base unit rate<input type="number" min="0" step="any" value={cost.baseRate} onChange={number("baseRate")}/></label><label>High unit rate<input type="number" min="0" step="any" value={cost.highRate} onChange={number("highRate")}/></label><label>Market / geography<input value={cost.geography} placeholder="Coarse market, not an address" onChange={e=>patchCost({geography:e.target.value})}/></label><label>Price date<input type="date" value={cost.priceDate} onChange={e=>patchCost({priceDate:e.target.value})}/></label><label>Evidence source<input value={cost.sourceLabel} placeholder="Quote, index or catalogue reference" onChange={e=>patchCost({sourceLabel:e.target.value})}/></label><label>Confidence<select value={cost.confidence} onChange={e=>patchCost({confidence:e.target.value as ElementCostEstimate["confidence"]})}><option>low</option><option>medium</option><option>high</option></select></label><label className="wide">Exclusions<input value={cost.exclusions} placeholder="Delivery, tax, installation…" onChange={e=>patchCost({exclusions:e.target.value})}/></label></div><div className="elementCostTotals"><span>Low <b>{formatEstimate(totals.low,cost.currency)}</b></span><span>Working <b>{formatEstimate(totals.base,cost.currency)}</b></span><span>High <b>{formatEstimate(totals.high,cost.currency)}</b></span></div><p className={gaps.length?"costNeedsEvidence":"costHasEvidence"}>{gaps.length?`Needs ${gaps.join(", ")} before comparison.`:`User-entered ${cost.confidence}-confidence estimate · ${cost.geography} · ${cost.priceDate}.`}</p><small>Planning estimate only. Verify quantities, scope, tax, delivery, installation, escalation and current supplier evidence with a qualified cost professional.</small></details></div>;
}
