import Link from "next/link";
import type {ReactNode} from "react";
import {InteractiveAreaPreview} from "./interactive-area-preview";
import {SiteFooter} from "./site-footer";
import {SiteHeader} from "./site-header";

type Area={slug:string;eyebrow:string;title:string;summary:string;features:string[];cta:string};

export function ProductAreaPage({area,insert}:{area:Area;insert?:ReactNode}){
  return <><SiteHeader/><main>
    <section className="areaHero"><div><div className="eyebrow gold">{area.eyebrow}</div><h1>{area.title}</h1><p className="heroLead">{area.summary}</p><div className="heroActions"><Link className="button" href="/start">{area.cta} ↗</Link><Link className="secondaryButton lightButton" href={area.slug==="design"?"/patterns":"/prototypes"}>{area.slug==="design"?"Explore pattern studies":"See visual references"}</Link></div></div><InteractiveAreaPreview area={area}/></section>
    <section className="section"><div className="eyebrow dark">WHAT YOU CAN WORK THROUGH</div><h2>Take one clear decision at a time.</h2><div className="featureListGrid">{area.features.map((feature,index)=><article key={feature}><span>{String(index+1).padStart(2,"0")}</span><h3>{feature}</h3><p>Keep the question, responsible person, supporting information and next action together as your project develops.</p></article>)}</div></section>
    <section className="ctaSection"><div className="ctaInner"><div className="eyebrow gold">START WITH THE PROJECT</div><h2>Build the brief first. Let the workflow deepen as the mosque becomes real.</h2><p>mosque.build keeps simple community decisions understandable while exposing professional detail when architects, engineers, planners, suppliers and contractors join.</p><Link className="button" href="/start">Start your project ↗</Link></div></section>
    {insert?<section className="section">{insert}</section>:null}
  </main><SiteFooter/></>;
}
