"use client";

import dynamic from "next/dynamic";
import type {PriorityFeature} from "./priority-feature-explorer";

const Explorer=dynamic(()=>import("./priority-feature-explorer").then(module=>module.PriorityFeatureExplorer),{
  ssr:false,
  loading:()=> <div className="explorerEmpty" role="status" aria-live="polite"><b>Loading the interactive feature batch…</b><p>Preparing filters and your private device shortlist.</p></div>,
});

export function PriorityFeatureExplorerLoader(props:{features:PriorityFeature[];startIndex:number}){return <Explorer {...props}/>}
