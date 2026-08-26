import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 201–300",description:"The third evidence-aware delivery batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(3);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 201–300</div><h1>Plan the next hundred without losing delivery truth.</h1><p className="heroLead">A third distinct set of canonical candidates with status and dependency filters, risk context, a private shortlist and structured planning export.</p><div className="heroActions"><Link className="button" href="/features/priority-400">Continue to records 301–400</Link><Link className="secondaryButton lightButton" href="/features/priority-200">Review records 101–200</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>201–300</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Risk-aware</b><span>dependencies and review gates</span></article><article><b>Exportable</b><span>structured local shortlist</span></article></div><div className="methodBox batchNotice"><b>Planning boundary</b><p>These are registry-backed candidates, not 100 production-ready claims. Canonical status, provenance burden and professional or authority gates remain explicit. Exported shortlists are planning artifacts and require delivery review.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={201}/></section></main><SiteFooter/></>}
