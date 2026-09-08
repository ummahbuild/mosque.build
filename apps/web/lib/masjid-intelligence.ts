export type MasjidBriefInputs={daily:number;jummah:number;ramadan:number;growth:number;siteArea:number;priority:"worship"|"community"|"phasing";climate:"unknown"|"hot_humid"|"hot_dry"|"cold"|"temperate"};
export type StrategyIndicator={id:string;label:string;value:number;explanation:string};
export type MasjidStrategy={id:"worship"|"community"|"phased";title:string;summary:string;indicators:StrategyIndicator[];prompts:string[]};
export type MasjidIntelligence={status:"executable";peakInput:number;planningHorizon:number;strategies:MasjidStrategy[];reviewGate:string};

const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));
const indicator=(id:string,label:string,value:number,explanation:string):StrategyIndicator=>({id,label,value:clamp(value),explanation});

export function createMasjidIntelligence(raw:MasjidBriefInputs):MasjidIntelligence{
  const peak=Math.max(1,raw.daily,raw.jummah,raw.ramadan);
  const horizon=Math.round(peak*Math.pow(1+Math.max(0,Math.min(raw.growth,15))/100,10));
  const sitePressure=Math.min(45,(peak/Math.max(100,raw.siteArea))*28);
  const climateKnown=raw.climate==="unknown"?48:78;
  const priorityBonus=(id:MasjidStrategy["id"])=>raw.priority===id||(raw.priority==="phasing"&&id==="phased")?10:0;
  const shared=(id:MasjidStrategy["id"],base:number)=>[
    indicator("worship","Worship readiness",base+(id==="worship"?18:id==="phased"?8:2)+priorityBonus(id)-sitePressure*.25,`${peak.toLocaleString()} people is the largest attendance input; confirm prayer-row geometry, accessibility positions and overflow assumptions.`),
    indicator("community","Community support",base+(id==="community"?20:id==="phased"?10:-8)+priorityBonus(id),id==="community"?"A broader room mix protects learning, family and community uses.":"A narrower initial program needs an explicit plan for community uses."),
    indicator("adaptability","Growth adaptability",base+(id==="phased"?23:raw.growth>3?3:8)+priorityBonus(id),`A ten-year arithmetic projection reaches about ${horizon.toLocaleString()} people at the entered growth rate; this is a planning prompt, not a demand forecast.`),
    indicator("site","Site fit",base+18-sitePressure+(id==="community"?-8:id==="worship"?5:1),`The entered ${raw.siteArea.toLocaleString()} m² site is compared only as a pressure signal; setbacks, access, parking and regulations are not assessed.`),
    indicator("climate","Climate response",climateKnown+(id==="community"?4:0),raw.climate==="unknown"?"Climate is not selected, so passive-design confidence remains limited.":"The selected climate can guide later questions, but weather, orientation and local construction evidence are still required."),
    indicator("simplicity","Delivery simplicity",base+(id==="worship"?20:id==="phased"?8:-10),id==="worship"?"A concentrated initial program may reduce coordination interfaces.":"More program or phases require stronger responsibility, interface and handover planning.")
  ];
  return {status:"executable",peakInput:peak,planningHorizon:horizon,strategies:[
    {id:"worship",title:"Worship first",summary:"Protect prayer capacity and a legible, simpler initial building.",indicators:shared("worship",61),prompts:["Test dignified access and accommodation for all worshippers.","Reserve a credible location for future community rooms."]},
    {id:"community",title:"Community masjid",summary:"Balance worship with learning, family and social-support spaces.",indicators:shared("community",64),prompts:["Map noisy, private and after-hours uses before fixing adjacencies.","Confirm who will operate each additional space."]},
    {id:"phased",title:"Expandable masjid",summary:"Organize a useful first phase around a documented path for growth.",indicators:shared("phased",66),prompts:["Keep phase-one circulation and services complete in their own right.","Protect expansion zones from temporary uses that become permanent."]}
  ],reviewGate:"Indicators explain user-entered trade-offs only. They are not religious rulings, demand forecasts, code checks, cost estimates, engineering calculations or professional design approval."};
}
