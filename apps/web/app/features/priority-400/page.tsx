import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 301–400",description:"The fourth evidence-aware batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(4);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 301–400</div><h1>Keep expanding the product without flattening evidence.</h1><p className="heroLead">A fourth distinct set of canonical candidates, connected to the same status, dependency, provenance, shortlist and export workflow.</p><div className="heroActions"><Link className="button" href="/features/priority-500">Continue to records 401–500</Link><Link className="secondaryButton lightButton" href="/features/priority-300">Review records 201–300</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>301–400</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Traceable</b><span>source counts and provenance burden</span></article><article><b>Reviewable</b><span>status and delivery gates preserved</span></article></div><div className="methodBox batchNotice"><b>Delivery boundary</b><p>These records remain at their canonical registry status. They are planning candidates, not claims that 100 production features shipped. External facts, regulated work and professional gates require current evidence and qualified review.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={301}/></section></main><SiteFooter/></>}
