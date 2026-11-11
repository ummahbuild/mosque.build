import type {ConceptEvidence} from "@/lib/concept-onboarding";
import "./concept-source-evidence.css";

export function ConceptSourceEvidence({evidence}:{evidence:ConceptEvidence|undefined}) {
  if(!evidence)return null;
  const label=evidence.status==="ambiguous"?"Needs clarification":evidence.status==="unspecified"?"Not specified":evidence.confidence==="interpreted"?"Interpretation — confirm":"Found in your words — confirm";
  return <span className="conceptEvidence" data-status={evidence.status}>
    <strong>{label}</strong><span>{evidence.reason}</span>
    {evidence.sources.slice(0,4).map((source,index)=><q dir="auto" key={`${source.start}-${index}`}>{source.quote}</q>)}
    {evidence.sources.length>4&&<small>More matching phrases are in the original concept.</small>}
  </span>;
}
