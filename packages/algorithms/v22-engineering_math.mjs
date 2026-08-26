export function polygonArea(points) {
  if (!Array.isArray(points) || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}
export function distance(a,b){ return Math.hypot(b.x-a.x,b.y-a.y); }
export function wallQuantities(p1,p2,height,thickness,openingArea=0){
  const length=distance(p1,p2);
  const grossArea=length*height;
  const netArea=Math.max(0,grossArea-openingArea);
  return {length,grossArea,netArea,volume:netArea*thickness};
}
export function carpetQuantity(area,wastePct=5){
  if(area<0||wastePct<0) throw new Error("invalid quantity input");
  return area*(1+wastePct/100);
}
export function orderByDate(requiredOnSite, leadDays, bufferDays=0){
  const d=new Date(requiredOnSite+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()-leadDays-bufferDays);
  return d.toISOString().slice(0,10);
}
