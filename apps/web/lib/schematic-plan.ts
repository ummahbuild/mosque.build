export type SchematicScenarioId="compact"|"courtyard"|"community";
export type VerificationState="user_estimate"|"measured_unverified"|"professionally_verified";

export type SchematicInputs={
  scenario:SchematicScenarioId;
  widthM:number;
  depthM:number;
  wallM:number;
  qiblaDeg:number;
  verification:VerificationState;
};

export type SchematicRoom={id:string;name:string;x:number;y:number;width:number;depth:number;kind:"prayer"|"support"|"learning"|"circulation"|"courtyard"};
export type SchematicPlan={schemaVersion:"mosque.build/schematic-plan@1";units:"m";status:"executable";inputs:SchematicInputs;rooms:SchematicRoom[];grossAreaM2:number;usableAreaM2:number;reviewGate:string};

const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));
export const normalizeDimension=(value:number,min:number,max:number)=>Math.round(clamp(Number.isFinite(value)?value:min,min,max)*10)/10;

export function createSchematicPlan(raw:SchematicInputs):SchematicPlan{
  const widthM=normalizeDimension(raw.widthM,8,80),depthM=normalizeDimension(raw.depthM,10,100),wallM=normalizeDimension(raw.wallM,.1,.6);
  const inputs={...raw,widthM,depthM,wallM,qiblaDeg:((Math.round(raw.qiblaDeg)%360)+360)%360};
  const innerW=Math.max(1,widthM-wallM*2),innerD=Math.max(1,depthM-wallM*2);
  let rooms:SchematicRoom[];
  if(raw.scenario==="compact"){
    const supportD=innerD*.22;
    rooms=[
      {id:"prayer-hall",name:"Prayer hall",x:wallM,y:wallM,width:innerW,depth:innerD-supportD,kind:"prayer"},
      {id:"entrance",name:"Entrance + shoes",x:wallM,y:wallM+innerD-supportD,width:innerW*.42,depth:supportD,kind:"circulation"},
      {id:"ablution",name:"Ablution",x:wallM+innerW*.42,y:wallM+innerD-supportD,width:innerW*.32,depth:supportD,kind:"support"},
      {id:"services",name:"Services",x:wallM+innerW*.74,y:wallM+innerD-supportD,width:innerW*.26,depth:supportD,kind:"support"}
    ];
  }else if(raw.scenario==="courtyard"){
    const sideW=innerW*.22,courtD=innerD*.28;
    rooms=[
      {id:"prayer-hall",name:"Prayer hall",x:wallM+sideW,y:wallM,width:innerW-sideW*2,depth:innerD-courtD,kind:"prayer"},
      {id:"learning",name:"Learning",x:wallM,y:wallM,width:sideW,depth:innerD-courtD,kind:"learning"},
      {id:"ablution",name:"Ablution + services",x:wallM+innerW-sideW,y:wallM,width:sideW,depth:innerD-courtD,kind:"support"},
      {id:"courtyard",name:"Courtyard",x:wallM,y:wallM+innerD-courtD,width:innerW,depth:courtD,kind:"courtyard"}
    ];
  }else{
    const sideW=innerW*.24,frontD=innerD*.2;
    rooms=[
      {id:"prayer-hall",name:"Prayer hall",x:wallM+sideW,y:wallM,width:innerW-sideW*2,depth:innerD-frontD,kind:"prayer"},
      {id:"learning",name:"Learning rooms",x:wallM,y:wallM,width:sideW,depth:innerD-frontD,kind:"learning"},
      {id:"community",name:"Community rooms",x:wallM+innerW-sideW,y:wallM,width:sideW,depth:innerD-frontD,kind:"support"},
      {id:"entrance",name:"Entrance + shoes",x:wallM,y:wallM+innerD-frontD,width:innerW*.48,depth:frontD,kind:"circulation"},
      {id:"ablution",name:"Ablution + services",x:wallM+innerW*.48,y:wallM+innerD-frontD,width:innerW*.52,depth:frontD,kind:"support"}
    ];
  }
  const usableAreaM2=Math.round(rooms.reduce((sum,room)=>sum+room.width*room.depth,0)*10)/10;
  return {schemaVersion:"mosque.build/schematic-plan@1",units:"m",status:"executable",inputs,rooms,grossAreaM2:Math.round(widthM*depthM*10)/10,usableAreaM2,reviewGate:"Conceptual only. Verify site, dimensions, qibla, accessibility, structure, fire and services with qualified professionals."};
}
