export const PROJECT_DRAFT_KEY = "mosque-build.project-draft.v2";
export const LEGACY_DRAFT_KEY = "mosquebuild.projectDraft";
export const PROJECT_DRAFT_SCHEMA = "mosque.build/project-draft@2";
export const DRAFT_RECOVERY_KEY = "mosque-build.project-draft.recovery.v1";
export const MAX_DRAFT_LENGTH = 100_000;
// Allow UTF-8 expansion and the structured export envelope around a valid draft.
export const MAX_DRAFT_FILE_BYTES = 500_000;

export const draftChoices = {
  type: ["New mosque", "Mosque expansion", "Adaptive reuse / conversion", "Prayer room / musalla", "Mosque + madrasa", "Community center", "Phased campus"],
  stage: ["Idea / community need", "Searching for site", "Site identified", "Design started", "Permitting", "Fundraising", "Construction", "Existing mosque / operations"],
  land: ["Not yet", "Site under consideration", "Land owned", "Existing building", "Existing mosque"],
  timeline: ["Not set", "Under 12 months", "1–2 years", "2–5 years", "More than 5 years", "Phased / ongoing"],
  currency: ["", "USD", "GBP", "EUR", "AED", "SAR", "Other / mixed"],
  governance: ["Informal working group", "Registered charity / nonprofit", "Mosque board / trustees", "Existing institution", "Waqf structure under review", "Other / not decided"],
  needs: ["Prayer hall", "Women / family", "Wudu", "Madrasa / classrooms", "Youth", "Community hall", "Janazah", "Accessibility", "Library", "Kitchen / iftar", "Parking", "Waqf / income-generating space"],
  priorities: ["Clarity on next steps", "Community brief", "Site feasibility", "Design options", "Permit path", "Cost reality", "Fundraising structure", "Products / suppliers", "Construction control", "Opening + operations"],
  constraints: ["No known constraints yet", "Site not secured", "Planning / permit uncertainty", "Limited budget evidence", "Fundraising not started", "Professional team not appointed", "Utilities unknown", "Access / parking concern", "Existing building condition unknown"],
  team: ["Community lead", "Trustee / board", "Imam / religious reviewer", "Architect", "Engineer", "Quantity surveyor / cost professional", "Planner / permit professional", "Fundraising lead", "Operations lead"],
  funding: ["Community donations", "Major gifts", "Monthly pledges", "Grants", "Qard hasan", "Waqf income", "Asset sale", "Institutional finance", "Not decided"],
};
export type ProjectDraft = {schema?:typeof PROJECT_DRAFT_SCHEMA;name:string;type:string;location:string;stage:string;land:string;attendance:string;budget:string;currency:string;timeline:string;needs:string[];priorities:string[];constraints:string[];governance:string;owner:string;team:string[];funding:string[];notes:string;email:string;style:string[];storeys:string};
export function newProjectDraft():ProjectDraft {
  return {schema:PROJECT_DRAFT_SCHEMA,name:"",type:"New mosque",location:"",stage:"Idea / community need",land:"Not yet",attendance:"",budget:"",currency:"",timeline:"Not set",needs:["Prayer hall","Wudu"],priorities:["Clarity on next steps"],constraints:["Site not secured","Limited budget evidence","Professional team not appointed"],governance:"Informal working group",owner:"",team:["Community lead"],funding:["Community donations","Not decided"],notes:"",email:"",style:[],storeys:""};
}
export function safeProjectDraft(value:unknown):ProjectDraft|null {
  if(!value||typeof value!=="object"||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)return null;
  const record=value as Record<string,unknown>, defaults=newProjectDraft();
  if(record.schema!==undefined&&record.schema!==PROJECT_DRAFT_SCHEMA)return null;
  // Do not silently strip fields belonging to a newer or incompatible format.
  const known=new Set([...Object.keys(defaults),"projectName","projectType"]);
  if(!Object.keys(record).length||Object.keys(record).some(k=>!known.has(k)))return null;
  for(const field of ["name","type","projectName","projectType"] as const)if(field in record&&typeof record[field]!=="string")return null;
  if(record.name!==undefined&&record.projectName!==undefined&&record.name!==record.projectName||record.type!==undefined&&record.projectType!==undefined&&record.type!==record.projectType)return null;
  const candidate={...defaults,...record,name:record.name??record.projectName??defaults.name,type:record.type??record.projectType??defaults.type};
  for(const [field,allowed] of Object.entries(draftChoices)) {
    const v=candidate[field as keyof typeof candidate];
    if(Array.isArray(defaults[field as keyof ProjectDraft])) {
      if(!Array.isArray(v)||v.length>allowed.length||!v.every(item=>typeof item==="string"&&allowed.includes(item))||new Set(v).size!==v.length)return null;
    } else if(typeof v!=="string"||!allowed.includes(v))return null;
  }
  for(const field of ["name","location","attendance","budget","owner","notes","email"] as const) {
    if(typeof candidate[field]!=="string"||candidate[field].length>(field==="notes"?30_000:2000))return null;
  }
  if(!Array.isArray(candidate.style)||candidate.style.length>20||!candidate.style.every(v=>typeof v==="string"&&v.trim().length>0&&v.length<=100)||typeof candidate.storeys!=="string"||!/^$|^[1-9]\d?$/.test(candidate.storeys))return null;
  // Validate aliases even when a canonical value exists.
  if(record.projectName!==undefined&&typeof record.projectName!=="string"||record.projectType!==undefined&&typeof record.projectType!=="string")return null;
  const result={...candidate,schema:PROJECT_DRAFT_SCHEMA};
  delete (result as Record<string,unknown>).projectName;delete (result as Record<string,unknown>).projectType;
  return result as ProjectDraft;
}
export function parseProjectDraft(raw:string):ProjectDraft|null {
  if(raw.length>MAX_DRAFT_LENGTH)return null;
  try{return safeProjectDraft(JSON.parse(raw));}catch{return null;}
}
export type DraftSnapshot={key:string;raw:string|null};
export type DraftStorage=Pick<Storage,"getItem"|"setItem">;
export function readProjectDraft(storage:DraftStorage):DraftSnapshot {
  const current=storage.getItem(PROJECT_DRAFT_KEY);
  return current!==null?{key:PROJECT_DRAFT_KEY,raw:current}:{key:LEGACY_DRAFT_KEY,raw:storage.getItem(LEGACY_DRAFT_KEY)};
}
export function persistProjectDraft(storage:DraftStorage,draft:ProjectDraft,expected:DraftSnapshot,backup=false):DraftSnapshot {
  const current=readProjectDraft(storage);
  if(current.key!==expected.key||current.raw!==expected.raw)throw new Error("The saved brief changed in another tab. Reload to review it before saving again.");
  if(!safeProjectDraft(draft))throw new Error("Some brief fields are not supported. Export your working brief before leaving.");
  if(backup&&current.raw!==null) {
    // Keep the exact original, even if it is not JSON. If backup fails, do not replace it.
    storage.setItem(DRAFT_RECOVERY_KEY,JSON.stringify({schema:"mosque.build/draft-recovery@1",...current,savedAt:new Date().toISOString()}));
  }
  const raw=JSON.stringify(draft);storage.setItem(PROJECT_DRAFT_KEY,raw);
  return {key:PROJECT_DRAFT_KEY,raw};
}
export function initialDraftStep(draft:ProjectDraft,stored:string|null):number {
  const firstIncomplete=[!!(draft.name.trim()&&draft.location.trim()),!!(draft.needs.length&&draft.priorities.length),!!draft.constraints.length,!!(draft.owner.trim()&&draft.team.length&&draft.funding.length)].findIndex(done=>!done);
  const requested=stored!==null&&/^\d$/.test(stored)?Math.min(5,Number(stored)):0;
  return firstIncomplete<0?5:Math.min(requested,firstIncomplete);
}
