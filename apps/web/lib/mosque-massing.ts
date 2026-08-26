export type MosqueScenarioId="compact"|"courtyard"|"community";

export type MosqueMassing={
  id:MosqueScenarioId;
  title:string;
  description:string;
  width:number;
  depth:number;
  defaultFloors:number;
  capacityBand:string;
  phaseComplexity:string;
};

export const mosqueMassing:MosqueMassing[]=[
  {id:"compact",title:"Compact urban mosque",description:"A focused prayer hall and essential support spaces for a constrained site.",width:68,depth:78,defaultFloors:2,capacityBand:"Lower",phaseComplexity:"Simple"},
  {id:"courtyard",title:"Courtyard mosque",description:"Prayer, learning and community rooms organized around a shaded shared court.",width:88,depth:82,defaultFloors:1,capacityBand:"Medium",phaseComplexity:"Flexible"},
  {id:"community",title:"Community campus",description:"A broader phased program with worship, learning and community-use wings.",width:108,depth:90,defaultFloors:2,capacityBand:"Higher",phaseComplexity:"Complex"},
];

export function getMosqueMassing(id:string){return mosqueMassing.find(item=>item.id===id)||mosqueMassing[2]}
export function normalizeQibla(value:number){return ((Math.round(value)%360)+360)%360}
export function floorAreaIndex(scenario:MosqueMassing,floors:number,courtyard:boolean){return Math.round(scenario.width*scenario.depth*Math.max(1,Math.min(3,floors))*(courtyard?.78:1))}
