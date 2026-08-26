import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 101–200",description:"The second evidence-aware delivery batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(2);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero batchTwoHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 101–200</div><h1>Keep turning specification into accountable delivery.</h1><p className="heroLead">A distinct second set of 100 canonical candidates. Filters are URL-shareable, view density is adjustable, and shortlists remain private to this browser.</p><div className="heroActions"><Link className="button" href="/features/priority-300">Continue to records 201–300</Link><Link className="secondaryButton lightButton" href="/features/priority-100">Review records 1–100</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>101–200</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Shareable</b><span>filter state in the URL</span></article><article><b>Private</b><span>device-only shortlist</span></article></div><div className="methodBox batchNotice"><b>Delivery truth</b><p>This batch advances backlog review and discovery functionality. It does not relabel underlying records as executable or production-ready. Review source, freshness, safety and professional gates before use.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={101}/></section></main><SiteFooter/></>}
