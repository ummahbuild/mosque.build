import registry from "../../../data/FEATURE_REGISTRY.json";
import type {PriorityFeature} from "@/components/priority-feature-explorer";

const relevant=/onboard|landing|pwa|offline|accessib|navigation|search|filter|brief|project|community|mobile|notification|install|dashboard|workspace|progress|export|share|language|locali|theme|contrast|keyboard|responsive/i;
const ranked=(items:typeof registry)=>items.sort((a,b)=>b.priority_score-a.priority_score||a.title.localeCompare(b.title));
const relevantCandidates=ranked(registry.filter(item=>relevant.test(`${item.title} ${item.description} ${item.domains.join(" ")}`)));
const relevantIds=new Set(relevantCandidates.map(item=>item.id));
const roadmapCandidates=ranked(registry.filter(item=>!relevantIds.has(item.id)));
const candidates=[...relevantCandidates,...roadmapCandidates];

export function getPriorityFeatureBatch(batch:number):PriorityFeature[]{const start=(batch-1)*100;return candidates.slice(start,start+100).map(item=>({id:item.id,title:item.title,description:item.description,domain:item.domains[0]||"platform",domains:item.domains,status:item.canonical_status,wave:item.recommended_wave,score:item.priority_score,professionalGate:item.requires_professional_or_authority_gate,external:item.uses_paid_or_external_services_likely,ai:item.uses_ai,sourceCount:item.source_refs.length,developmentComplexity:item.development_complexity,provenanceBurden:item.data_provenance_burden}))}
export const priorityCandidateCount=candidates.length;
export const pwaLandingCandidateCount=relevantCandidates.length;
