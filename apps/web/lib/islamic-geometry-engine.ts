export const GEOMETRY_SCHEMA = "mosque.build/islamic-geometry@1" as const;
export const GEOMETRY_STORAGE_KEY = "mosque-build.islamic-geometry.v1";

export const geometryFamilies = ["star-rosette", "overlapping-squares", "hex-lattice", "star-cross", "girih-study"] as const;
export const symmetryGroups = ["radial", "p4m", "p6m", "frieze"] as const;
export const geometryOrders = [6, 8, 10, 12, 16, 24] as const;
export type GeometryFamily = typeof geometryFamilies[number];
export type SymmetryGroup = typeof symmetryGroups[number];
export type GeometryPoint = [number, number];
export type GeometryRole = "primary" | "secondary" | "over" | "under" | "repeat";
export type GeometrySegment = { id: string; from: GeometryPoint; to: GeometryPoint; role: GeometryRole };
export type GeometryCrossing = { point: GeometryPoint; segmentA: string; segmentB: string; over: string };

export type GeometryParameters = {
  family: GeometryFamily;
  symmetry: SymmetryGroup;
  order: typeof geometryOrders[number];
  rings: number;
  innerRatio: number;
  repeatX: number;
  repeatY: number;
  strapWidthM: number;
  panelWidthM: number;
  panelHeightM: number;
  interlace: boolean;
  clip: "rectangle" | "circle";
};

export type GeometryValidation = { level: "error" | "warning" | "note"; code: string; message: string };
export type GeometryResult = {
  schema: typeof GEOMETRY_SCHEMA;
  status: "executable";
  parameters: GeometryParameters;
  segments: GeometrySegment[];
  crossings: GeometryCrossing[];
  repeatCell: { widthM: number; heightM: number; vectorA: GeometryPoint; vectorB: GeometryPoint };
  metrics: { segmentCount: number; crossingCount: number; estimatedOpenAreaPercent: number; shortestSegmentM: number };
  validation: GeometryValidation[];
  boundary: string;
};

export type GeometryWorkspace = {
  schema: typeof GEOMETRY_SCHEMA;
  status: "executable";
  name: string;
  parameters: GeometryParameters;
  sourceBasis: string;
  authorRole: string;
  reviewRole: string;
  intendedZone: string;
  material: string;
  updatedAt: string;
};

export const defaultGeometryParameters: GeometryParameters = { family: "star-rosette", symmetry: "radial", order: 8, rings: 2, innerRatio: .43, repeatX: 3, repeatY: 2, strapWidthM: .018, panelWidthM: 3.6, panelHeightM: 2.4, interlace: true, clip: "rectangle" };
export function createGeometryWorkspace(): GeometryWorkspace { return { schema: GEOMETRY_SCHEMA, status: "executable", name: "Original geometric screen study", parameters: { ...defaultGeometryParameters }, sourceBasis: "", authorRole: "", reviewRole: "", intendedZone: "window-screen", material: "perforated panel study", updatedAt: "" }; }

const finite = (v: unknown, min: number, max: number): v is number => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const text = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max;
export function safeGeometryWorkspace(value: unknown): GeometryWorkspace | null {
  if (!value || typeof value !== "object") return null;
  const x = value as GeometryWorkspace, p = x.parameters;
  if (x.schema !== GEOMETRY_SCHEMA || x.status !== "executable" || !p || !text(x.name, 160) || !text(x.sourceBasis, 1000) || !text(x.authorRole, 200) || !text(x.reviewRole, 200) || !text(x.intendedZone, 100) || !text(x.material, 160)) return null;
  if (!geometryFamilies.includes(p.family) || !symmetryGroups.includes(p.symmetry) || !geometryOrders.includes(p.order) || !finite(p.rings, 1, 6) || !finite(p.innerRatio, .15, .85) || !finite(p.repeatX, 1, 10) || !finite(p.repeatY, 1, 10) || !finite(p.strapWidthM, .001, .25) || !finite(p.panelWidthM, .2, 30) || !finite(p.panelHeightM, .2, 20) || typeof p.interlace !== "boolean" || !["rectangle", "circle"].includes(p.clip)) return null;
  return x;
}

const point = (cx: number, cy: number, r: number, a: number): GeometryPoint => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
const add = (list: GeometrySegment[], from: GeometryPoint, to: GeometryPoint, role: GeometryRole = "primary") => list.push({ id: `s${list.length + 1}`, from, to, role });
const polygon = (list: GeometrySegment[], cx: number, cy: number, radius: number, count: number, rotation: number, role: GeometryRole) => {
  for (let i = 0; i < count; i++) add(list, point(cx, cy, radius, rotation + i * Math.PI * 2 / count), point(cx, cy, radius, rotation + (i + 1) * Math.PI * 2 / count), role);
};
function motif(p: GeometryParameters): GeometrySegment[] {
  const out: GeometrySegment[] = [], n = p.order, rot = -Math.PI / 2;
  if (p.family === "overlapping-squares") {
    polygon(out, 0, 0, .42, 4, Math.PI / 4, "primary"); polygon(out, 0, 0, .42, 4, 0, "secondary");
  } else if (p.family === "hex-lattice") {
    polygon(out, 0, 0, .4, 6, Math.PI / 6, "primary");
    for (let i = 0; i < 6; i++) add(out, point(0, 0, .4, Math.PI / 6 + i * Math.PI / 3), point(0, 0, .22, Math.PI / 6 + i * Math.PI / 3), "secondary");
  } else if (p.family === "star-cross") {
    const pts: GeometryPoint[] = [];
    for (let i = 0; i < n * 2; i++) pts.push(point(0, 0, i % 2 ? .18 + p.innerRatio * .16 : .43, rot + i * Math.PI / n));
    pts.forEach((q, i) => add(out, q, pts[(i + 1) % pts.length], i % 2 ? "secondary" : "primary"));
    for (let i = 0; i < n; i++) add(out, point(0, 0, .43, rot + i * Math.PI * 2 / n), point(0, 0, .5, rot + i * Math.PI * 2 / n), "secondary");
  } else if (p.family === "girih-study") {
    polygon(out, 0, 0, .42, Math.max(5, n / 2), rot, "primary");
    for (let i = 0; i < n; i++) add(out, point(0, 0, .42, rot + i * Math.PI * 2 / n), point(0, 0, .16, rot + (i + 2) * Math.PI * 2 / n), i % 2 ? "secondary" : "primary");
  } else {
    for (let ring = 1; ring <= p.rings; ring++) polygon(out, 0, 0, .42 * ring / p.rings, n, rot + (ring % 2) * Math.PI / n, ring === p.rings ? "primary" : "secondary");
    for (let i = 0; i < n; i++) add(out, point(0, 0, .42, rot + i * Math.PI * 2 / n), point(0, 0, .42 * p.innerRatio, rot + (i + .5) * Math.PI * 2 / n), i % 2 ? "secondary" : "primary");
  }
  return out;
}

const inside = (q: GeometryPoint, clip: GeometryParameters["clip"]) => clip === "rectangle" || Math.hypot(q[0], q[1]) <= .5;
function intersection(a: GeometrySegment, b: GeometrySegment): GeometryPoint | null {
  const [x1,y1]=a.from,[x2,y2]=a.to,[x3,y3]=b.from,[x4,y4]=b.to,d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
  if (Math.abs(d)<1e-9) return null;
  const t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/d,u=-((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/d;
  return t>.001&&t<.999&&u>.001&&u<.999?[x1+t*(x2-x1),y1+t*(y2-y1)]:null;
}

export function generateIslamicGeometry(parameters: GeometryParameters): GeometryResult {
  const p = { ...parameters, rings: Math.round(parameters.rings), repeatX: Math.round(parameters.repeatX), repeatY: Math.round(parameters.repeatY) };
  const base = motif(p), segments: GeometrySegment[] = [];
  for (let y=0;y<p.repeatY;y++) for (let x=0;x<p.repeatX;x++) for (const s of base) {
    const scale = 1 / Math.max(p.repeatX,p.repeatY), ox=(x+.5)/p.repeatX-.5, oy=(y+.5)/p.repeatY-.5;
    const transform=([px,py]:GeometryPoint):GeometryPoint=>{let tx=px,ty=py;if(p.symmetry==="p4m"&&(x+y)%2){tx=-py;ty=px}else if(p.symmetry==="p6m"){const a=(x%3)*Math.PI/3,rx=tx*Math.cos(a)-ty*Math.sin(a);ty=tx*Math.sin(a)+ty*Math.cos(a);tx=rx}else if(p.symmetry==="frieze"&&x%2)tx=-tx;return[ox+tx*scale*.94,oy+ty*scale*.94]};
    const from=transform(s.from),to=transform(s.to);
    if(inside(from,p.clip)&&inside(to,p.clip)) add(segments,from,to,s.role);
  }
  const crossings:GeometryCrossing[]=[];
  if(p.interlace) for(let i=0;i<segments.length;i++) for(let j=i+1;j<segments.length;j++){
    if(crossings.length>=300) break;
    const q=intersection(segments[i],segments[j]); if(q) crossings.push({point:q,segmentA:segments[i].id,segmentB:segments[j].id,over:crossings.length%2?segments[i].id:segments[j].id});
  }
  if(p.interlace){const over=new Set(crossings.map(x=>x.over)),under=new Set(crossings.flatMap(x=>[x.segmentA,x.segmentB]).filter(x=>!over.has(x)));segments.forEach(s=>{if(over.has(s.id))s.role="over";else if(under.has(s.id))s.role="under"})}
  const lengths=segments.map(s=>Math.hypot((s.to[0]-s.from[0])*p.panelWidthM,(s.to[1]-s.from[1])*p.panelHeightM));
  const shortest=lengths.length?Math.min(...lengths):0, density=Math.min(.9,segments.reduce((n,s)=>n+Math.hypot(s.to[0]-s.from[0],s.to[1]-s.from[1])*p.strapWidthM/Math.min(p.panelWidthM,p.panelHeightM),0));
  const validation:GeometryValidation[]=[];
  if(p.strapWidthM<.006)validation.push({level:"warning",code:"MIN_FEATURE_REVIEW",message:"Strap width is below 6 mm. Confirm the minimum feature with the selected material and fabricator."});
  if(shortest&&shortest<p.strapWidthM*2)validation.push({level:"error",code:"SHORT_SEGMENT",message:"At least one segment is shorter than twice the strap width; revise density before fabrication development."});
  if(segments.length>1800)validation.push({level:"warning",code:"HIGH_COMPLEXITY",message:"High segment count may affect mobile performance and fabrication cleanup."});
  if(p.family==="girih-study")validation.push({level:"note",code:"ORIGINAL_STUDY",message:"Girih study is a contemporary derived exercise, not a reconstruction of a named place, period or object."});
  if(!p.interlace)validation.push({level:"note",code:"INTERLACE_OFF",message:"Crossings are drawn as coincident lines; enable weave study to inspect over-under ordering."});
  return {schema:GEOMETRY_SCHEMA,status:"executable",parameters:p,segments,crossings,repeatCell:{widthM:p.panelWidthM/p.repeatX,heightM:p.panelHeightM/p.repeatY,vectorA:[p.panelWidthM/p.repeatX,0],vectorB:[0,p.panelHeightM/p.repeatY]},metrics:{segmentCount:segments.length,crossingCount:crossings.length,estimatedOpenAreaPercent:Math.round((1-density)*100),shortestSegmentM:Number(shortest.toFixed(4))},validation,boundary:"Original non-calligraphic geometric study. Not a heritage reconstruction, sacred text, fabrication file, structural element, environmental result, compliance finding or approval. Validate geometry and review cultural application before downstream use."};
}

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]!));
export function geometryToSvg(result: GeometryResult, title="mosque.build geometric study") {
  const w=1200,h=Math.max(400,Math.round(w*result.parameters.panelHeightM/result.parameters.panelWidthM)),sw=Math.max(1,result.parameters.strapWidthM/result.parameters.panelWidthM*w);
  const path=(s:GeometrySegment)=>`M ${(s.from[0]+.5)*w} ${(.5-s.from[1])*h} L ${(s.to[0]+.5)*w} ${(.5-s.to[1])*h}`;
  const lines=result.segments.map(s=>`<path d="${path(s)}" class="${s.role}"/>`).join("");
  const clip=result.parameters.clip==="circle"?`<circle cx="${w/2}" cy="${h/2}" r="${Math.min(w,h)*.49}"/>`:`<rect width="${w}" height="${h}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(result.boundary)}</desc><defs><clipPath id="panel">${clip}</clipPath></defs><rect width="100%" height="100%" fill="#efe9da"/><g clip-path="url(#panel)" fill="none" stroke="#164f43" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><style>.secondary{opacity:.58}.under{stroke:#6f756d}.over{stroke:#9a6b19}</style>${lines}</g></svg>`;
}
