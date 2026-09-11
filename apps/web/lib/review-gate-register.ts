export const REVIEW_GATE_KEY="mosque-build.review-gates.v1";
export const REVIEW_GATE_SCHEMA="mosque.build/review-gates@1" as const;
export type ReviewOutcome="not-requested"|"preparing"|"submitted"|"changes-requested"|"accepted-user-record";
export type ReviewGateRecord={nodeId:string;outcome:ReviewOutcome;reviewerRole:string;evidenceRef:string;requestedAt:string;reviewedAt:string;validUntil:string;notes:string;updatedAt:string};
export type ReviewGateRegister={schema:typeof REVIEW_GATE_SCHEMA;status:"executable";records:ReviewGateRecord[];updatedAt:string};
const outcomes:ReviewOutcome[]=["not-requested","preparing","submitted","changes-requested","accepted-user-record"];
const text=(value:unknown,max=500)=>typeof value==="string"?value.trim().slice(0,max):"";
const date=(value:unknown)=>{const valueText=text(value,10);return /^\d{4}-\d{2}-\d{2}$/.test(valueText)&&Number.isFinite(Date.parse(`${valueText}T00:00:00Z`))?valueText:""};
export const blankReviewGateRegister=():ReviewGateRegister=>({schema:REVIEW_GATE_SCHEMA,status:"executable",records:[],updatedAt:""});
export function safeReviewGateRegister(value:unknown):ReviewGateRegister{
 if(!value||typeof value!=="object"||Array.isArray(value))return blankReviewGateRegister();const source=value as Record<string,unknown>;
 const allowedIds=new Set(workflowNodes.map(node=>node.id)),seen=new Set<string>(),records:ReviewGateRecord[]=[];
 for(const item of Array.isArray(source.records)?source.records.slice(0,workflowNodes.length):[]){if(!item||typeof item!=="object"||Array.isArray(item))continue;const row=item as Record<string,unknown>,nodeId=text(row.nodeId,80);if(!allowedIds.has(nodeId)||seen.has(nodeId))continue;seen.add(nodeId);records.push({nodeId,outcome:outcomes.includes(row.outcome as ReviewOutcome)?row.outcome as ReviewOutcome:"not-requested",reviewerRole:text(row.reviewerRole,120),evidenceRef:text(row.evidenceRef,500),requestedAt:date(row.requestedAt),reviewedAt:date(row.reviewedAt),validUntil:date(row.validUntil),notes:text(row.notes,1000),updatedAt:text(row.updatedAt,40)})}
 return{schema:REVIEW_GATE_SCHEMA,status:"executable",records,updatedAt:text(source.updatedAt,40)};
}
export function reviewRecord(register:ReviewGateRegister,nodeId:string):ReviewGateRecord{return register.records.find(record=>record.nodeId===nodeId)??{nodeId,outcome:"not-requested",reviewerRole:"",evidenceRef:"",requestedAt:"",reviewedAt:"",validUntil:"",notes:"",updatedAt:""}}
export function reviewGaps(node:WorkflowNode,record:ReviewGateRecord,now=""){
 const gaps:string[]=[];if(!record.reviewerRole)gaps.push("accountable reviewer role");if(!record.evidenceRef)gaps.push("evidence reference");
 if(["submitted","changes-requested","accepted-user-record"].includes(record.outcome)&&!record.requestedAt)gaps.push("request date");
 if(record.outcome==="accepted-user-record"&&!record.reviewedAt)gaps.push("review date");if(record.outcome==="changes-requested"&&!record.notes)gaps.push("requested changes");
 if(record.validUntil&&now&&record.validUntil<now)gaps.push("freshness review");if((node.reviewGate==="professional"||node.reviewGate==="authority")&&record.outcome==="accepted-user-record"&&!record.notes)gaps.push("scope and limitations note");return gaps;
}
export function reviewSummary(register:ReviewGateRegister,now=""){const rows=workflowNodes.map(node=>({node,record:reviewRecord(register,node.id)}));return{total:rows.length,notRequested:rows.filter(x=>x.record.outcome==="not-requested").length,preparing:rows.filter(x=>x.record.outcome==="preparing").length,submitted:rows.filter(x=>x.record.outcome==="submitted").length,changes:rows.filter(x=>x.record.outcome==="changes-requested").length,acceptedRecords:rows.filter(x=>x.record.outcome==="accepted-user-record"&&!reviewGaps(x.node,x.record,now).length).length,gaps:rows.filter(x=>reviewGaps(x.node,x.record,now).length).length};}
import {workflowNodes,type WorkflowNode} from "./workflow-integration";
