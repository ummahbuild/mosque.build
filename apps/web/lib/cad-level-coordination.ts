import {cadCsvCell,type CadDocument,type CadWall,type CadSpace} from "./cad-authoring-core";

export type CadLevelSummary={id:string;name:string;elevationM:number;storeyHeightM:number;wallCount:number;spaceCount:number;spaceAreaM2:number;conceptualSlabAreaM2:number;reviewNotes:string[]};

/** Read-only level coordination, never a structural slab design or IFC representation. */
export function cadLevelSummary(doc:CadDocument):CadLevelSummary {
 const level=doc.level;
 const spaces:CadSpace[]=doc.spaces.filter(s=>s.levelId===level.id);
 const walls:CadWall[]=doc.walls;
 const area=spaces.reduce((sum,s)=>sum+(Number.isFinite(s.areaM2)&&s.areaM2>0?s.areaM2:0),0);
 const notes:string[]=[];
 if(doc.spaces.some(s=>s.levelId!==level.id))notes.push("Spaces reference a level that is not present in this single-level CAD document.");
 if(!spaces.length)notes.push("No closed room schedule is available for conceptual slab area.");
 if(!Number.isFinite(level.elevationM)||!Number.isFinite(level.heightM)||level.heightM<=0)notes.push("Level elevations or storey height require correction.");
 return{id:level.id,name:level.name,elevationM:level.elevationM,storeyHeightM:level.heightM,wallCount:walls.length,spaceCount:spaces.length,spaceAreaM2:+area.toFixed(2),conceptualSlabAreaM2:+area.toFixed(2),reviewNotes:notes};
}
export function exportCadLevelScheduleCsv(doc:CadDocument){
 const s=cadLevelSummary(doc);

 return [["level_id","name","elevation_m","storey_height_m","walls","spaces","space_area_m2","conceptual_slab_area_m2","review"],[s.id,s.name,s.elevationM,s.storeyHeightM,s.wallCount,s.spaceCount,s.spaceAreaM2,s.conceptualSlabAreaM2,s.reviewNotes.join("; ")]].map(row=>row.map(cadCsvCell).join(",")).join("\n");
}
