import type {MarketplaceCandidate} from "@/lib/marketplace-candidates";

export const MARKETPLACE_PLAN_SCHEMA="mosque.build/marketplace-candidate-shortlist@2";
export const procurementStages=["research","sample","technical_review","quote","approved_alternative"] as const;
export const projectPriorities=["essential","recommended","optional"] as const;
export type ProcurementStage=typeof procurementStages[number];
export type ProjectPriority=typeof projectPriorities[number];
export type CandidateSelection={id:string;quantity:number;zone:string;priority:ProjectPriority;stage:ProcurementStage;notes:string};
export type MarketplacePlan={schema:typeof MARKETPLACE_PLAN_SCHEMA;selections:CandidateSelection[];updatedAt:string};

export function createSelection(id:string):CandidateSelection{return {id,quantity:1,zone:"",priority:"recommended",stage:"research",notes:""}}
export function safeMarketplacePlan(value:unknown,validIds:Set<string>):MarketplacePlan{
  const source=value&&typeof value==="object"?value as Record<string,unknown>:{};
  const legacy=Array.isArray(source.saved)?source.saved.map(id=>createSelection(String(id))):[];
  const raw=Array.isArray(source.selections)?source.selections:legacy;
  const selections:CandidateSelection[]=[];
  for(const item of raw.slice(0,150)){
    if(!item||typeof item!=="object")continue;const row=item as Record<string,unknown>,id=String(row.id||"");
    if(!validIds.has(id)||selections.some(value=>value.id===id))continue;
    const quantity=Number(row.quantity),priority=String(row.priority),stage=String(row.stage);
    selections.push({id,quantity:Number.isFinite(quantity)?Math.min(10000,Math.max(1,Math.round(quantity))):1,zone:String(row.zone||"").slice(0,80),priority:projectPriorities.includes(priority as ProjectPriority)?priority as ProjectPriority:"recommended",stage:procurementStages.includes(stage as ProcurementStage)?stage as ProcurementStage:"research",notes:String(row.notes||"").slice(0,500)});
  }
  return {schema:MARKETPLACE_PLAN_SCHEMA,selections,updatedAt:typeof source.updatedAt==="string"?source.updatedAt:new Date(0).toISOString()};
}
export function evidenceGaps(item:MarketplaceCandidate){
  const gaps=["Current regional availability","Current quote and currency","Lead time and delivery terms","Installation and warranty scope"];
  if(/not recorded|check|verify|no product-specific/i.test(item.cadBim))gaps.push("Product-specific CAD or BIM evidence");
  if(/enquiry|study|route/i.test(item.name))gaps.push("Exact manufacturer product or fabrication proposal");
  return gaps;
}
export function selectionReadiness(selection:CandidateSelection,item:MarketplaceCandidate){
  const missing:string[]=[];
  if(!selection.zone.trim())missing.push("project zone");
  if(!selection.notes.trim())missing.push("requirements note");
  if(selection.stage==="research")missing.push("review stage");
  if(evidenceGaps(item).length)missing.push("external evidence");
  return {ready:missing.length===0,missing};
}
export function groupSelectionSummary(selections:CandidateSelection[],records:MarketplaceCandidate[]){
  const lookup=new Map(records.map(item=>[item.id,item]));
  return selections.reduce((summary,row)=>{const item=lookup.get(row.id);if(item){summary.units+=row.quantity;summary.categories.add(item.category);summary.zones.add(row.zone.trim()||"Unassigned")}return summary},{units:0,categories:new Set<string>(),zones:new Set<string>()});
}
