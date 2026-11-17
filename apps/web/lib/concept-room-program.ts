import type {ConceptFields} from "./concept-onboarding";
export type ProgramRoom={id:string;label:string;quantity:number;areaM2:number|null;basis:string;reviewRequired:boolean};
export type ConceptProgram={status:"conceptual";attendance:number|null;totalAreaM2:number|null;rooms:ProgramRoom[];warnings:string[];assumptions:string[]};
const specs=[
 ["prayer","Prayer hall",1.25,"Per-person conceptual gross prayer-zone allowance; not a fire occupancy or prayer-row approval"],
 ["wudu","Ablution / wudu",0,"Fixture count and dimensions require local standards and community program"],
 ["classrooms","Madrasa / classrooms",0,"Class sizes, safeguarding and educational requirements are not established"],
 ["family","Women / family prayer area",0,"Allocation requires equitable-access and community consultation"],
 ["library","Library",0,"Collection size and furnishings need a room brief"],
 ["community","Community / event hall",0,"Event capacity may differ from prayer attendance"],
 ["access","Accessible circulation",0,"Routes, lifts and emergency egress need professional assessment"],
 ["parking","Parking",0,"Vehicle counts and planning requirements are site dependent"]
] as const;
export function deriveConceptProgram(fields:ConceptFields):ConceptProgram{
 const n=Number(fields.attendance);
 const attendance=/^\d{1,6}$/.test(fields.attendance)&&Number.isSafeInteger(n)&&n>0&&n<=50000?n:null;
 const rooms:ProgramRoom[]=[];
 rooms.push({id:"prayer",label:"Prayer hall",quantity:1,areaM2:attendance===null?null:Math.round(attendance*specs[0][2]),basis:specs[0][3],reviewRequired:true});
 const keyed:[string,string,string][]=[["Wudu","wudu","Ablution / wudu"],["Madrasa / classrooms","classrooms","Madrasa / classrooms"],["Women / family","family","Women / family prayer area"],["Library","library","Library"],["Community hall","community","Community / event hall"],["Accessibility","access","Accessible circulation"],["Parking","parking","Parking"]];
 for(const [need,id,label] of keyed)if(fields.needs.includes(need)){const spec=specs.find(x=>x[0]===id);rooms.push({id,label,quantity:1,areaM2:null,basis:spec?.[3]||"Requires specialist design review",reviewRequired:true})}
 const warnings:string[]=[];
 if(attendance===null)warnings.push("Enter and confirm the target prayer attendance before estimating prayer-zone area.");
 if(!fields.location)warnings.push("Location is missing; climate, permits and local procurement cannot be contextualized.");
 if(!fields.budget)warnings.push("No budget was recognized; there is no affordability assessment.");
 if(fields.storeys)warnings.push("Storey count is a preference, not a verified site or structural solution.");
 warnings.push("Area is a conceptual starting assumption, not net usable area, code compliance, or a complete building area.");
 return {status:"conceptual",attendance,totalAreaM2:null,rooms,warnings,assumptions:["Prayer-zone allowance: 1.25 m²/person, configurable in later program studies.","No room sizes are fabricated for wudu, classrooms, circulation or parking.","Total area remains unknown until all required rooms and circulation are dimensioned."]};
}
