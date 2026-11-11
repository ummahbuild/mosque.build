import type {ConceptFields} from "./concept-onboarding";
import {safeProjectDraft,type ProjectDraft} from "./project-draft";

export const conceptReviewFields=["location","attendance","budget","type","needs","style","storeys","notes"] as const;
export type ConceptReviewField=typeof conceptReviewFields[number];
export function mergeReviewedConcept(current:ProjectDraft,concept:ConceptFields,accepted:readonly ConceptReviewField[]):ProjectDraft {
  const next={...current};
  for(const field of accepted){
    if(!conceptReviewFields.includes(field))throw new Error("Unsupported concept field.");
    if(field==="budget"){
      if(!concept.budget)continue;
      // Amount and currency must be reviewed together; never attach an old currency to a new amount.
      next.budget=concept.budget;next.currency=concept.currency;
    }else if(field==="needs")next.needs=Array.from(new Set([...current.needs,...concept.needs]));
    else if(field==="style")next.style=[...concept.style];
    else if(field==="notes")next.notes=[current.notes,concept.notes].filter(Boolean).join("\n\n");
    else if(concept[field])next[field]=concept[field];
  }
  if(!safeProjectDraft(next))throw new Error("These changes exceed the supported brief format. Your existing brief is unchanged; keep the concept separately.");
  return next;
}
