
const TAU=Math.PI*2;
const EPS=1e-9;
export const round6=v=>Number(Number(v).toFixed(6));

export function polygonAreaSigned(poly){
  let s=0;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];
    s+=a.x*b.y-b.x*a.y;
  }
  return s/2;
}
export function polygonArea(poly){ return Math.abs(polygonAreaSigned(poly)); }
export function ensureCCW(poly){ return polygonAreaSigned(poly)<0?[...poly].reverse():[...poly]; }
export function pointInPolygon(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const a=poly[i],b=poly[j];
    const hit=((a.y>p.y)!=(b.y>p.y))&&(p.x<(b.x-a.x)*(p.y-a.y)/((b.y-a.y)||EPS)+a.x);
    if(hit) inside=!inside;
  }
  return inside;
}
function orient(a,b,c){ return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x); }
export function segmentsIntersect(a,b,c,d){
  const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b);
  if(Math.abs(o1)<EPS&&Math.abs(o2)<EPS&&Math.abs(o3)<EPS&&Math.abs(o4)<EPS) return false;
  return (o1*o2<0)&&(o3*o4<0);
}
export function polygonIntersectsPolygon(a,b){
  for(let i=0;i<a.length;i++) for(let j=0;j<b.length;j++)
    if(segmentsIntersect(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length])) return true;
  return pointInPolygon(a[0],b)||pointInPolygon(b[0],a);
}

export function keyPoint(p,tol=0.01){ return `${Math.round(p.x/tol)}:${Math.round(p.y/tol)}`; }
export function parseKey(k,tol=0.01){ const [x,y]=k.split(":").map(Number); return {x:x*tol,y:y*tol}; }

export function buildGraph(walls,tol=0.01){
  const g=new Map();
  for(const w of walls){
    const ka=keyPoint(w.a,tol), kb=keyPoint(w.b,tol);
    if(!g.has(ka)) g.set(ka,[]);
    if(!g.has(kb)) g.set(kb,[]);
    g.get(ka).push({to:kb,wallId:w.id});
    g.get(kb).push({to:ka,wallId:w.id});
  }
  return g;
}

function angleBetween(from,to,tol){
  const a=parseKey(from,tol),b=parseKey(to,tol);
  let ang=Math.atan2(b.y-a.y,b.x-a.x);
  if(ang<0) ang+=TAU;
  return ang;
}
function canonicalCycle(keys){
  const a=keys.slice(0,-1);
  const rots=[];
  for(let i=0;i<a.length;i++) rots.push([...a.slice(i),...a.slice(0,i)]);
  const rev=[...a].reverse();
  for(let i=0;i<rev.length;i++) rots.push([...rev.slice(i),...rev.slice(0,i)]);
  rots.sort((x,y)=>x.join("|").localeCompare(y.join("|")));
  return rots[0].join("|");
}
export function extractClosedCycles(walls,tol=0.01){
  const g=buildGraph(walls,tol);
  const cycles=new Map();
  const maxDepth=Math.max(8,walls.length+2);
  function dfs(start,current,path,usedEdges){
    if(path.length>maxDepth) return;
    for(const e of g.get(current)||[]){
      const edgeKey=[current,e.to].sort().join("~");
      if(usedEdges.has(edgeKey)) continue;
      if(e.to===start && path.length>=3){
        const cyc=[...path,start];
        const poly=cyc.map(k=>parseKey(k,tol));
        if(polygonArea(poly)>tol*tol){
          cycles.set(canonicalCycle(cyc),ensureCCW(poly.slice(0,-1)));
        }
        continue;
      }
      if(path.includes(e.to)) continue;
      const next=new Set(usedEdges); next.add(edgeKey);
      dfs(start,e.to,[...path,e.to],next);
    }
  }
  for(const start of g.keys()) dfs(start,start,[start],new Set());
  return [...cycles.values()];
}
export function smallestRoomCycles(walls,tol=0.01){
  const cycles=extractClosedCycles(walls,tol);
  // discard cycles that strictly contain another cycle with smaller positive area
  return cycles.filter((c,i)=>{
    const ac=polygonArea(c);
    return !cycles.some((d,j)=>j!==i && polygonArea(d)<ac-EPS && d.every(p=>pointInPolygon(p,c)));
  });
}

export function rectanglePolygon(cx,cy,w,h,rotationDeg=0){
  const a=rotationDeg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
  const pts=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];
  return pts.map(([x,y])=>({x:cx+x*c-y*s,y:cy+x*s+y*c}));
}
export function doorSwingPolygon(hinge,radius,startDeg,endDeg,segments=12){
  const pts=[hinge];
  for(let i=0;i<=segments;i++){
    const t=startDeg+(endDeg-startDeg)*i/segments;
    const a=t*Math.PI/180;
    pts.push({x:hinge.x+Math.cos(a)*radius,y:hinge.y+Math.sin(a)*radius});
  }
  return pts;
}

export function saffLayoutV2(room,{
  qiblaDeg=0,rowSpacing=1.15,personWidth=0.65,
  obstaclePolygons=[],reservedPolygons=[]
}={}){
  const ang=qiblaDeg*Math.PI/180, ux={x:Math.cos(ang),y:Math.sin(ang)}, vy={x:-Math.sin(ang),y:Math.cos(ang)};
  const rv=room.map(p=>({u:p.x*ux.x+p.y*ux.y,v:p.x*vy.x+p.y*vy.y}));
  const minU=Math.min(...rv.map(p=>p.u)), maxU=Math.max(...rv.map(p=>p.u));
  const minV=Math.min(...rv.map(p=>p.v)), maxV=Math.max(...rv.map(p=>p.v));
  const rows=[]; let theoretical=0,usable=0,blocked=0;
  for(let v=minV+rowSpacing/2;v<=maxV-rowSpacing/2+EPS;v+=rowSpacing){
    const positions=[];
    for(let u=minU+personWidth/2;u<=maxU-personWidth/2+EPS;u+=personWidth){
      const p={x:u*ux.x+v*vy.x,y:u*ux.y+v*vy.y};
      if(!pointInPolygon(p,room)) continue;
      theoretical++;
      const isBlocked=[...obstaclePolygons,...reservedPolygons].some(poly=>pointInPolygon(p,poly));
      if(isBlocked) blocked++; else usable++;
      positions.push({...p,blocked:isBlocked});
    }
    if(positions.length) rows.push({v:round6(v),positions});
  }
  const continuity=rows.length? rows.reduce((acc,r)=>acc+(r.positions.filter(p=>!p.blocked).length/(r.positions.length||1)),0)/rows.length:0;
  return {rows,rowCount:rows.length,theoretical,usable,blocked,rowContinuity:round6(continuity)};
}

export function runTakeoff(objects,rules){
  const lines=[];
  for(const obj of objects){
    for(const rule of rules){
      if(rule.object_kind!==obj.kind) continue;
      let q=0;
      if(rule.formula==="count") q=1;
      else if(rule.formula==="floor_area") q=obj.area??(obj.polygon?polygonArea(obj.polygon):0);
      else if(rule.formula==="gross_wall_area") q=(obj.length||0)*(obj.height||0);
      else if(rule.formula==="net_wall_area") q=(obj.length||0)*(obj.height||0)-(obj.openingArea||0);
      else if(rule.formula==="linear_length") q=obj.width??obj.length??0;
      else if(rule.formula==="roof_surface_area") q=obj.area||0;
      const total=round6(q*(1+(rule.waste_default_pct||0)/100));
      lines.push({objectId:obj.id,ruleKey:rule.key,quantity:total,unit:rule.unit});
    }
  }
  return lines;
}
export function explodeAssemblies(takeoffLines,assemblyMap){
  const out=[];
  for(const line of takeoffLines){
    for(const a of assemblyMap.filter(a=>a.takeoff_rule===line.ruleKey)){
      for(const component of a.cost_inputs) out.push({assemblyKey:a.key,objectId:line.objectId,component,quantity:line.quantity,unit:line.unit});
    }
  }
  return out;
}
export function costRollup(lines,rateBook){
  let priced=0,total=0,unknown=0;
  const details=lines.map(l=>{
    const rate=rateBook[l.component??l.ruleKey];
    if(typeof rate!=="number"){ unknown++; return {...l,rate:null,cost:null}; }
    const cost=round6(l.quantity*rate); priced++; total+=cost; return {...l,rate,cost};
  });
  return {total:round6(total),priced,unknown,details};
}
export function maturityScore({geometryVerified=0,quantityConfidence=0,pricedShare=0,quoteShare=0}){
  return round6(geometryVerified*.25+quantityConfidence*.25+pricedShare*.25+quoteShare*.25);
}
