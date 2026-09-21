import lineages from "@/data/architecture-lineages.json";
import references from "@/data/architecture-image-references.json";
import {actionsForLineage,type ArchitectureReferenceAction} from "./architecture-reference-actions";

export const MOSQUE_ARCHITECTURE_ATLAS_SCHEMA="mosque.build/mosque-architecture-atlas@1" as const;
export const MOSQUE_ARCHITECTURE_ATLAS_KEY="mosque-build.mosque-architecture-atlas.v1" as const;

export type AtlasStudyRecord={schema:typeof MOSQUE_ARCHITECTURE_ATLAS_SCHEMA;updatedAt:string;styleId:string;savedFrameIds:string[];projectNotes:string;};
export type AtlasMockupFrame={id:string;label:string;purpose:string;include:string[];reviewGate:string;};
export type MosqueArchitectureProfile={
  id:string;
  title:string;
  region:string;
  period:string;
  referenceName:string;
  referenceImage:string;
  referenceSource:string;
  sourceLabel:string;
  sourceUrl:string;
  confidence:string;
  textbookAnatomy:{label:string;detail:string;}[];
  mockupFrames:AtlasMockupFrame[];
  reviewPrompts:ArchitectureReferenceAction[];
  boundary:string;
};

const referenceByLineage=new Map(references.map(item=>[item.lineageId,item]));

function frame(id:string,label:string,purpose:string,include:string[],reviewGate:string):AtlasMockupFrame{return{id,label,purpose,include,reviewGate}}

function profileFor(lineage:typeof lineages[number]):MosqueArchitectureProfile{
  const reference=referenceByLineage.get(lineage.id);
  const actions=actionsForLineage(lineage.id);
  return{
    id:lineage.id,
    title:lineage.title,
    region:lineage.region,
    period:lineage.period,
    referenceName:reference?.exampleName??lineage.title,
    referenceImage:reference?.imageUrl??"",
    referenceSource:reference?.sourcePage??lineage.source.url,
    sourceLabel:lineage.source.label,
    sourceUrl:lineage.source.url,
    confidence:lineage.source.confidence,
    textbookAnatomy:[
      {label:"Plan logic",detail:lineage.spatialPrinciples.join(" · ")},
      {label:"Climate and material logic",detail:lineage.climateAndMaterial.join(" · ")},
      {label:"Design tests",detail:lineage.designMoves.join(" · ")},
      {label:"Misuse guardrails",detail:lineage.avoid.join(" · ")}
    ],
    mockupFrames:[
      frame(`${lineage.id}-plan`,"Plan mockup",`Show how ${lineage.title} could organize qibla, prayer rows, access and support spaces without copying a monument.`,["qibla direction","saff spacing","accessible route","overflow and daily-use zones"],"community + professional review"),
      frame(`${lineage.id}-section`,"Section mockup","Test volume, roof, light, air, structure and maintenance access as one architectural system.",["roof or ceiling logic","daylight path","air movement","maintenance reach"],"professional review"),
      frame(`${lineage.id}-threshold`,"Arrival mockup","Study how a worshipper moves from street or site edge into the prayer space with dignity and clarity.",["entry sequence","shoe transition","women and family routes","courtyard or porch role"],"community review"),
      frame(`${lineage.id}-surface`,"Surface and craft mockup","Evaluate ornament, pattern, material set-out and authorship only after spatial and performance questions are framed.",["pattern boundary","maker authorship","sample area","cleaning and repair access"],"cultural + professional review"),
      frame(`${lineage.id}-care`,"Stewardship mockup","Make care, replacement, inspections and community responsibility visible before the style is selected.",["inspection cycle","repair material","responsible role","evidence to revisit"],"project-team review")
    ],
    reviewPrompts:actions.slice(0,12),
    boundary:"Educational architecture atlas record. Use for project briefing and mockup planning only; not a design approval, cultural-authenticity finding, specification, structural analysis, code review or permission to build."
  };
}

export const mosqueArchitectureAtlas:MosqueArchitectureProfile[]=lineages.map(profileFor);

export function safeAtlasStudyRecord(value:unknown):AtlasStudyRecord{
  const first=mosqueArchitectureAtlas[0]?.id??"";
  if(!value||typeof value!=="object"||Array.isArray(value))return{schema:MOSQUE_ARCHITECTURE_ATLAS_SCHEMA,updatedAt:new Date().toISOString(),styleId:first,savedFrameIds:[],projectNotes:""};
  const source=value as Partial<AtlasStudyRecord>,styles=new Set(mosqueArchitectureAtlas.map(item=>item.id)),frames=new Set(mosqueArchitectureAtlas.flatMap(item=>item.mockupFrames.map(frame=>frame.id)));
  return{schema:MOSQUE_ARCHITECTURE_ATLAS_SCHEMA,updatedAt:typeof source.updatedAt==="string"?source.updatedAt:new Date().toISOString(),styleId:typeof source.styleId==="string"&&styles.has(source.styleId)?source.styleId:first,savedFrameIds:Array.isArray(source.savedFrameIds)?source.savedFrameIds.filter((id):id is string=>typeof id==="string"&&frames.has(id)).slice(0,80):[],projectNotes:typeof source.projectNotes==="string"?source.projectNotes.slice(0,1200):""};
}
