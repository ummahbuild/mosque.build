export function area(poly){
  if(!Array.isArray(poly)||poly.length<3) return 0;
  let s=0;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];s+=a.x*b.y-b.x*a.y;}
  return Math.abs(s)/2;
}
export function bbox(poly){
  const xs=poly.map(p=>p.x), ys=poly.map(p=>p.y);
  return {minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};
}
export function pointInPolygon(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const cross=((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/((b.y-a.y)||1e-12)+a.x);
    if(cross) inside=!inside;
  }
  return inside;
}
export function saffLayout(room,{qiblaDeg=0,rowSpacing=1.15,personWidth=0.65,obstacles=[]}={}){
  const box=bbox(room), rows=[], angle=qiblaDeg*Math.PI/180;
  const ux={x:Math.cos(angle),y:Math.sin(angle)}, vy={x:-Math.sin(angle),y:Math.cos(angle)};
  const corners=room.map(p=>({u:p.x*ux.x+p.y*ux.y,v:p.x*vy.x+p.y*vy.y}));
  const minV=Math.min(...corners.map(c=>c.v)), maxV=Math.max(...corners.map(c=>c.v));
  const minU=Math.min(...corners.map(c=>c.u)), maxU=Math.max(...corners.map(c=>c.u));
  let theoretical=0, usable=0;
  for(let v=minV+rowSpacing/2;v<=maxV-rowSpacing/2+1e-9;v+=rowSpacing){
    const positions=[];
    for(let u=minU+personWidth/2;u<=maxU-personWidth/2+1e-9;u+=personWidth){
      const p={x:u*ux.x+v*vy.x,y:u*ux.y+v*vy.y};
      if(pointInPolygon(p,room)){
        theoretical++;
        const blocked=obstacles.some(o=>Math.hypot(p.x-o.x,p.y-o.y)<(o.radius||0.4));
        positions.push({...p,blocked});
        if(!blocked) usable++;
      }
    }
    if(positions.length) rows.push({v,positions});
  }
  return {rows,theoretical,usable,rowCount:rows.length};
}
export function takeoffLine(rule,object){
  switch(rule.formula){
    case "count": return 1;
    case "floor_area": return object.area ?? area(object.polygon||[]);
    case "gross_wall_area": return object.length*object.height;
    case "net_wall_area": return object.length*object.height-(object.openingArea||0);
    case "linear_length": return object.width ?? object.length ?? 0;
    case "roof_surface_area": return object.area ?? 0;
    default: throw new Error("unknown formula");
  }
}
export function withWaste(q,pct=0){ return q*(1+pct/100); }
export function scoreAlternative(candidate,weights){
  const failed=(candidate.failedGates||[]);
  if(failed.length) return {eligible:false,score:0,failedGates:failed,confidence:candidate.confidence??0};
  let total=0, denom=0;
  for(const [k,w] of Object.entries(weights)){
    const v=candidate[k];
    if(typeof v==="number"){ total+=v*w; denom+=w; }
  }
  return {eligible:true,score:denom?total/denom:0,failedGates:[],confidence:candidate.confidence??50};
}
