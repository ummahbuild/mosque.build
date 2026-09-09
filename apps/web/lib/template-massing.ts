import type {DesignTemplate} from "@/lib/mosque-design-templates";

export const TEMPLATE_MASSING_SCHEMA="mosque.build/template-massing@1" as const;
export type TemplatePrimitive="box"|"column"|"dome"|"pyramid";
export type TemplateMassingElement={id:string;label:string;primitive:TemplatePrimitive;position:[number,number,number];size:[number,number,number];role:"structure"|"roof"|"threshold"|"landscape"|"marker";phase:1|2|3;note:string};
export type TemplateMassingStudy={schema:typeof TEMPLATE_MASSING_SCHEMA;status:"concept";templateId:string;templateName:string;elements:TemplateMassingElement[];parameters:string[];reviewGate:string};
type Add=(primitive:TemplatePrimitive,id:string,label:string,x:number,y:number,z:number,w:number,h:number,d:number,role:TemplateMassingElement["role"],phase:1|2|3,note:string)=>void;

const bounded=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
export function createTemplateMassing(template:DesignTemplate,widthM:number,depthM:number):TemplateMassingStudy{
  const w=bounded(widthM,8,200),d=bounded(depthM,8,200),elements:TemplateMassingElement[]=[];
  const add:Add=(primitive,id,label,x,y,z,ew,eh,ed,role,phase,note)=>elements.push({id:`template:${template.id}:${id}`,label,primitive,position:[x,y,z],size:[Math.max(.15,ew),Math.max(.15,eh),Math.max(.15,ed)],role,phase,note});
  const columns=(prefix:string,count:number,z:number,span:number,phase:1|2|3=2)=>{for(let i=0;i<count;i++){const x=w*(.16+i*(.68/Math.max(1,count-1)));add("column",`${prefix}-${i+1}`,`${prefix} column ${i+1}`,x,1.6,z,.42,3.2,.42,"structure",phase,"Repeated support location is diagrammatic; structural grid and prayer-row coordination require design review.")}};
  if(template.id==="community-hypostyle"){
    for(let row=0;row<3;row++)columns(`bay-row-${row+1}`,6,d*(.2+row*.18),w,1);
    add("box","shade","Expandable shade datum",w/2,3.35,d*.38,w*.78,.22,d*.5,"roof",1,"A low repeatable roof datum tests bay-led growth without fixing a structural system.");
    add("box","expansion","Future bay interface",w*.9,1.5,d*.38,w*.08,3,d*.5,"threshold",3,"Reserved interface keeps a later phase visible and avoids concealed abortive work.");
  }else if(template.id==="maghrebi-court"){
    columns("court-north",7,d*.25,w,2);columns("court-south",7,d*.66,w,2);
    add("box","portico-north","Shaded north portico",w/2,3,d*.22,w*.78,.25,d*.12,"roof",2,"Portico depth must follow solar, rain and gathering studies.");
    add("box","portico-south","Prayer-side portico",w/2,3,d*.7,w*.78,.25,d*.12,"roof",1,"Arcade rhythm follows a working bay grid, not ornamental imitation.");
    add("box","square-marker","Optional square tower study",w*.86,4.4,d*.18,w*.08,8.8,w*.08,"marker",3,"Optional civic marker; height, access, wind and authority constraints are unresolved.");
  }else if(template.id==="swahili-threshold"){
    columns("veranda",6,d*.72,w,1);
    add("box","veranda-roof","Deep shaded veranda",w/2,2.9,d*.72,w*.82,.24,d*.18,"roof",1,"Deep cover tests shade and driven-rain protection.");
    add("pyramid","main-roof","Ventilated roof volume",w/2,4.8,d*.4,w*.72,3,d*.48,"roof",1,"Roof form is a ventilation and rain study, not a claim about a historic prototype.");
    add("box","service-gap","Moisture-separated service bar",w*.82,1.6,d*.42,w*.12,3.2,d*.38,"threshold",2,"A ventilated separation tests moisture isolation from worship areas.");
  }else if(template.id==="mughal-garden-court"){
    add("box","garden-axis","Garden/civic axis",w/2,.08,d*.46,w*.1,.16,d*.72,"landscape",2,"Axis is a circulation and landscape hypothesis; water demand and access take priority over symmetry.");
    add("dome","central-dome","Optional central dome study",w/2,6.1,d*.22,w*.3,3.8,w*.3,"roof",3,"Dome proportion is diagrammatic and requires a sourced precedent plus full engineering.");
    for(const [i,x,z] of [[1,.28,.2],[2,.72,.2],[3,.28,.34],[4,.72,.34]] as const)add("dome",`pavilion-${i}`,`Optional pavilion marker ${i}`,w*x,4.2,d*z,w*.09,1.4,w*.09,"marker",3,"Small marker tests skyline hierarchy only; do not infer cultural authenticity.");
    add("box","portal","Deep threshold portal",w/2,3,d*.78,w*.28,6,d*.06,"threshold",2,"Portal depth and opening remain conceptual and must yield to safe circulation.");
  }else if(template.id==="ottoman-central"){
    add("dome","central-dome","Central volume dome study",w/2,7,d*.42,w*.48,5,w*.48,"roof",2,"Long-span geometry requires structural, seismic, fire, acoustic and environmental design.");
    add("dome","semi-east","East semi-volume",w*.72,5.1,d*.42,w*.23,3,w*.23,"roof",2,"Secondary volume tests hierarchy and load-path questions only.");
    add("dome","semi-west","West semi-volume",w*.28,5.1,d*.42,w*.23,3,w*.23,"roof",2,"Secondary volume tests hierarchy and load-path questions only.");
    add("column","marker","Optional slender marker",w*.88,7,d*.18,w*.045,14,w*.045,"marker",3,"Optional marker requires independent access, wind, seismic, lightning and authority review.");
  }else{
    add("box","climate-canopy","Climate-led public canopy",w/2,3,d*.72,w*.74,.3,d*.18,"roof",2,"Canopy depth should be driven by measured solar, rain and social-use evidence.");
    add("pyramid","daylight-roof","Daylight roof monitor",w/2,4.9,d*.35,w*.42,2.4,d*.34,"roof",2,"Roof monitor tests diffuse daylight and stack ventilation; glare and smoke behavior remain unresolved.");
    add("box","service-spine","Serviceable support spine",w*.83,1.8,d*.45,w*.12,3.6,d*.55,"structure",1,"Compact spine keeps wet services, storage and maintenance access legible.");
    add("box","future-interface","Planned expansion interface",w*.12,1.6,d*.45,w*.05,3.2,d*.55,"threshold",3,"A visible interface reserves a future phase without promising expansion capacity.");
  }
  return{schema:TEMPLATE_MASSING_SCHEMA,status:"concept",templateId:template.id,templateName:template.name,elements,parameters:["Footprint dimensions from schematic plan","Element proportions are bounded conceptual ratios","Phase visibility from template delivery sequence","Template selection stored with project package"],reviewGate:"Conceptual lineage-informed massing only. Do not use for cultural-authenticity claims, dimensions, quantities, structure, fire, accessibility, services, permits or construction. Review with affected communities and qualified professionals."};
}

export function safeTemplateMassing(value:unknown):TemplateMassingStudy|null{if(!value||typeof value!=="object")return null;const x=value as TemplateMassingStudy;return x.schema===TEMPLATE_MASSING_SCHEMA&&x.status==="concept"&&typeof x.templateId==="string"&&x.templateId.length<=100&&Array.isArray(x.elements)&&x.elements.length<=100&&x.elements.every(e=>typeof e.id==="string"&&e.id.length<=180&&["box","column","dome","pyramid"].includes(e.primitive)&&e.position.length===3&&e.size.length===3&&[...e.position,...e.size].every(Number.isFinite))?x:null}
