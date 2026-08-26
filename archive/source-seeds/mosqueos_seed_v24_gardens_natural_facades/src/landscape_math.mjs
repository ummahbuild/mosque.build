export function canopyArea(diameterM){ if(diameterM<0) throw new Error("invalid"); return Math.PI*Math.pow(diameterM/2,2); }
export function irrigationDemand(areaM2, litersPerM2Day, efficiency=1){ if(efficiency<=0||efficiency>1) throw new Error("invalid efficiency"); return areaM2*litersPerM2Day/efficiency; }
export function storageAutonomyDays(storageLiters,demandLitersDay){ return demandLitersDay>0?storageLiters/demandLitersDay:Infinity; }
export function rainCaptureLiters(roofAreaM2,rainMm,runoffCoeff=0.8){ return roofAreaM2*rainMm*runoffCoeff; }
export function shadeCoverage(siteAreaM2, canopyAreas){ const raw=canopyAreas.reduce((a,b)=>a+b,0); return siteAreaM2>0?Math.min(100,raw/siteAreaM2*100):0; }
export function greenFacadeWater(days,areaM2,lpm2day){ return days*areaM2*lpm2day; }
export function landscapeOrderByDate(plantingDate, nurseryLeadDays, bufferDays=7){
 const d=new Date(plantingDate+"T00:00:00Z"); d.setUTCDate(d.getUTCDate()-nurseryLeadDays-bufferDays); return d.toISOString().slice(0,10);
}
