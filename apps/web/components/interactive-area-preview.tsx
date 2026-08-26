"use client";

import {useState} from "react";

type Area={eyebrow:string;title:string;features:string[]};

export function InteractiveAreaPreview({area}:{area:Area}){
  const [active,setActive]=useState(0);
  const [connected,setConnected]=useState(false);
  const feature=area.features[active] || area.features[0];
  return <div className="areaPreview interactivePreview">
    <div className="areaPreviewBar"><span><i aria-hidden="true"/> My Mosque</span><span>Interactive preview</span></div>
    <div className="areaPreviewBody">
      <div className="areaSide" aria-label="Preview views">{area.features.slice(0,5).map((item,index)=><button type="button" className={index===active?"selected":""} aria-pressed={index===active} onClick={()=>setActive(index)} key={item}>{item}</button>)}</div>
      <div className="areaCanvas" aria-live="polite"><small>{area.eyebrow} WORKSPACE</small><h3>{feature}</h3><p>Explore how this decision connects to the project record before it becomes a commitment.</p>
        <div className="areaMetricRow"><button type="button" onClick={()=>setConnected(value=>!value)} aria-pressed={connected}><b>{connected?"Connections visible":"Show connections"}</b><span>Design · cost · approvals</span></button><div><b>Review state</b><span>Needs accountable owner</span></div></div>
        <div className={`areaDiagram${connected?" connected":""}`} aria-label={connected?"Connected decision path displayed":"Decision path preview"}><i/><i/><i/><i/><i/></div>
        <span className="previewHint">Choose a workspace view or reveal connected decisions.</span>
      </div>
    </div>
  </div>;
}
