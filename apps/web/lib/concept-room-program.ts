import type {ConceptFields} from "./concept-onboarding";
export type ProgramRoom={id:string;label:string;quantity:number;areaM2:number|null;basis:string;reviewRequired:boolean};
export type ConceptProgram={status:"conceptual";attendance:number|null;totalAreaM2:number|null;rooms:ProgramRoom[];warnings:string[];assumptions:string[]};
const prayerAllowanceM2=1.25;
// One registry connects brief needs to preview requirements. Support-space areas
// stay unknown: recognizing a program does not establish its dimensions.
const specs=[
 {need:"Prayer hall",id:"prayer",label:"Prayer hall",basis:"Per-person conceptual gross prayer-zone allowance; not a fire occupancy or prayer-row approval"},
 {need:"Wudu",id:"wudu",label:"Ablution / wudu",basis:"Confirm fixtures, wet-area circulation, drainage and local requirements with the design team."},
 {need:"Madrasa / classrooms",id:"classrooms",label:"Madrasa / classrooms",basis:"Confirm class sizes, supervision, safeguarding and educational requirements before sizing rooms."},
 {need:"Women / family",id:"family",label:"Women / family prayer area",basis:"Agree capacity, equitable access, privacy and family needs with community representatives."},
 {need:"Library",id:"library",label:"Library",basis:"Set the collection, shelving, reading places and accessible routes in a room brief."},
 {need:"Community hall",id:"community",label:"Community / event hall",basis:"Confirm event types, simultaneous use, storage and capacity separately from prayer attendance."},
 {need:"Accessibility",id:"access",label:"Accessible circulation",basis:"Review routes, entrances, lifts and emergency egress with users and qualified professionals."},
 {need:"Parking",id:"parking",label:"Parking",basis:"Confirm arrival modes, vehicle counts, accessible bays and site-specific planning requirements."},
 {need:"Youth",id:"youth",label:"Youth space",basis:"Agree activities, age groups, supervision, storage and acoustics before setting the area."},
 {need:"Kitchen / iftar",id:"kitchen",label:"Kitchen / iftar facilities",basis:"Confirm meals, preparation, serving, cleaning, storage and services with the operations and design teams."},
 {need:"Janazah",id:"janazah",label:"Janazah facilities",basis:"Agree the intended services, privacy and access with community, religious and qualified professional reviewers."},
 {need:"Waqf / income-generating space",id:"waqf",label:"Waqf / income-generating space",basis:"Define the proposed use, separate access and servicing; review governance and local requirements before sizing."},
] as const;
export function deriveConceptProgram(fields:ConceptFields):ConceptProgram{
 const n=Number(fields.attendance);
 const reviewed=fields.evidence===undefined||fields.evidence.attendance?.status==="suggested";
 const attendance=reviewed&&/^\d{1,6}$/.test(fields.attendance)&&Number.isSafeInteger(n)&&n>0&&n<=50000?n:null;
 const needsReadable=Array.isArray(fields.needs),suppliedNeeds=needsReadable?fields.needs:[];
 const needsReviewed=fields.evidence===undefined||fields.evidence.needs?.status==="suggested";
 const selectedNeeds=new Set(needsReviewed?suppliedNeeds:[]);
 const rooms:ProgramRoom[]=specs.filter(spec=>spec.id==="prayer"||selectedNeeds.has(spec.need)).map(spec=>({
  id:spec.id,label:spec.label,quantity:1,areaM2:spec.id==="prayer"&&attendance!==null?Math.round(attendance*prayerAllowanceM2):null,basis:spec.basis,reviewRequired:true
 }));
 const warnings:string[]=[];
 if(!needsReadable)warnings.push("Program needs could not be read. Review the original concept before creating a room brief.");
 else if(suppliedNeeds.length&&!needsReviewed)warnings.push("Program needs require clarification. No additional spaces have been inferred from those suggestions.");
 if(suppliedNeeds.some(need=>!specs.some(spec=>spec.need===need)))warnings.push("Some requested programs are not supported in this preview. Keep them in your brief and review their space requirements with the design team.");
 if(attendance===null)warnings.push("Enter and confirm the target prayer attendance before estimating prayer-zone area.");
 if(!fields.location)warnings.push("Location is missing; climate, permits and local procurement cannot be contextualized.");
 if(!fields.budget)warnings.push("No budget was recognized; there is no affordability assessment.");
 if(fields.storeys)warnings.push("Storey count is a preference, not a verified site or structural solution.");
 warnings.push("Area is a conceptual starting assumption, not net usable area, code compliance, or a complete building area.");
 return {status:"conceptual",attendance,totalAreaM2:null,rooms,warnings,assumptions:[`Prayer-zone allowance: ${prayerAllowanceM2} m²/person, configurable in later program studies.`,"No support-space sizes are inferred from attendance alone.","Total area remains unknown until all required rooms and circulation are dimensioned."]};
}
