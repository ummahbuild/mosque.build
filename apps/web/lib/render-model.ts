import type {SchematicPlan,SchematicRoom} from "@/lib/schematic-plan";
export type RenderMaterial="site"|SchematicRoom["kind"];
export type RenderBox={id:string;label:string;position:[number,number,number];size:[number,number,number];material:RenderMaterial};
export type RenderModel={schemaVersion:"mosque.build/render-model@1";units:"m";status:"concept";boxes:RenderBox[];reviewGate:string};
const heights:Record<SchematicRoom["kind"],number>={prayer:4.8,support:3.2,learning:3.4,circulation:3,courtyard:.12};
/** Renderer-neutral scene description for WebGL, glTF, or future adapters. */
export function createRenderModel(plan:SchematicPlan):RenderModel{const boxes:RenderBox[]=[{id:"site",label:"Conceptual site plate",position:[plan.inputs.widthM/2,-.12,plan.inputs.depthM/2],size:[plan.inputs.widthM+.8,.2,plan.inputs.depthM+.8],material:"site"}];for(const room of plan.rooms){const height=heights[room.kind];boxes.push({id:room.id,label:room.name,position:[room.x+room.width/2,height/2,room.y+room.depth/2],size:[room.width,height,room.depth],material:room.kind})}return {schemaVersion:"mosque.build/render-model@1",units:"m",status:"concept",boxes,reviewGate:plan.reviewGate}}
