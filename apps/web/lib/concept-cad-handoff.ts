import {starterCadDocument,validateCadDocument} from "./cad-authoring-core";
import type {ConceptFields} from "./concept-onboarding";
import {deriveConceptProgram} from "./concept-room-program";
export function previewConceptCadHandoff(fields:ConceptFields){
 const program=deriveConceptProgram(fields),starter=starterCadDocument();
 const blockers=validateCadDocument(starter).filter(x=>x.level==="blocker");
 const prayer=starter.spaces.find(x=>x.kind==="prayer");
 const requested=program.rooms.find(x=>x.id==="prayer")?.areaM2??null;
 const measured=prayer?.areaM2??null;
 return {status:"preview_only" as const,source:"concept prompt" as const,modelRevision:starter.revision,starterModelId:starter.id,starterPrayerAreaM2:measured,requestedPrayerZoneAreaM2:requested,dimensionMismatch:requested!==null&&measured!==null&&Math.abs(requested-measured)>.01,validStarter:blockers.length===0,warnings:[...program.warnings,...(requested!==null&&measured!==null&&Math.abs(requested-measured)>.01?["Starter geometry is not sized for your requested capacity. Do not use it as a valid design until it is edited and reviewed."]:[]),"No automatic wall modification, multi-storey placement, structural calculations or IFC output is performed."],spaceRequirements:program.rooms.map(x=>({id:x.id,label:x.label,areaM2:x.areaM2}))};
}
