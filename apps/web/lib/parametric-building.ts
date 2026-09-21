import type {FloorPlanState, PlanSpace} from "./floor-plan-workspace";
/** Portable, metre-based geometry. X/Y are plan axes; Z is elevation. */
export const BUILDING_SCHEMA = "mosque.build/parametric-building@1" as const;
export const BUILDING_KEY = "mosque-build.parametric-building.v1";
export const buildingPresets = [
  {id:"community-hypostyle", name:"Hypostyle hall", lineageId:"hypostyle-courtyard", roof:"flat", arcade:true},
  {id:"maghrebi-court", name:"Maghrebi courtyard", lineageId:"maghrebi-kairouan-court", roof:"flat", arcade:true},
  {id:"swahili-threshold", name:"Swahili veranda", lineageId:"swahili-coral-lime", roof:"pitched", arcade:true},
  {id:"mughal-garden-court", name:"Mughal court study", lineageId:"indo-islamic-courtyard-screen", roof:"dome", arcade:true},
  {id:"ottoman-central", name:"Ottoman central volume", lineageId:"ottoman-central-dome", roof:"dome", arcade:true},
  {id:"contemporary-local", name:"Contemporary hall", lineageId:"pattern-first-contemporary", roof:"flat", arcade:false},
] as const;
export type BuildingParameters = {
  schema:typeof BUILDING_SCHEMA; presetId:string; widthM:number; depthM:number;
  heightM:number; wallM:number; slabM:number; doorWidthM:number; doorHeightM:number;
  bays:number; domeRiseM:number; roof:"flat"|"pitched"|"dome"; arcade:boolean;
  referenceNotes:string;
};
export type Point2 = [number,number];
export type Point3 = [number,number,number];
export type Extrusion = {kind:"extrusion"; profile:Point2[]; holes:Point2[][]; origin:Point3; axis:"z"|"negative-y"; depth:number};
export type FacetedSolid = {kind:"faceted"; vertices:Point3[]; faces:number[][]};
export type BuildingSolid = Extrusion|FacetedSolid;
export type BuildingElement = {id:string; name:string; ifcClass:"IfcWall"|"IfcSlab"|"IfcRoof"|"IfcColumn"|"IfcBeam"|"IfcOpeningElement"; role:"wall"|"floor"|"roof"|"column"|"arch"|"opening"; solids:BuildingSolid[]; hostId?:string};
export type BuildingModel = {schema:typeof BUILDING_SCHEMA; units:"m"; status:"executable"; parameters:BuildingParameters; elements:BuildingElement[]; grossHallAreaM2:number; internalHallAreaM2:number};
export const defaultBuilding = ():BuildingParameters => ({schema:BUILDING_SCHEMA,presetId:"ottoman-central",widthM:24,depthM:28,heightM:5.4,wallM:.3,slabM:.25,doorWidthM:2.4,doorHeightM:2.8,bays:5,domeRiseM:5,roof:"dome",arcade:true,referenceNotes:""});
export const buildingLimits = {
  widthM:[10,60,.5],depthM:[10,80,.5],heightM:[3.2,12,.1],wallM:[.15,.8,.05],slabM:[.15,.6,.05],
  doorWidthM:[.9,5,.1],doorHeightM:[2,4,.1],bays:[3,9,1],domeRiseM:[1,12,.1],
} as const;
const fieldNames:Record<keyof typeof buildingLimits,string>={widthM:"Hall width",depthM:"Hall depth",heightM:"Wall height",wallM:"Wall thickness",slabM:"Slab / shell thickness",doorWidthM:"Door width",doorHeightM:"Door height",bays:"Bay count",domeRiseM:"Dome rise"};
export function buildingErrors(value:unknown):string[] {
  if(!value || typeof value!=="object") return ["Building settings are missing."];
  const p=value as BuildingParameters, errors:string[]=[];
  if(p.schema!==BUILDING_SCHEMA) errors.push("Unsupported building file version.");
  if(!buildingPresets.some(x=>x.id===p.presetId)) errors.push("Choose a supported template.");
  for(const [key,[min,max]] of Object.entries(buildingLimits)) {
    const n=p[key as keyof typeof buildingLimits];
    if(typeof n!=="number" || !Number.isFinite(n) || n<min || n>max) errors.push(`${fieldNames[key as keyof typeof buildingLimits]}: enter a number between ${min} and ${max}${key==="bays"?"":" m"}.`);
  }
  if(!Number.isInteger(p.bays)) errors.push("Bay count must be a whole number.");
  if(!["flat","pitched","dome"].includes(p.roof)) errors.push("Choose a roof form.");
  if(typeof p.arcade!=="boolean") errors.push("Arcade selection is missing.");
  if(typeof p.referenceNotes!=="string" || p.referenceNotes.length>2000) errors.push("Reference notes must be 2,000 characters or fewer.");
  if(p.doorHeightM>p.heightM-.4) errors.push("Keep at least 0.4 m above the doorway in this study.");
  if(p.doorWidthM>p.widthM-2*p.wallM-1) errors.push("The doorway must fit between the side walls.");
  return errors;
}
export function safeBuilding(value:unknown):BuildingParameters|null {
  if(buildingErrors(value).length) return null;
  // Drop unknown fields from imported project data.
  const p=value as BuildingParameters;
  return Object.fromEntries(Object.keys(defaultBuilding()).map(key=>[key,p[key as keyof BuildingParameters]])) as BuildingParameters;
}
export function applyBuildingPreset(p:BuildingParameters,id:string):BuildingParameters {
  const preset=buildingPresets.find(x=>x.id===id);
  if(!preset) return p;
  return {...p,presetId:id,roof:preset.roof,arcade:preset.arcade};
}
const rect=(w:number,d:number):Point2[]=>[[0,0],[w,0],[w,d],[0,d]];
const extrusion=(profile:Point2[],depth:number,origin:Point3,axis:Extrusion["axis"]="z",holes:Point2[][]=[]):Extrusion=>({kind:"extrusion",profile,holes,origin,axis,depth});
const box=(x:number,y:number,z:number,w:number,d:number,h:number)=>extrusion(rect(w,d),h,[x,y,z]);
const circle=(r:number,cx=0,cy=0):Point2[]=>Array.from({length:48},(_,i)=>[cx+r*Math.cos(i*Math.PI/24),cy+r*Math.sin(i*Math.PI/24)]);

/** Closed shell with shared vertices, outward winding and a sealed springing annulus. */
export function domeShell(radius:number,rise:number,thickness:number,origin:Point3):FacetedSolid {
  const segments=48,rings=12,vertices:Point3[]=[],faces:number[][]=[];
  for(let side=0;side<2;side++) {
    const r=radius-side*thickness,h=rise-side*thickness,start=vertices.length;
    for(let ring=0;ring<rings;ring++) {
      const phi=ring/rings*Math.PI/2;
      for(let j=0;j<segments;j++) vertices.push([origin[0]+r*Math.cos(phi)*Math.cos(j*2*Math.PI/segments),origin[1]+r*Math.cos(phi)*Math.sin(j*2*Math.PI/segments),origin[2]+h*Math.sin(phi)]);
    }
    const apex=vertices.length;vertices.push([origin[0],origin[1],origin[2]+h]);
    const add=(face:number[])=>faces.push(side?face.toReversed():face);
    for(let i=0;i<rings-1;i++) for(let j=0;j<segments;j++) {
      const a=start+i*segments+j,b=start+i*segments+(j+1)%segments,c=b+segments,d=a+segments;
      add([a,b,c]);add([a,c,d]);
    }
    for(let j=0;j<segments;j++) add([start+(rings-1)*segments+j,start+(rings-1)*segments+(j+1)%segments,apex]);
  }
  const inner=rings*segments+1;
  for(let j=0;j<segments;j++) {const next=(j+1)%segments;faces.push([j,inner+j,inner+next],[j,inner+next,next]);}
  return {kind:"faceted",vertices,faces};
}

export function createBuilding(p:BuildingParameters):BuildingModel {
  const errors=buildingErrors(p);if(errors.length) throw new Error(errors.join(" "));
  const {widthM:w,depthM:d,heightM:h,wallM:t,slabM:s,doorWidthM:dw,doorHeightM:dh}=p,elements:BuildingElement[]=[];
  const add=(id:string,name:string,ifcClass:BuildingElement["ifcClass"],role:BuildingElement["role"],solids:BuildingSolid[],hostId?:string)=>elements.push({id,name,ifcClass,role,solids,...(hostId?{hostId}:{})});
  add("floor","Hall floor slab","IfcSlab","floor",[box(0,0,-s,w,d,s)]);
  add("wall-qibla","Prayer-focus wall (orientation to be set on site)","IfcWall","wall",[box(0,0,0,w,t,h)]);
  const jamb=(w-dw)/2;
  add("wall-entry","Entrance wall","IfcWall","wall",[box(0,d-t,0,jamb,t,h),box(jamb+dw,d-t,0,jamb,t,h),box(jamb,d-t,dh,dw,t,h-dh)]);
  add("opening-entry","Main doorway clear opening","IfcOpeningElement","opening",[box(jamb,d-t,0,dw,t,dh)],"wall-entry");
  // Side windows are real omissions from the wall solids, with traceable opening hosts.
  const sill=1.2,winH=Math.min(1.6,h-2),span=d-2*t,spacing=span/p.bays,winW=Math.min(1.4,spacing*.6);
  for(const side of ["west","east"] as const) {
    const x=side==="west"?0:w-t,solids:BuildingSolid[]=[];
    solids.push(box(x,t,0,t,span,sill),box(x,t,sill+winH,t,span,h-sill-winH));
    let cursor=t;
    for(let i=0;i<p.bays;i++) {
      const y=t+spacing*(i+.5)-winW/2;
      solids.push(box(x,cursor,sill,t,y-cursor,winH));cursor=y+winW;
      add(`window-${side}-${i}`,`${side} window ${i+1} clear opening`,"IfcOpeningElement","opening",[box(x,y,sill,t,winW,winH)],`wall-${side}`);
    }
    solids.push(box(x,cursor,sill,t,d-t-cursor,winH));
    add(`wall-${side}`,`${side} window wall`,"IfcWall","wall",solids);
  }
  if(p.roof==="dome") {
    const r=Math.min(w,d)*.32;
    add("roof-deck","Roof deck around dome opening","IfcSlab","roof",[extrusion(rect(w,d),s,[0,0,h],"z",[circle(r-s,w/2,d/2).toReversed()])]);
    add("roof-dome","Faceted dome shell","IfcRoof","roof",[domeShell(r,p.domeRiseM,s,[w/2,d/2,h+s])]);
  } else if(p.roof==="pitched") {
    const rise=Math.min(w*.2,4);
    for(const [id,y] of [["qibla",t],["entry",d]] as const) add(`gable-${id}`,`${id} gable infill`,"IfcWall","wall",[extrusion([[0,0],[w,0],[w/2,rise]],t,[0,y,h],"negative-y")]);
    for(const side of [0,1]) {
      const pts:Point2[]=side===0?[[0,0],[w/2,rise],[w/2,rise+s],[0,s]]:[[w/2,rise],[w,0],[w,s],[w/2,rise+s]];
      add(`roof-slope-${side}`,`${side===0?"West":"East"} pitched roof`,"IfcRoof","roof",[extrusion(pts,d,[0,d,h],"negative-y")]);
    }
  } else add("roof-flat","Flat roof deck","IfcSlab","roof",[box(0,0,h,w,d,s)]);
  if(["community-hypostyle","maghrebi-court"].includes(p.presetId)) {
    for(let row=1;row<=2;row++) for(let col=1;col<p.bays;col++) add(`hall-column-${row}-${col}`,`Hall column ${row}.${col}`,"IfcColumn","column",[extrusion(circle(.22),h,[w*col/p.bays,d*row/3,0])]);
  }
  if(p.arcade) {
    const front=d+3.5,bay=(w-.6)/p.bays,colR=.2,spring=2.3;
    add("portico-floor","Covered arrival floor","IfcSlab","floor",[box(0,d,-s,w,3.8,s)]);
    add("portico-roof","Covered arrival roof","IfcSlab","roof",[box(0,d,h,w,3.8,s)]);
    for(let i=0;i<=p.bays;i++) add(`portico-column-${i}`,`Portico column ${i+1}`,"IfcColumn","column",[extrusion(circle(colR),spring,[.3+i*bay,front,0])]);
    for(let i=0;i<p.bays;i++) {
      const radius=bay/2-.2,archRise=Math.min(radius,.65),outer:Point2[]=[],inner:Point2[]=[];
      for(let j=0;j<=24;j++) {const a=j/24*Math.PI;outer.push([(radius+.2)*Math.cos(a),(archRise+.2)*Math.sin(a)]);inner.push([radius*Math.cos(a),archRise*Math.sin(a)]);}
      add(`portico-arch-${i}`,`Portico arch ${i+1}`,"IfcBeam","arch",[extrusion([...outer,...inner.toReversed()],.4,[.3+(i+.5)*bay,front+.2,spring],"negative-y")]);
      // Spandrel carries the arcade to the roof datum without claiming a structural system.
      const top=h-spring,profile:Point2[]=[[-radius-.2,top],...outer.toReversed(),[radius+.2,top]];
      // Remove duplicate endpoints before export (zero-length IFC edges are invalid).
      const clean=profile.filter((pt,index)=>!index||Math.hypot(pt[0]-profile[index-1][0],pt[1]-profile[index-1][1])>1e-8);
      add(`portico-spandrel-${i}`,`Portico spandrel ${i+1}`,"IfcWall","wall",[extrusion(clean,.3,[.3+(i+.5)*bay,front+.15,spring],"negative-y")]);
    }
  }
  if(["maghrebi-court","mughal-garden-court"].includes(p.presetId)) add("court","Open courtyard study","IfcSlab","floor",[box(0,d+3.8,-s,w,8,s)]);
  return {schema:BUILDING_SCHEMA,units:"m",status:"executable",parameters:{...p},elements,grossHallAreaM2:w*d,internalHallAreaM2:(w-2*t)*(d-2*t)};
}

/** Seed an empty room workspace; never silently replace a developed floor plan. */
export function buildingToFloorPlan(p:BuildingParameters,existing:FloorPlanState):FloorPlanState {
  const model=createBuilding(p);
  if(existing.spaces.length||existing.openings.length||existing.annotations.length||existing.levels.length!==1) throw new Error("Your floor plan already contains work. Export this building study and coordinate its dimensions with the existing plan.");
  const levelId=existing.levels[0].id,t=p.wallM,spaces:PlanSpace[]=[];
  const add=(id:string,name:string,kind:PlanSpace["kind"],xM:number,yM:number,widthM:number,depthM:number)=>spaces.push({id,levelId,name,kind,xM,yM,widthM,depthM,clearHeightM:p.heightM,capacityInput:0,accessibleJourney:false,privacy:"transition",adjacentTo:[],separateFrom:[],finishRef:"",notes:"From dimensioned building study. Coordinate program, qibla, accessibility, structure and services."});
  add("building-prayer","Prayer hall","prayer",t,t,p.widthM-2*t,p.depthM-2*t);
  if(p.arcade)add("building-arrival","Covered arrival","circulation",0,p.depthM,p.widthM,3.8);
  const court=["maghrebi-court","mughal-garden-court"].includes(p.presetId);
  if(court)add("building-court","Open courtyard","courtyard",0,p.depthM+3.8,p.widthM,8);
  const openings=model.elements.filter(e=>e.role==="opening").map(e=>{
    const solid=e.solids[0] as Extrusion,entry=e.id==="opening-entry",west=e.hostId==="wall-west";
    return {id:e.id,spaceId:"building-prayer",levelId,kind:entry?"door" as const:"window" as const,label:e.name,hostEdge:entry?"south" as const:west?"west" as const:"east" as const,offsetM:entry?p.widthM/2-t:solid.origin[1]+solid.profile[2][1]/2-t,widthM:entry?p.doorWidthM:solid.profile[2][1],heightM:solid.depth,operation:"Unspecified",fireEvidenceRef:"",accessEvidenceRef:"",notes:entry?"Door assembly and operation require design.":"Window sill 1.2 m in building study; floor-plan opening schema does not yet carry sill elevation."};
  });
  return {...existing,footprint:{widthM:p.widthM,depthM:p.depthM+(court?11.8:p.arcade?3.8:0)},levels:[{...existing.levels[0],elevationM:0,floorToFloorM:p.heightM+p.slabM,status:"working"}],activeLevelId:levelId,spaces,openings,updatedAt:new Date().toISOString()};
}
