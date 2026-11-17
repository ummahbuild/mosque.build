import {cadClosedBoundaryArea,starterCadDocument,validateCadDocument} from "./cad-authoring-core";
import type {ConceptFields} from "./concept-onboarding";
import {deriveConceptProgram} from "./concept-room-program";

/** Compare requirements to the optional sample. Never writes or resizes a project. */
export function previewConceptCadHandoff(fields:ConceptFields){
  const program=deriveConceptProgram(fields),starter=starterCadDocument();
  const blockers=validateCadDocument(starter).filter(issue=>issue.level==="blocker");
  const prayer=starter.spaces.find(space=>space.kind==="prayer");
  const requested=program.rooms.find(room=>room.id==="prayer")?.areaM2??null;
  const measured=prayer?cadClosedBoundaryArea(prayer,starter.walls):null;
  const areaDifferenceM2=requested!==null&&measured!==null?requested-measured:null;
  const dimensionMismatch=areaDifferenceM2!==null&&Math.abs(areaDifferenceM2)>.01;
  return {
    status:"preview_only" as const,source:"concept prompt" as const,
    modelRevision:starter.revision,starterModelId:starter.id,
    starterPrayerAreaM2:measured,requestedPrayerZoneAreaM2:requested,
    areaDifferenceM2,dimensionMismatch,validStarter:blockers.length===0,
    professionalReviewRequired:true as const,
    warnings:[...program.warnings,
      ...(dimensionMismatch?["Starter geometry is not sized for your requested capacity. Edit and review it before using it for your project."]:[]),
      "Matching areas do not establish usable capacity, accessibility, structural safety or compliance.",
      "This comparison does not change saved drawings, resize walls, place storeys or generate construction documents."
    ],
    spaceRequirements:program.rooms.map(room=>({id:room.id,label:room.label,areaM2:room.areaM2})),
    unresolvedSpaceIds:program.rooms.filter(room=>room.areaM2===null).map(room=>room.id)
  };
}
