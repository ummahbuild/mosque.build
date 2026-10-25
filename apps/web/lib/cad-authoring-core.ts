export const CAD_AUTHORING_SCHEMA="mosque.build/cad-authoring@1" as const;
export const CAD_AUTHORING_KEY="mosque-build.cad-authoring.v1" as const;
export type Point2={x:number;y:number};
export const CAD_WALL_FAMILIES=[{id:"wall-masonry-concept",name:"Masonry study",thicknessM:.24},{id:"wall-lightweight-concept",name:"Lightweight partition",thicknessM:.12},{id:"wall-heavy-concept",name:"Heavy enclosure",thicknessM:.36}] as const;
export type CadWall={id:string;name:string;start:Point2;end:Point2;thicknessM:number;heightM:number;typeId:string;phase:"existing"|"new"|"temporary"|"demolish"};
export type CadOpening={id:string;name:string;kind:"door"|"window"|"opening";hostWallId:string;offsetM:number;widthM:number;heightM:number;sillM:number;typeId:string};
export type CadSpace={id:string;name:string;kind:"prayer"|"circulation"|"wudu"|"community"|"support";boundaryWallIds:string[];areaM2:number;levelId:string};
export type CadDocument={id:string;units:"m";revision:number;level:{id:string;name:string;elevationM:number;heightM:number};walls:CadWall[];openings:CadOpening[];spaces:CadSpace[];updatedAt:string};
export type CadCommand={id:string;kind:"load-starter"|"create-wall"|"move-wall-end"|"place-door"|"resize-opening"|"rename-space"|"rename-wall"|"move-opening"|"set-wall-family"|"set-level-properties"|"delete-element";targetId:string;payload:Record<string,number|string|boolean>;summary:string};
export type CadTransaction={command:CadCommand;preview:CadDocument;issues:CadIssue[]};
export type CadAuthoringState={schema:typeof CAD_AUTHORING_SCHEMA;status:"executable";document:CadDocument;past:CadDocument[];future:CadDocument[];transaction:CadTransaction|null;selection:string[];updatedAt:string};
export type CadIssue={level:"blocker"|"review";code:string;elementId:string;message:string};
const stamp=()=>new Date().toISOString(),clone=(x:CadDocument):CadDocument=>structuredClone(x),finite=(x:unknown,min=-10000,max=10000)=>typeof x==="number"&&Number.isFinite(x)&&x>=min&&x<=max;
export const wallLength=(w:CadWall)=>Math.hypot(w.end.x-w.start.x,w.end.y-w.start.y);
const close=(a:Point2,b:Point2,tolerance=.001)=>Math.hypot(a.x-b.x,a.y-b.y)<=tolerance;
export function cadSnapPoint(point:Point2,doc:CadDocument,gridM=.5,toleranceM=.3){const safeGrid=finite(gridM,.01,100)?gridM:.5,safeTolerance=finite(toleranceM,0,10)?toleranceM:.3,endpoints=doc.walls.flatMap(w=>[w.start,w.end]),nearest=endpoints.map(p=>({p,d:Math.hypot(p.x-point.x,p.y-point.y)})).sort((a,b)=>a.d-b.d)[0];if(nearest&&nearest.d<=safeTolerance)return{point:{...nearest.p},mode:"endpoint" as const,distanceM:nearest.d};const snapped={x:Math.round(point.x/safeGrid)*safeGrid,y:Math.round(point.y/safeGrid)*safeGrid};return{point:snapped,mode:"grid" as const,distanceM:Math.hypot(snapped.x-point.x,snapped.y-point.y)}}
export function cadClosedBoundaryArea(space:CadSpace,walls:CadWall[]):number|null{
 const segments=space.boundaryWallIds.map(id=>walls.find(w=>w.id===id));
 if(segments.length<3||segments.some(w=>!w)||new Set(space.boundaryWallIds).size!==segments.length)return null;
 const remaining=[...segments] as CadWall[];
 const first=remaining.shift()!;
 const start={...first.start};
 let current={...first.end};
 const vertices:Point2[]=[start,{...current}];
 while(remaining.length){
  const matches=remaining.filter(w=>close(w.start,current)||close(w.end,current));
  if(matches.length!==1)return null;
  const wall=matches[0],index=remaining.indexOf(wall);
  remaining.splice(index,1);
  current={...(close(wall.start,current)?wall.end:wall.start)};
  if(vertices.some(v=>close(v,current))&&!close(current,start))return null;
  vertices.push(current);
 }
 if(!close(current,start)||vertices.length<4)return null;
 const ring=vertices.slice(0,-1);
 const cross=(a:Point2,b:Point2,c:Point2)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
 const intersects=(a:Point2,b:Point2,c:Point2,d:Point2)=>{
  const ab1=cross(a,b,c),ab2=cross(a,b,d),cd1=cross(c,d,a),cd2=cross(c,d,b);
  return ab1*ab2<0&&cd1*cd2<0;
 };
 for(let i=0;i<ring.length;i++)for(let j=i+1;j<ring.length;j++){
  if(j===i+1||(i===0&&j===ring.length-1))continue;
  if(intersects(ring[i],ring[(i+1)%ring.length],ring[j],ring[(j+1)%ring.length]))return null;
 }
 const area=Math.abs(ring.reduce((sum,p,i)=>{const q=ring[(i+1)%ring.length];return sum+p.x*q.y-q.x*p.y},0)/2);
 return Number.isFinite(area)&&area>.0001?+area.toFixed(2):null;
}
function polygonAreaFor(space:CadSpace,walls:CadWall[]){return cadClosedBoundaryArea(space,walls)??0}
export function recalculateCadSpaces(doc:CadDocument):CadDocument{return{...doc,spaces:doc.spaces.map(space=>({...space,areaM2:+polygonAreaFor(space,doc.walls).toFixed(2)}))}}
export function emptyCadDocument():CadDocument{return{id:"mosque-concept",units:"m",revision:0,level:{id:"level-ground",name:"Ground floor",elevationM:0,heightM:3.6},walls:[],openings:[],spaces:[],updatedAt:""}}
export function starterCadDocument():CadDocument{const walls:CadWall[]=[[[0,0],[8,0],"south · prayer"],[[12,0],[12,8],"east"],[[12,8],[8,8],"north · support"],[[0,8],[0,0],"west"],[[8,0],[8,8],"partition"],[[8,0],[12,0],"south · support"],[[8,8],[0,8],"north · prayer"]].map(([a,b,name],i)=>({id:`wall-${i+1}`,name:String(name),start:{x:(a as number[])[0],y:(a as number[])[1]},end:{x:(b as number[])[0],y:(b as number[])[1]},thicknessM:.24,heightM:3.6,typeId:"wall-masonry-concept",phase:"new"})) as CadWall[];return{...emptyCadDocument(),revision:1,walls,openings:[{id:"door-1",name:"Prayer hall entry",kind:"door",hostWallId:"wall-5",offsetM:3.2,widthM:1.2,heightM:2.2,sillM:0,typeId:"door-concept"}],spaces:[{id:"space-prayer",name:"Prayer hall",kind:"prayer",boundaryWallIds:["wall-1","wall-5","wall-7","wall-4"],areaM2:64,levelId:"level-ground"},{id:"space-support",name:"Support room",kind:"support",boundaryWallIds:["wall-6","wall-2","wall-3","wall-5"],areaM2:32,levelId:"level-ground"}],updatedAt:stamp()}}
export function createCadAuthoringState():CadAuthoringState{return{schema:CAD_AUTHORING_SCHEMA,status:"executable",document:emptyCadDocument(),past:[],future:[],transaction:null,selection:[],updatedAt:stamp()}}
export function validateCadDocument(doc:CadDocument){const issues:CadIssue[]=[],ids=[...doc.walls,...doc.openings,...doc.spaces].map(x=>x.id),knownWalls=new Set(doc.walls.map(x=>x.id));for(const id of new Set(ids))if(ids.filter(x=>x===id).length>1)issues.push({level:"blocker",code:"DUPLICATE_ID",elementId:id,message:"Element IDs must be unique."});for(const wall of doc.walls){if(!finite(wall.start.x)||!finite(wall.start.y)||!finite(wall.end.x)||!finite(wall.end.y)||!finite(wall.thicknessM,.01,5)||!finite(wall.heightM,.1,100))issues.push({level:"blocker",code:"INVALID_WALL",elementId:wall.id,message:"Wall geometry is outside the supported finite range."});else if(wallLength(wall)<.05)issues.push({level:"blocker",code:"SHORT_WALL",elementId:wall.id,message:"Wall must be at least 0.05 m long."})}for(const opening of doc.openings){const host=doc.walls.find(x=>x.id===opening.hostWallId);if(!host)issues.push({level:"blocker",code:"MISSING_HOST",elementId:opening.id,message:"Opening host wall is missing."});else if(!finite(opening.widthM,.1,20)||!finite(opening.heightM,.1,20)||!finite(opening.sillM,0,20)||!finite(opening.offsetM,0,wallLength(host))||opening.offsetM+opening.widthM>wallLength(host))issues.push({level:"blocker",code:"OPENING_OUTSIDE_HOST",elementId:opening.id,message:"Opening must fit within its host wall."})}for(const space of doc.spaces){for(const wallId of space.boundaryWallIds)if(!knownWalls.has(wallId))issues.push({level:"blocker",code:"BROKEN_BOUNDARY",elementId:space.id,message:"Space boundary references a missing wall."});if(space.boundaryWallIds.length<3)issues.push({level:"review",code:"OPEN_SPACE_BOUNDARY",elementId:space.id,message:"Space has fewer than three boundary walls."})}if(!doc.spaces.length)issues.push({level:"review",code:"NO_SPACES",elementId:doc.id,message:"No spaces are defined."});return issues}
function apply(doc:CadDocument,command:CadCommand):CadDocument{if(command.kind==="load-starter")return starterCadDocument();let next=clone(doc);if(command.kind==="create-wall"){const start=cadSnapPoint({x:Number(command.payload.x1),y:Number(command.payload.y1)},next).point,end=cadSnapPoint({x:Number(command.payload.x2),y:Number(command.payload.y2)},next).point;next.walls.push({id:command.targetId,name:String(command.payload.name||"Wall").slice(0,120),start,end,thicknessM:Number(command.payload.thicknessM||.24),heightM:Number(command.payload.heightM||next.level.heightM),typeId:"wall-masonry-concept",phase:"new"})}if(command.kind==="move-wall-end"){const wall=next.walls.find(x=>x.id===command.targetId);if(wall){const old={...wall.end},target=cadSnapPoint({x:Number(command.payload.x),y:Number(command.payload.y)},next).point;for(const other of next.walls){if(close(other.start,old))other.start={...target};if(close(other.end,old))other.end={...target}}}}if(command.kind==="set-level-properties"){const elevationM=Number(command.payload.elevationM),heightM=Number(command.payload.heightM);next.level={...next.level,elevationM,heightM}}if(command.kind==="set-wall-family"){const wall=next.walls.find(x=>x.id===command.targetId),family=CAD_WALL_FAMILIES.find(x=>x.id===command.payload.typeId);if(wall&&family){wall.typeId=family.id;wall.thicknessM=family.thicknessM}}if(command.kind==="place-door"){next.openings.push({id:command.targetId,name:String(command.payload.name||"Door").slice(0,120),kind:"door",hostWallId:String(command.payload.hostWallId),offsetM:Number(command.payload.offsetM),widthM:Number(command.payload.widthM),heightM:Number(command.payload.heightM||2.1),sillM:0,typeId:"door-concept"})}if(command.kind==="resize-opening"){const opening=next.openings.find(x=>x.id===command.targetId);if(opening)opening.widthM=Number(command.payload.widthM)}if(command.kind==="rename-wall"){const wall=next.walls.find(x=>x.id===command.targetId);if(wall)wall.name=String(command.payload.name||"").trim().slice(0,120)}if(command.kind==="move-opening"){const opening=next.openings.find(x=>x.id===command.targetId);if(opening)opening.offsetM=Number(command.payload.offsetM)}if(command.kind==="rename-space"){const space=next.spaces.find(x=>x.id===command.targetId);if(space)space.name=String(command.payload.name||"").trim().slice(0,120)}if(command.kind==="delete-element"){if(next.walls.some(x=>x.id===command.targetId)){next.walls=next.walls.filter(x=>x.id!==command.targetId);next.openings=next.openings.filter(x=>x.hostWallId!==command.targetId);next.spaces=next.spaces.map(x=>({...x,boundaryWallIds:x.boundaryWallIds.filter(id=>id!==command.targetId)}))}else{next.openings=next.openings.filter(x=>x.id!==command.targetId);next.spaces=next.spaces.filter(x=>x.id!==command.targetId)}}next=recalculateCadSpaces(next);next.updatedAt=stamp();return next}
export function previewCadCommand(state:CadAuthoringState,command:CadCommand){
 const preview=apply(state.document,command);
 const issues=validateCadDocument(preview);
 const before=JSON.stringify({...state.document,updatedAt:""});
 const after=JSON.stringify({...preview,updatedAt:""});
 if(before===after)issues.push({level:"blocker",code:"NO_OP_COMMAND",elementId:command.targetId,message:"This command did not change any model properties. Choose an existing element and a different value."});
 return{...state,transaction:{command,preview,issues}};
}
export function commitCadCommand(state:CadAuthoringState){if(!state.transaction||state.transaction.issues.some(x=>x.level==="blocker"))return state;const document={...state.transaction.preview,revision:state.document.revision+1,updatedAt:stamp()};return{...state,document,past:[...state.past,state.document].slice(-50),future:[],transaction:null,updatedAt:document.updatedAt}}
export const cancelCadCommand=(state:CadAuthoringState):CadAuthoringState=>({...state,transaction:null});
export function undoCadCommand(state:CadAuthoringState){const previous=state.past.at(-1);if(!previous)return state;return{...state,document:previous,past:state.past.slice(0,-1),future:[state.document,...state.future].slice(0,50),transaction:null,updatedAt:stamp()}}
export function redoCadCommand(state:CadAuthoringState){const next=state.future[0];if(!next)return state;return{...state,document:next,past:[...state.past,state.document].slice(-50),future:state.future.slice(1),transaction:null,updatedAt:stamp()}}
export function cadSchedules(doc:CadDocument){return{walls:doc.walls.map(x=>({id:x.id,name:x.name,lengthM:+wallLength(x).toFixed(2),heightM:x.heightM,thicknessM:x.thicknessM,type:x.typeId,phase:x.phase})),openings:doc.openings.map(x=>({id:x.id,name:x.name,kind:x.kind,host:x.hostWallId,offsetM:x.offsetM,widthM:x.widthM,heightM:x.heightM,sillM:x.sillM})),spaces:doc.spaces.map(x=>({id:x.id,name:x.name,kind:x.kind,areaM2:x.areaM2,level:x.levelId}))}}
export const cadCsvCell=(value:unknown)=>{const raw=String(value??"");const safe=/^[\s\uFEFF]*[=+@\-\t\r]/u.test(raw)&&typeof value!=="number"?"\u0027"+raw:raw;return `"${safe.replaceAll('"','""')}"`};
export function exportCadSchedulesCsv(doc:CadDocument){const schedules=cadSchedules(doc),rows:[[string,...unknown[]],...Array<[string,...unknown[]]>]=[["record","id","name","classification","quantity","unit","host_or_level"]];for(const wall of schedules.walls)rows.push(["wall",wall.id,wall.name,wall.type,wall.lengthM,"m",doc.level.id]);for(const opening of schedules.openings)rows.push(["opening",opening.id,opening.name,opening.kind,opening.widthM,"m",opening.host]);for(const space of schedules.spaces)rows.push(["space",space.id,space.name,space.kind,space.areaM2,"m2",space.level]);return rows.map(row=>row.map(cadCsvCell).join(",")).join("\n")}
export function exportCadDetailedSchedulesCsv(doc:CadDocument){
 const rows:(string|number)[][]=[["kind","id","name","host_or_level","type","length_m","thickness_m","height_m","offset_m","width_m","sill_m","area_m2"]];
 for(const w of doc.walls)rows.push(["wall",w.id,w.name,doc.level.id,w.typeId,+wallLength(w).toFixed(2),w.thicknessM,w.heightM,"","","",""]);
 for(const o of doc.openings)rows.push(["opening",o.id,o.name,o.hostWallId,o.typeId,"","",o.heightM,o.offsetM,o.widthM,o.sillM,""]);
 for(const s of doc.spaces)rows.push(["space",s.id,s.name,s.levelId,s.kind,"","","","","","",s.areaM2]);
 return rows.map(row=>row.map(cadCsvCell).join(",")).join("\\n");
}
export function exportCadJson(state:CadAuthoringState){return JSON.stringify({schema:CAD_AUTHORING_SCHEMA,exportedAt:stamp(),status:state.status,document:state.document,scope:"conceptual-authoring",professionalReviewRequired:true},null,2)}
export function importCadJson(text:string):{state:CadAuthoringState|null;error:string|null}{if(text.length>2_000_000)return{state:null,error:"Import exceeds the 2 MB safety limit."};let value:unknown;try{value=JSON.parse(text)}catch{return{state:null,error:"The selected file is not valid JSON."}}if(!value||typeof value!=="object"||Object.getPrototypeOf(value)!==Object.prototype)return{state:null,error:"The import root must be a plain object."};const record=value as Record<string,unknown>,candidate=record.document?{...createCadAuthoringState(),document:record.document}:record,safe=safeCadAuthoringState(candidate);if(!safe)return{state:null,error:"The file does not match the supported CAD schema or contains blocking geometry."};return{state:{...safe,past:[],future:[],transaction:null,selection:[],updatedAt:stamp()},error:null}}
export function safeCadAuthoringState(value:unknown):CadAuthoringState|null{
 if(!value||typeof value!=="object"||Array.isArray(value))return null;
 const x=value as CadAuthoringState;
 if(x.schema!==CAD_AUTHORING_SCHEMA||x.status!=="executable"||!x.document||typeof x.document!=="object"||!x.document.level||typeof x.document.level!=="object"||!Array.isArray(x.document.walls)||x.document.walls.length>500||!Array.isArray(x.document.openings)||x.document.openings.length>500||!Array.isArray(x.document.spaces)||x.document.spaces.length>300||!Array.isArray(x.past)||x.past.length>50||!Array.isArray(x.future)||x.future.length>50||!Array.isArray(x.selection)||x.selection.length>100)return null;
 const elements=[...x.document.walls,...x.document.openings,...x.document.spaces];
 if(elements.some(e=>!e||typeof e!=="object"||typeof e.id!=="string"||typeof e.name!=="string")||x.document.walls.some(w=>!w.start||!w.end||typeof w.start!=="object"||typeof w.end!=="object"))return null;
 if(typeof x.document.id!=="string"||x.document.units!=="m"||!Number.isInteger(x.document.revision)||x.document.revision<0||typeof x.document.level.id!=="string"||!Number.isFinite(x.document.level.elevationM)||!Number.isFinite(x.document.level.heightM)||x.document.level.heightM<=0)return null;
 if(x.document.spaces.some(s=>!Array.isArray(s.boundaryWallIds)||typeof s.levelId!=="string")||x.selection.some(id=>typeof id!=="string"))return null;
 try{if(validateCadDocument(x.document).some(i=>i.level==="blocker"))return null}catch{return null}
 return{...x,transaction:null,selection:x.selection.filter(id=>elements.some(e=>e.id===id)).slice(0,100),past:[],future:[]};
}
