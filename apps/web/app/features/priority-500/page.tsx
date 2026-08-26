import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 401–500",description:"The fifth evidence-aware batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(5);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 401–500</div><h1>Advance the next hundred with the same delivery discipline.</h1><p className="heroLead">The fifth distinct canonical batch keeps status, dependencies, provenance burden, local shortlists and exportable planning records visible.</p><div className="heroActions"><Link className="button" href="/features/priority-600">Continue to records 501–600</Link><Link className="secondaryButton lightButton" href="/features/priority-400">Review records 301–400</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>401–500</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Local-first</b><span>private shortlist and export</span></article><article><b>Gate-aware</b><span>status and dependencies preserved</span></article></div><div className="methodBox batchNotice"><b>Delivery boundary</b><p>These are executable backlog-review records, not 100 production-ready feature claims. External facts, costs, safety, permits and professional work still require current source evidence and qualified review.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={401}/></section></main><SiteFooter/></>}
