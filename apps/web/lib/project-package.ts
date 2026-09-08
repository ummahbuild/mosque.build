export const PROJECT_PACKAGE_SCHEMA = "mosque.build/project-package@1";
export const PROJECT_PACKAGE_MAX_BYTES = 2_000_000;

export const projectSections = [
  {id:"brief", label:"Project brief", key:"mosque-build.project-draft.v2"},
  {id:"actions", label:"First actions", key:"mosque-build.project-progress.v1"},
  {id:"controls", label:"Project controls", key:"mosque-build.control-center.v1"},
  {id:"lifecycle", label:"Lifecycle checklist", key:"mosque-build.process-progress.v1"},
  {id:"patterns", label:"Pattern shortlist", key:"mosque-build.pattern-shortlist.v1"},
  {id:"architecture", label:"Architecture direction", key:"mosque-build.architecture-direction.v1"},
  {id:"design", label:"Design studio", key:"mosque-build.design-studio.v1"},
  {id:"schematic", label:"Schematic plan", key:"mosque-build.schematic-plan.v1"},
  {id:"resources", label:"Resource plan", key:"mosque-build.resource-plan.v1"},
  {id:"procurement", label:"Procurement workspace", key:"mosque-build.procurement.v1"},
  {id:"construction", label:"Construction log", key:"mosque-build.construction-log.v1"},
  {id:"records", label:"Decision + evidence register", key:"mosque-build.project-records.v1"}
] as const;

export type ProjectSectionId = typeof projectSections[number]["id"];
export type ProjectPackage = {
  schema:string;
  exportedAt:string;
  privacy:"share-safe"|"full-local-backup";
  product:string;
  sections:Partial<Record<ProjectSectionId, unknown>>;
};

const sensitiveBriefFields = new Set(["email", "owner", "location", "notes"]);

function isRecord(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==="object"&&!Array.isArray(value)}

export function redactBrief(value:unknown){
  if(!isRecord(value))return value;
  return Object.fromEntries(Object.entries(value).map(([field,item])=>sensitiveBriefFields.has(field)?[field,""]:[field,item]));
}

export function createProjectPackage(read:(key:string)=>string|null,privacy:ProjectPackage["privacy"],now=new Date().toISOString()):ProjectPackage{
  const sections:ProjectPackage["sections"]={};
  for(const section of projectSections){
    const raw=read(section.key);
    if(!raw)continue;
    try{const parsed:unknown=JSON.parse(raw);sections[section.id]=privacy==="share-safe"&&section.id==="brief"?redactBrief(parsed):parsed}catch{}
  }
  return {schema:PROJECT_PACKAGE_SCHEMA,exportedAt:now,privacy,product:"mosque.build",sections};
}

export function validateProjectPackage(value:unknown):{ok:true;data:ProjectPackage;warnings:string[]}|{ok:false;errors:string[]}{
  const errors:string[]=[];const warnings:string[]=[];
  if(!isRecord(value))return {ok:false,errors:["The selected file does not contain a project package object."]};
  if(value.schema!==PROJECT_PACKAGE_SCHEMA)errors.push(`Unsupported schema. Expected ${PROJECT_PACKAGE_SCHEMA}.`);
  if(value.product!=="mosque.build")errors.push("This file is not identified as a mosque.build project package.");
  if(value.privacy!=="share-safe"&&value.privacy!=="full-local-backup")errors.push("The package privacy mode is missing or invalid.");
  if(typeof value.exportedAt!=="string"||!/^\d{4}-\d{2}-\d{2}T/.test(value.exportedAt))errors.push("The package export date is missing or invalid.");
  if(!isRecord(value.sections))errors.push("The package sections are missing or invalid.");
  if(errors.length)return {ok:false,errors};
  const allowed=new Set(projectSections.map(item=>item.id));
  const sections=Object.fromEntries(Object.entries(value.sections as Record<string,unknown>).filter(([id])=>allowed.has(id as ProjectSectionId))) as ProjectPackage["sections"];
  const ignored=Object.keys(value.sections as Record<string,unknown>).filter(id=>!allowed.has(id as ProjectSectionId));
  if(ignored.length)warnings.push(`${ignored.length} unknown ${ignored.length===1?"section was":"sections were"} ignored.`);
  if(!Object.keys(sections).length)errors.push("The package contains no supported project sections.");
  if(errors.length)return {ok:false,errors};
  if(value.privacy==="full-local-backup")warnings.push("This full backup may contain contact, location or project notes. Keep it private.");
  return {ok:true,data:{schema:PROJECT_PACKAGE_SCHEMA,exportedAt:value.exportedAt as string,privacy:value.privacy as ProjectPackage["privacy"],product:"mosque.build",sections},warnings};
}

export function restoreProjectPackage(data:ProjectPackage,write:(key:string,value:string)=>void){
  let restored=0;
  for(const section of projectSections){if(!(section.id in data.sections))continue;write(section.key,JSON.stringify(data.sections[section.id]));restored+=1}
  return restored;
}
