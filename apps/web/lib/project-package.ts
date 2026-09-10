export const PROJECT_PACKAGE_SCHEMA = "mosque.build/project-package@1";
export const PROJECT_PACKAGE_MAX_BYTES = 2_000_000;

export const projectSections = [
  {id:"brief", label:"Project brief", key:"mosque-build.project-draft.v2"},
  {id:"actions", label:"First actions", key:"mosque-build.project-progress.v1"},
  {id:"controls", label:"Project controls", key:"mosque-build.control-center.v1"},
  {id:"lifecycle", label:"Lifecycle checklist", key:"mosque-build.process-progress.v1"},
  {id:"patterns", label:"Pattern shortlist", key:"mosque-build.pattern-shortlist.v1"},
  {id:"architecture", label:"Architecture direction", key:"mosque-build.architecture-direction.v1"},
  {id:"architecturePrecedentBrief", label:"Architecture precedent brief", key:"mosque-build.architecture-precedent-brief.v1"},
  {id:"islamicArchitectureFramework", label:"Islamic architecture framework", key:"mosque-build.islamic-architecture-framework.v1"},
  {id:"design", label:"Design studio", key:"mosque-build.design-studio.v1"},
  {id:"schematic", label:"Schematic plan", key:"mosque-build.schematic-plan.v1"},
  {id:"resources", label:"Resource plan", key:"mosque-build.resource-plan.v1"},
  {id:"procurement", label:"Procurement workspace", key:"mosque-build.procurement.v1"},
  {id:"marketplaceCandidates", label:"Marketplace candidate shortlist", key:"mosque-build.marketplace-candidates.v1"},
  {id:"construction", label:"Construction log", key:"mosque-build.construction-log.v1"},
  {id:"records", label:"Decision + evidence register", key:"mosque-build.project-records.v1"},
  {id:"constructionPackage", label:"Construction package", key:"mosque-build.construction-package.v1"},
  {id:"socialArchitecture", label:"Social architecture study", key:"mosque-build.social-architecture.v1"},
  {id:"designIntelligence", label:"Masjid design intelligence", key:"mosque-build.masjid-intelligence.v1"}
  ,{id:"architecturalConsiderations", label:"Architectural considerations", key:"mosque-build.architectural-considerations.v1"}
  ,{id:"materialShortlist", label:"Material assembly shortlist", key:"mosque-build.material-shortlist.v1"}
  ,{id:"siteQiblaEvidence", label:"Site and qibla evidence", key:"mosque-build.site-qibla-evidence.v1"}
  ,{id:"climateResilience", label:"Climate resilience scenarios", key:"mosque-build.climate-resilience.v1"}
  ,{id:"solarDesign", label:"Solar and resilience design", key:"mosque-build.solar-design.v1"}
  ,{id:"prayerDaylight", label:"Prayer-time daylight study", key:"mosque-build.prayer-daylight.v1"}
  ,{id:"prayerOccupancy", label:"Prayer row and occupancy study", key:"mosque-build.prayer-occupancy.v1"}
  ,{id:"energyScenario", label:"Monthly energy scenarios", key:"mosque-build.energy-scenario.v1"}
  ,{id:"permitPathway", label:"Permit pathway", key:"mosque-build.permits-pathway.v1"}
  ,{id:"fundingPathway", label:"Funding pathway", key:"mosque-build.funding-pathway.v1"}
  ,{id:"quoteComparison", label:"Quote comparison", key:"mosque-build.quote-comparison.v1"}
  ,{id:"assetRegister", label:"Handover asset register", key:"mosque-build.asset-register.v1"}
  ,{id:"workOrders", label:"Operations work orders", key:"mosque-build.work-orders.v1"}
  ,{id:"emergencyReadiness", label:"Climate emergency readiness", key:"mosque-build.emergency-readiness.v1"}
  ,{id:"peoplePrivacy", label:"People privacy plan", key:"mosque-build.people-privacy.v1"}
  ,{id:"fieldSync", label:"Offline field sync history", key:"mosque-build.field-sync.v1"}
  ,{id:"projectSchedule", label:"Integrated project schedule", key:"mosque-build.project-schedule.v1"}
  ,{id:"roomProgram", label:"Versioned room program", key:"mosque-build.room-program.v1"}
  ,{id:"interiorStudy", label:"Interior and prayer floor study", key:"mosque-build.interior-study.v1"}
  ,{id:"knowledgeLibrary", label:"Knowledge library plan", key:"mosque-build.knowledge-library.v1"}
  ,{id:"interiorDecoration", label:"Interior decoration study", key:"mosque-build.interior-decoration.v1"}
  ,{id:"interiorSystems", label:"Interior systems and operations", key:"mosque-build.interior-systems.v1"}
  ,{id:"siteAccessEnvironment", label:"Site, access and environment study", key:"mosque-build.site-access-environment.v1"}
  ,{id:"wuduPlan", label:"Wudu and washroom coordination study", key:"mosque-build.wudu-plan.v1"}
  ,{id:"womensSpacePlan", label:"Women’s space and accessories study", key:"mosque-build.womens-space-plan.v1"}
  ,{id:"modelPlanning", label:"Three-dimensional model planning register", key:"mosque-build.model-planning.v1"}
  ,{id:"modelAuthoring", label:"Model authoring, views, options and measurements", key:"mosque-build.model-authoring.v1"}
  ,{id:"designTemplate", label:"Constraint-led mosque template study", key:"mosque-build.design-template.v1"}
  ,{id:"patternModel", label:"Parametric pattern model", key:"mosque-build.pattern-model.v1"}
  ,{id:"islamicGeometry", label:"Islamic geometry construction study", key:"mosque-build.islamic-geometry.v1"}
  ,{id:"architectureKit", label:"Architectural component kit", key:"mosque-build.architecture-kit.v1"}
  ,{id:"constructionControls", label:"Construction control register", key:"mosque-build.construction-controls.v1"}
  ,{id:"constructionDocumentControl", label:"Construction revision and review control", key:"mosque-build.construction-document-control.v1"}
  ,{id:"constructionSequence", label:"Construction sequence and compliance gates", key:"mosque-build.construction-sequence.v1"}
  ,{id:"siteAnalysis", label:"Site due-diligence analysis", key:"mosque-build.site-analysis.v1"}
  ,{id:"siteInvestigation", label:"Site investigation and hold-point plan", key:"mosque-build.site-investigation.v1"}
  ,{id:"materialSelection", label:"Material selection and site acceptance", key:"mosque-build.material-selection.v1"}
  ,{id:"floorPlanWorkspace", label:"Detailed floor-plan workspace", key:"mosque-build.floor-plan.v1"}
  ,{id:"projectPlanning", label:"Project planning workspace", key:"mosque-build.project-planning.v1"}
  ,{id:"bimView", label:"BIM coordination view settings", key:"mosque-build.bim-view.v1"}
  ,{id:"constructionDelivery", label:"Construction delivery plan", key:"mosque-build.construction-delivery.v1"}
  ,{id:"integratedSpacePlan", label:"Integrated space planning", key:"mosque-build.integrated-space-plan.v1"}
  ,{id:"shuraWorkspace", label:"Community decisions and shura", key:"mosque-build.shura-workspace.v1"}
  ,{id:"buildingSystems", label:"Building systems coordination", key:"mosque-build.building-systems.v1"}
  ,{id:"roofDesign", label:"Roof, dome and wind coordination", key:"mosque-build.roof-design.v1"}
  ,{id:"openingDesign", label:"Door, gate and opening coordination", key:"mosque-build.opening-design.v1"}
  ,{id:"ornamentalAssemblies", label:"Ornamental gate, screen and surface assemblies", key:"mosque-build.ornamental-assemblies.v1"}
  ,{id:"structuralFoundation", label:"Structural and foundation coordination", key:"mosque-build.structural-foundation.v1"}
  ,{id:"regionalMaterialCost", label:"Regional material cost plan", key:"mosque-build.regional-material-cost.v1"}
  ,{id:"costSavingRules", label:"Cost-control rule study", key:"mosque-build.cost-saving-rules.v1"}
  ,{id:"landCostStudy", label:"Land and site cost study", key:"mosque-build.land-cost-study.v1"}
  ,{id:"projectIntegrity", label:"Integrity, capability and value controls", key:"mosque-build.project-integrity.v1"}
  ,{id:"architectureFeaturePlan", label:"Architecture feature delivery plan", key:"mosque-build.architecture-feature-plan.v1"}
  ,{id:"siteContextAnalysis", label:"Qibla, terrain and flood analysis", key:"mosque-build.site-context-analysis.v1"}
  ,{id:"projectActionPlan", label:"Connected project action plan", key:"mosque-build.project-action-plan.v1"}
  ,{id:"costControlIntegration", label:"Cost-control coordination packet", key:"mosque-build.cost-control-integration.v1"}
  ,{id:"costOptionComparison", label:"Baseline and alternative cost comparisons", key:"mosque-build.cost-option-comparison.v1"}
  ,{id:"qiblaWallPerformance", label:"Qibla wall performance study", key:"mosque-build.qibla-wall-performance.v1"}
  ,{id:"conceptFeatureSelections", label:"Selected concept capabilities", key:"mosque-build.concept-features.v1"}
  ,{id:"domeDesign", label:"Dome architecture and construction study", key:"mosque-build.dome-design.v1"}
] as const;

export type ProjectSectionId = typeof projectSections[number]["id"];
export type ProjectPackage = {
  schema:string;
  exportedAt:string;
  privacy:"share-safe"|"full-local-backup";
  product:string;
  sections:Partial<Record<ProjectSectionId, unknown>>;
};

const sensitiveBriefFields = new Set(["email", "owner", "location", "notes", "address", "phone", "contact", "contactName", "contactEmail", "contactPhone"]);

function isRecord(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==="object"&&!Array.isArray(value)}
const forbiddenKeys=new Set(["__proto__","prototype","constructor"]);
function inspectJson(value:unknown,depth=0,budget={nodes:0}):string|null{
  budget.nodes+=1;
  if(budget.nodes>20_000)return "The package contains too many nested values.";
  if(depth>20)return "The package nesting depth exceeds the safety limit.";
  if(typeof value==="string"&&value.length>100_000)return "The package contains an oversized text value.";
  if(value===null||["string","number","boolean"].includes(typeof value))return null;
  if(Array.isArray(value)){for(const item of value){const error=inspectJson(item,depth+1,budget);if(error)return error}return null}
  if(!isRecord(value))return "The package contains a value that cannot be safely restored.";
  for(const [key,item] of Object.entries(value)){if(forbiddenKeys.has(key))return `The package contains a forbidden object key: ${key}.`;const error=inspectJson(item,depth+1,budget);if(error)return error}
  return null;
}

export function redactBrief(value:unknown,depth=0):unknown{
  if(depth>20)return null;
  if(Array.isArray(value))return value.map(item=>redactBrief(item,depth+1));
  if(!isRecord(value))return value;
  return Object.fromEntries(Object.entries(value).map(([field,item])=>sensitiveBriefFields.has(field)?[field,""]:[field,redactBrief(item,depth+1)]));
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
  if(typeof value.exportedAt!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value.exportedAt)||!Number.isFinite(Date.parse(value.exportedAt)))errors.push("The package export date is missing or invalid.");
  if(!isRecord(value.sections))errors.push("The package sections are missing or invalid.");
  if(errors.length)return {ok:false,errors};
  const allowed=new Set(projectSections.map(item=>item.id));
  const sections=Object.fromEntries(Object.entries(value.sections as Record<string,unknown>).filter(([id])=>allowed.has(id as ProjectSectionId))) as ProjectPackage["sections"];
  const ignored=Object.keys(value.sections as Record<string,unknown>).filter(id=>!allowed.has(id as ProjectSectionId));
  if(ignored.length)warnings.push(`${ignored.length} unknown ${ignored.length===1?"section was":"sections were"} ignored.`);
  if(!Object.keys(sections).length)errors.push("The package contains no supported project sections.");
  const unsafe=inspectJson(sections);if(unsafe)errors.push(unsafe);
  if(errors.length)return {ok:false,errors};
  if(value.privacy==="full-local-backup")warnings.push("This full backup may contain contact, location or project notes. Keep it private.");
  return {ok:true,data:{schema:PROJECT_PACKAGE_SCHEMA,exportedAt:value.exportedAt as string,privacy:value.privacy as ProjectPackage["privacy"],product:"mosque.build",sections},warnings};
}

export function restoreProjectPackage(data:ProjectPackage,write:(key:string,value:string)=>void){
  let restored=0;
  for(const section of projectSections){if(!(section.id in data.sections))continue;write(section.key,JSON.stringify(data.sections[section.id]));restored+=1}
  return restored;
}
