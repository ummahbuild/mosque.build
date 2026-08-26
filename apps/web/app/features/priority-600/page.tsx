import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch,priorityCandidateCount} from "@/lib/priority-features";

export const metadata={title:"Priority Feature Batch 501–600",description:"The sixth evidence-aware batch of 100 prioritized mosque.build website and project capabilities."};
const batch=getPriorityFeatureBatch(6);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 501–600</div><h1>Turn another hundred ideas into reviewable delivery records.</h1><p className="heroLead">The sixth distinct canonical batch keeps search, filters, dependencies, status, provenance burden, private shortlists and structured exports connected.</p><div className="heroActions"><Link className="button" href="/features/priority-700">Continue to records 601–700</Link><Link className="secondaryButton lightButton" href="/features/priority-500">Review records 401–500</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>501–600</b><span>distinct canonical records</span></article><article><b>{priorityCandidateCount}</b><span>eligible registry candidates</span></article><article><b>Searchable</b><span>status, wave and dependency filters</span></article><article><b>Portable</b><span>local shortlist and structured export</span></article></div><div className="methodBox batchNotice"><b>Delivery boundary</b><p>These are prioritized registry records, not claims that 100 production-ready features shipped. Canonical status, provenance burden, external dependencies and professional or authority review gates remain visible.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={501}/></section></main><SiteFooter/></>}
