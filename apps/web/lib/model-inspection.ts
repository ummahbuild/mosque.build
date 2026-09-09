import type {RenderModel} from "@/lib/render-model";

export const modelLayers=["spaces","template","architecture","interiors","site","walls","openings","guides"] as const;
export type ModelLayer=(typeof modelLayers)[number];
export type ModelView="iso"|"top"|"front"|"rear"|"left"|"right"|"qibla";
export type InspectionPreferences={view:ModelView;layers:Record<ModelLayer,boolean>;grid:boolean;shadows:boolean;wireframe:boolean;explode:number};
export type ModelStatistics={spaces:number;walls:number;openings:number;guides:number;footprintM2:number;programAreaM2:number;modeledVolumeM3:number;materialRoles:number;adjacencies:number};

export const defaultInspectionPreferences:InspectionPreferences={view:"iso",layers:{spaces:true,template:true,architecture:true,interiors:true,site:true,walls:true,openings:true,guides:true},grid:true,shadows:true,wireframe:false,explode:0};

export function sanitizeInspectionPreferences(value:unknown):InspectionPreferences{
  if(!value||typeof value!=="object")return structuredClone(defaultInspectionPreferences);
  const source=value as Partial<InspectionPreferences>,views:ModelView[]=["iso","top","front","rear","left","right","qibla"];
  const layers=Object.fromEntries(modelLayers.map(layer=>[layer,typeof source.layers?.[layer]==="boolean"?source.layers[layer]:true])) as Record<ModelLayer,boolean>;
  return {view:views.includes(source.view as ModelView)?source.view as ModelView:"iso",layers,grid:typeof source.grid==="boolean"?source.grid:true,shadows:typeof source.shadows==="boolean"?source.shadows:true,wireframe:Boolean(source.wireframe),explode:Number.isFinite(source.explode)?Math.min(5,Math.max(0,Number(source.explode))):0};
}

export function inspectRenderModel(model:RenderModel):ModelStatistics{
  const spaces=model.boxes.filter(box=>box.id!=="site"),materialRoles=new Set(spaces.map(box=>box.material));
  return {spaces:spaces.length,walls:model.walls.length,openings:model.openings.length,guides:model.guides.length,footprintM2:Math.round(model.footprint[0]*model.footprint[1]*10)/10,programAreaM2:Math.round(spaces.reduce((sum,box)=>sum+box.areaM2,0)*10)/10,modeledVolumeM3:Math.round(spaces.reduce((sum,box)=>sum+box.size[0]*box.size[1]*box.size[2],0)*10)/10,materialRoles:materialRoles.size,adjacencies:model.adjacencies.length};
}

export function qiblaOffset(degrees:number,distance:number):[number,number]{const radians=degrees*Math.PI/180;return [Math.sin(radians)*distance,Math.cos(radians)*distance]}
