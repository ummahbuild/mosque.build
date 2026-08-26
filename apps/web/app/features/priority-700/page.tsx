import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 601–700",description:"The seventh evidence-aware batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(7);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 601–700</div><h1>Carry the next hundred into accountable planning.</h1><p className="heroLead">The seventh distinct canonical batch stays searchable, filterable, locally shortlistable and exportable while preserving delivery status and review boundaries.</p><div className="heroActions"><Link className="button" href="/features/priority-600">Review records 501–600</Link><Link className="secondaryButton lightButton" href="/my-project">Continue my local project</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>601–700</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Comparable</b><span>shared delivery and evidence fields</span></article><article><b>Actionable</b><span>local shortlist and planning export</span></article></div><div className="methodBox batchNotice"><b>Delivery boundary</b><p>These are prioritized registry records, not claims that 100 production-ready features shipped. Canonical status, source burden, external dependencies and professional or authority review gates remain explicit.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={601}/></section></main><SiteFooter/></>}
