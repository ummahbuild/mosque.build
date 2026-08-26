import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {PriorityFeatureExplorerLoader} from "@/components/priority-feature-explorer-loader";
import {getPriorityFeatureBatch} from "@/lib/priority-features";

export const metadata={title:"Priority 100 Feature Batch",description:"An evidence-aware, filterable delivery batch of 100 prioritized mosque.build capabilities."};
const batch=getPriorityFeatureBatch(1);

export default function Page(){return <><SiteHeader/><main><section className="areaHero priorityHero"><div><div className="eyebrow gold">DELIVERY BATCH · RECORDS 1–100</div><h1>Turn the backlog into a reviewable product surface.</h1><p className="heroLead">The first 100 prioritized website, installation, accessibility, project and community capabilities from the product roadmap.</p><div className="heroActions"><Link className="button" href="/features/priority-200">Continue to records 101–200</Link><Link className="secondaryButton lightButton" href="/roadmap">See the full roadmap</Link></div></div></section><section className="section"><div className="batchPrinciples"><article><b>100</b><span>roadmap records</span></article><article><b>Searchable</b><span>title, detail and area</span></article><article><b>Works offline</b><span>saved pages + local shortlist</span></article><article><b>Evidence-aware</b><span>sources and review needs</span></article></div><div className="methodBox batchNotice"><b>How to read this page</b><p>“Documented” means the intended behavior is described; it does not mean the capability is available. External facts still need sources and freshness. Professional or authority review remains visible. Your shortlist stays in this browser and is not submitted.</p></div><PriorityFeatureExplorerLoader features={batch} startIndex={1}/></section></main><SiteFooter/></>}
