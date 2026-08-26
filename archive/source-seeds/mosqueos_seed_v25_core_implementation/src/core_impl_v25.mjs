
const EPS=1e-9;
export function snapPoint(p, grid=0.01){
  const digits=Math.max(0,Math.ceil(-Math.log10(grid))+2);
  const round=v=>Number((Math.round(v/grid)*grid).toFixed(digits));
  return {x:round(p.x),y:round(p.y)};
}
export function keyPoint(p,tol=0.01){
  return `${Math.round(p.x/tol)}:${Math.round(p.y/tol)}`;
}
export function buildAdjacency(walls,tol=0.01){
  const graph=new Map();
  for(const w of walls){
    const a=keyPoint(w.a,tol),b=keyPoint(w.b,tol);
    if(!graph.has(a)) graph.set(a,[]);
    if(!graph.has(b)) graph.set(b,[]);
    graph.get(a).push({to:b,wallId:w.id,point:w.b});
    graph.get(b).push({to:a,wallId:w.id,point:w.a});
  }
  return graph;
}
export function danglingEndpoints(walls,tol=0.01){
  const g=buildAdjacency(walls,tol); const out=[];
  for(const [k,edges] of g) if(edges.length===1) out.push(k);
  return out;
}
export function roomArea(poly){
  let s=0; for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];s+=a.x*b.y-b.x*a.y;}
  return Math.abs(s)/2;
}
export function runTakeoff(objects,rules){
  const lines=[];
  for(const obj of objects){
    for(const rule of rules){
      if(rule.object_kind!==obj.kind) continue;
      let q=0;
      if(rule.formula==="count") q=1;
      else if(rule.formula==="floor_area") q=obj.area??(obj.polygon?roomArea(obj.polygon):0);
      else if(rule.formula==="gross_wall_area") q=(obj.length||0)*(obj.height||0);
      else if(rule.formula==="net_wall_area") q=(obj.length||0)*(obj.height||0)-(obj.openingArea||0);
      else if(rule.formula==="linear_length") q=obj.width??obj.length??0;
      else if(rule.formula==="roof_surface_area") q=obj.area||0;
      const total=Number((q*(1+(rule.waste_default_pct||0)/100)).toFixed(6));
      lines.push({objectId:obj.id,ruleKey:rule.key,quantity:total,unit:rule.unit});
    }
  }
  return lines;
}
export function costRollup(takeoffLines, unitRates){
  let total=0; const details=[];
  for(const l of takeoffLines){
    const rate=unitRates[l.ruleKey];
    if(typeof rate!=="number"){details.push({...l,cost:null});continue;}
    const cost=l.quantity*rate; total+=cost; details.push({...l,cost});
  }
  return {total,details};
}
export function localityTier(site,candidate){
  if(candidate.city===site.city) return "same_city";
  if(candidate.country===site.country) return "same_country";
  if(candidate.region===site.region) return "same_region";
  return "international";
}
