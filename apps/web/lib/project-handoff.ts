import {createProjectPackage,type ProjectPackage} from "./project-package";
import {type WorkflowSignal,workflowNodes} from "./workflow-integration";

export const PROJECT_HANDOFF_SCHEMA="mosque.build/project-handoff@1" as const;
export const PROJECT_HANDOFF_REGISTER_KEY="mosque-build.project-handoff.v1" as const;

export type HandoffProfileId="design-team"|"authority-review"|"cost-procurement"|"construction-coordination"|"operations-handover";
export type HandoffStatus="not-started"|"assembling"|"ready-for-review";
export type HandoffRequirement={nodeId:string;required:boolean;reason:string};
export type HandoffProfile={id:HandoffProfileId;label:string;recipient:string;purpose:string;requirements:HandoffRequirement[];reviewGate:string};
export type HandoffEvaluation={profile:HandoffProfile;status:HandoffStatus;readyCount:number;requiredCount:number;missingRequired:string[];stale:string[];dependencyGaps:string[];includedNodes:string[]};
export type HandoffRecord={id:string;profileId:HandoffProfileId;title:string;accountableRole:string;targetDate:string;notes:string;status:HandoffStatus;createdAt:string;updatedAt:string};
export type HandoffRegister={schema:typeof PROJECT_HANDOFF_SCHEMA;updatedAt:string;records:HandoffRecord[]};
export type HandoffPacket={schema:typeof PROJECT_HANDOFF_SCHEMA;exportedAt:string;product:"mosque.build";profile:HandoffProfile;status:HandoffStatus;evaluation:Omit<HandoffEvaluation,"profile">;boundary:string;projectPackage:ProjectPackage};

export const handoffProfiles:HandoffProfile[]=[
  {id:"design-team",label:"Design team brief",recipient:"Architect, planner or design reviewer",purpose:"Turn early project records into a focused design discussion packet.",reviewGate:"Professional and community review",requirements:[
    {nodeId:"brief",required:true,reason:"Define the community need, constraints and project decision context."},
    {nodeId:"siteAnalysis",required:true,reason:"Show site assumptions, evidence gaps and due-diligence questions."},
    {nodeId:"schematic",required:true,reason:"Provide provisional geometry, qibla and room relationships."},
    {nodeId:"roomProgram",required:true,reason:"Confirm uses, accessibility expectations and adjacency priorities."},
    {nodeId:"islamicArchitectureFramework",required:false,reason:"Carry worship, climate, craft and precedent decisions into design review."},
    {nodeId:"floorPlan",required:false,reason:"Add detailed spaces, openings and relationships when available."},
    {nodeId:"parametricBuilding",required:false,reason:"Carry editable building dimensions alongside the separately exported IFC geometry."},
    {nodeId:"materials",required:false,reason:"Share sample and assembly questions without implying specification approval."}
  ]},
  {id:"authority-review",label:"Authority pathway brief",recipient:"Permit adviser, authority liaison or code professional",purpose:"Collect likely approval pathway questions without presenting them as filings.",reviewGate:"Authority and professional review",requirements:[
    {nodeId:"brief",required:true,reason:"Explain scope and intended use."},
    {nodeId:"siteAnalysis",required:true,reason:"Show property, context and investigation assumptions."},
    {nodeId:"permit",required:true,reason:"Carry likely applicable requirements with source and verification status."},
    {nodeId:"floorPlan",required:true,reason:"Provide the current conceptual layout for review questions."},
    {nodeId:"buildingSystems",required:false,reason:"Expose MEP, fire, water and drainage coordination questions."},
    {nodeId:"structuralFoundation",required:false,reason:"Separate structural evidence gaps from design intent."},
    {nodeId:"openingDesign",required:false,reason:"Coordinate access, egress, gates and threshold questions."}
  ]},
  {id:"cost-procurement",label:"Cost and procurement brief",recipient:"Quantity surveyor, procurement lead or finance committee",purpose:"Connect quantities, sources and procurement choices before asking for quotes.",reviewGate:"Project-team and professional review",requirements:[
    {nodeId:"brief",required:true,reason:"State the scope and delivery assumptions behind the budget."},
    {nodeId:"regionalMaterialCost",required:true,reason:"Carry geography, currency, source date, confidence and exclusions."},
    {nodeId:"costRules",required:true,reason:"Show applicable cost-saving strategies and trade-offs."},
    {nodeId:"procurement",required:true,reason:"Prepare sourcing requirements before vendor comparison."},
    {nodeId:"materials",required:false,reason:"Include material acceptance and sample questions."},
    {nodeId:"projectIntegrity",required:false,reason:"Expose value, competition and conflict-control checks."},
    {nodeId:"schedule",required:false,reason:"Align long-lead items and procurement timing."}
  ]},
  {id:"construction-coordination",label:"Construction coordination brief",recipient:"Construction manager, clerk of works or contractor review team",purpose:"Move from design records into controlled work packages and site questions.",reviewGate:"Professional, contract and authority review",requirements:[
    {nodeId:"schedule",required:true,reason:"Connect activities, dependencies, owners and evidence gates."},
    {nodeId:"constructionControls",required:true,reason:"Track inspections, approvals, changes and risks."},
    {nodeId:"constructionDocumentControl",required:true,reason:"Keep revisions, purposes and review outcomes visible."},
    {nodeId:"constructionSequence",required:false,reason:"Map model elements to activities and compliance questions."},
    {nodeId:"floorPlan",required:true,reason:"Carry the current spatial baseline into construction review."},
    {nodeId:"materials",required:false,reason:"Share accepted samples and unresolved assembly questions."}
  ]},
  {id:"operations-handover",label:"Opening and operations brief",recipient:"Facilities, trustees or operations team",purpose:"Prepare commissioning, asset care, work orders and continuity planning.",reviewGate:"Project-team and professional review",requirements:[
    {nodeId:"assets",required:true,reason:"List assets, commissioning state, manuals, warranties and responsibilities."},
    {nodeId:"workOrders",required:true,reason:"Prepare maintenance and issue-closure routines."},
    {nodeId:"emergency",required:true,reason:"Set operating modes for hazards, outages, drills and recovery."},
    {nodeId:"buildingSystems",required:false,reason:"Carry systems context into maintenance planning."},
    {nodeId:"energyScenario",required:false,reason:"Share resilience and energy-use assumptions."},
    {nodeId:"peoplePrivacy",required:false,reason:"Keep staff and volunteer planning within minimum-data boundaries."}
  ]}
];

const nodeById=new Map(workflowNodes.map(node=>[node.id,node]));

export function emptyHandoffRegister(now=new Date().toISOString()):HandoffRegister{return{schema:PROJECT_HANDOFF_SCHEMA,updatedAt:now,records:[]}}
export function safeHandoffRegister(value:unknown):HandoffRegister{
  if(!value||typeof value!=="object"||Array.isArray(value))return emptyHandoffRegister();
  const source=value as Partial<HandoffRegister>,records=Array.isArray(source.records)?source.records.filter(isHandoffRecord).slice(0,50):[];
  return{schema:PROJECT_HANDOFF_SCHEMA,updatedAt:typeof source.updatedAt==="string"?source.updatedAt:new Date().toISOString(),records};
}
function isHandoffRecord(value:unknown):value is HandoffRecord{
  if(!value||typeof value!=="object"||Array.isArray(value))return false;
  const item=value as Record<string,unknown>;
  return typeof item.id==="string"&&handoffProfiles.some(profile=>profile.id===item.profileId)&&typeof item.title==="string"&&typeof item.accountableRole==="string"&&typeof item.targetDate==="string"&&typeof item.notes==="string"&&["not-started","assembling","ready-for-review"].includes(String(item.status))&&typeof item.createdAt==="string"&&typeof item.updatedAt==="string";
}
export function evaluateHandoff(profileId:HandoffProfileId,signals:WorkflowSignal[]):HandoffEvaluation{
  const profile=handoffProfiles.find(item=>item.id===profileId)??handoffProfiles[0],byId=new Map(signals.map(item=>[item.id,item]));
  const required=profile.requirements.filter(item=>item.required),missingRequired=required.filter(item=>byId.get(item.nodeId)?.state==="no-record"||!byId.has(item.nodeId)).map(item=>item.nodeId),stale=profile.requirements.filter(item=>byId.get(item.nodeId)?.stale).map(item=>item.nodeId),dependencyGaps=[...new Set(profile.requirements.flatMap(item=>byId.get(item.nodeId)?.dependencyGaps??[]))],includedNodes=profile.requirements.filter(item=>byId.get(item.nodeId)?.state!=="no-record").map(item=>item.nodeId),readyCount=required.length-missingRequired.length;
  const status:HandoffStatus=readyCount===0?"not-started":missingRequired.length||stale.length||dependencyGaps.length?"assembling":"ready-for-review";
  return{profile,status,readyCount,requiredCount:required.length,missingRequired,stale,dependencyGaps,includedNodes};
}
export function handoffNodeLabel(id:string){return nodeById.get(id)?.label??id}
export function createHandoffPacket(read:(key:string)=>string|null,profileId:HandoffProfileId,signals:WorkflowSignal[],now=new Date().toISOString()):HandoffPacket{
  const evaluation=evaluateHandoff(profileId,signals),{profile,...rest}=evaluation;
  return{schema:PROJECT_HANDOFF_SCHEMA,exportedAt:now,product:"mosque.build",profile,status:evaluation.status,evaluation:rest,boundary:"Conceptual local planning handoff only. This is not an authority submission, professional certification, construction instruction, cost guarantee, procurement award or approval.",projectPackage:createProjectPackage(read,"share-safe",now)};
}
