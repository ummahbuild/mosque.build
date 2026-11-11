"use client";

import {useState} from "react";
import type {ConceptFields} from "@/lib/concept-onboarding";
import type {ProjectDraft} from "@/lib/project-draft";
import {conceptReviewFields,type ConceptReviewField} from "@/lib/concept-brief-review";
import "./project-draft-recovery.css";

const labels:Record<ConceptReviewField,string>={location:"Location",attendance:"Attendance",budget:"Budget and currency",type:"Project type",needs:"Add program needs",style:"Architecture interests",storeys:"Storeys",notes:"Append original concept to notes"};
export function ConceptImportReview({draft,concept,onApply,onKeep}:{draft:ProjectDraft;concept:ConceptFields;onApply:(fields:ConceptReviewField[])=>void;onKeep:()=>void}) {
  const [accepted,setAccepted]=useState<ConceptReviewField[]>([]);
  const display=(value:string|string[])=>Array.isArray(value)?value.join(", ")||"None recorded":value||"Not recorded";
  return <section className="conceptImportReview" aria-labelledby="concept-import-title">
    <h2 id="concept-import-title">Choose what to bring into your brief</h2>
    <p>Nothing is selected automatically. Compare each suggestion with your saved brief. Unselected fields stay unchanged. These are text-based suggestions, not verified project facts.</p>
    {concept.warnings?.map(warning=><p key={warning} role="note">{warning}</p>)}
    <details><summary>Original concept · source of these suggestions</summary><p className="conceptOriginal">{concept.notes}</p></details>
    <div className="conceptReviewFields">{conceptReviewFields.map(field=>{
      const value=concept[field],available=Array.isArray(value)?value.length>0:!!value;
      const current=field==="budget"?`${draft.currency||"Currency not recorded"} · ${draft.budget||"Amount not recorded"}`:display(draft[field]);
      const proposed=field==="budget"?`${concept.currency||"Currency unspecified — confirm before costing"} · ${concept.budget||"Amount not identified"}`:display(value);
      return <label className="conceptReviewField" key={field}><input type="checkbox" disabled={!available} checked={accepted.includes(field)} onChange={e=>setAccepted(list=>e.target.checked?[...list,field]:list.filter(x=>x!==field))}/><span><b>{labels[field]}</b><span>Current: {current}</span><span>{available?`Suggested: ${proposed}`:"No suggestion found; existing value will be kept."}</span>{field==="needs"&&available&&<small>Selected needs will be added; existing needs will remain.</small>}</span></label>;
    })}</div>
    <div className="draftRecoveryActions"><button type="button" className="secondaryButton" disabled={!accepted.length} onClick={()=>onApply(accepted)}>Apply suggested fields ({accepted.length})</button><button type="button" className="secondaryButton" onClick={onKeep}>Keep existing brief</button></div>
    {!accepted.length&&<p>Select at least one field to enable applying changes.</p>}
  </section>;
}
