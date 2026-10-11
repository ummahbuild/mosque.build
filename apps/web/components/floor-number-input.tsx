"use client";

import {useEffect,useId,useState} from "react";

/** Keep incomplete keystrokes out of the saved plan and its derived geometry. */
export function FloorNumberInput({value,min,max,step=.1,onCommit}:{value:number;min:number;max:number;step?:number;onCommit:(value:number)=>void}) {
  const [draft,setDraft]=useState(String(value)),[error,setError]=useState("");
  const errorId=useId();
  useEffect(()=>{setDraft(String(value));setError("");},[value]);
  const commit=()=>{
    const next=draft.trim()===""?NaN:Number(draft);
    if(!Number.isFinite(next)||next<min||next>max){setError(`Enter a number from ${min} to ${max}. The last saved value is ${value}.`);return;}
    setError("");if(next!==value)onCommit(next);
  };
  return <><input type="number" min={min} max={max} step={step} value={draft} aria-invalid={error?true:undefined} aria-describedby={error?errorId:undefined} onChange={event=>{setDraft(event.target.value);setError("");}} onBlur={commit} onKeyDown={event=>{
    if(event.key==="Enter"){event.preventDefault();commit();}
    if(event.key==="Escape"){event.preventDefault();setDraft(String(value));setError("");}
  }}/>{error?<small id={errorId} role="alert">{error}</small>:null}</>;
}
