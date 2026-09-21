import lineages from "@/data/architecture-lineages.json";
import references from "@/data/architecture-image-references.json";

export const ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA="mosque.build/architecture-reference-actions@1" as const;
export const ARCHITECTURE_REFERENCE_ACTIONS_KEY="mosque-build.architecture-reference-actions.v1" as const;

export type ArchitectureActionCategory="spatial"|"climate-material"|"test-move"|"misuse-guard";
export type ArchitectureReferenceAction={id:string;lineageId:string;lineageTitle:string;referenceName:string;category:ArchitectureActionCategory;prompt:string;evidenceNeeded:string;reviewGate:string;sourceLabel:string;sourceUrl:string;imageSourcePage:string;status:"specified";};
export type SavedReferenceActions={schema:typeof ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA;updatedAt:string;selectedIds:string[];notes:string;};

type Lineage=typeof lineages[number];
const referenceByLineage=new Map(references.map(item=>[item.lineageId,item]));
const categoryLabels:Record<ArchitectureActionCategory,string>={
  "spatial":"Spatial translation",
  "climate-material":"Climate and material evidence",
  "test-move":"Design test",
  "misuse-guard":"Guardrail"
};

function slug(text:string){return text.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)}
function action(lineage:Lineage,category:ArchitectureActionCategory,index:number,text:string):ArchitectureReferenceAction{
  const reference=referenceByLineage.get(lineage.id);
  return{
    id:`${lineage.id}-${category}-${index+1}-${slug(text)}`,
    lineageId:lineage.id,
    lineageTitle:lineage.title,
    referenceName:reference?.exampleName??lineage.title,
    category,
    prompt:text,
    evidenceNeeded:category==="spatial"?"Measured plan, prayer-row diagram, accessibility route and capacity assumption.":category==="climate-material"?"Local climate, material source, durability, maintenance and professional review evidence.":category==="test-move"?"Prototype, model view, comparison note and accountable design-review record.":"Written boundary explaining what the precedent does not prove for this project.",
    reviewGate:category==="misuse-guard"?"community + cultural review":category==="climate-material"?"professional review":"project design review",
    sourceLabel:lineage.source.label,
    sourceUrl:lineage.source.url,
    imageSourcePage:reference?.sourcePage??lineage.source.url,
    status:"specified"
  };
}

export const architectureReferenceActions:ArchitectureReferenceAction[]=lineages.flatMap(lineage=>[
  ...lineage.spatialPrinciples.map((item,index)=>action(lineage,"spatial",index,`Translate the ${lineage.title} principle into a project check: ${item}`)),
  ...lineage.climateAndMaterial.map((item,index)=>action(lineage,"climate-material",index,item)),
  ...lineage.designMoves.map((item,index)=>action(lineage,"test-move",index,item)),
  ...lineage.avoid.map((item,index)=>action(lineage,"misuse-guard",index,item))
]);

export function actionsForLineage(lineageId:string){return architectureReferenceActions.filter(item=>item.lineageId===lineageId)}
export function actionCategoryLabel(category:ArchitectureActionCategory){return categoryLabels[category]}
export function safeReferenceActions(value:unknown):SavedReferenceActions{
  if(!value||typeof value!=="object"||Array.isArray(value))return{schema:ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA,updatedAt:new Date().toISOString(),selectedIds:[],notes:""};
  const record=value as Partial<SavedReferenceActions>,allowed=new Set(architectureReferenceActions.map(item=>item.id)),selectedIds=Array.isArray(record.selectedIds)?record.selectedIds.filter((id):id is string=>typeof id==="string"&&allowed.has(id)).slice(0,100):[];
  return{schema:ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA,updatedAt:typeof record.updatedAt==="string"?record.updatedAt:new Date().toISOString(),selectedIds,notes:typeof record.notes==="string"?record.notes.slice(0,1200):""};
}
