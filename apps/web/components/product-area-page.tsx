import Link from "next/link";
import type {ReactNode} from "react";
import {InteractiveAreaPreview} from "./interactive-area-preview";
import {SiteFooter} from "./site-footer";
import {SiteHeader} from "./site-header";
import {WorkspaceToolNavigator} from "./workspace-tool-navigator";

type Area={slug:string;eyebrow:string;title:string;summary:string;features:string[];cta:string};

export function ProductAreaPage({area,insert}:{area:Area;insert?:ReactNode}){
  return <><SiteHeader/><main>
    <section className={`areaHero${insert?" hasWorkspace":""}`}><div><div className="eyebrow gold">{area.eyebrow}</div><h1>{area.title}</h1><p className="heroLead">{area.summary}</p><div className="heroActions"><Link className="button" href={insert?"#workspace":"/start"}>{insert?"Open workspace":area.cta}</Link><Link className="secondaryButton lightButton" href={area.slug==="design"?"/patterns":"/prototypes"}>{area.slug==="design"?"Explore pattern studies":"See visual references"}</Link></div></div><InteractiveAreaPreview area={area}/></section>
    {insert?<nav className="workspaceNav" aria-label={`${area.eyebrow.toLowerCase()} page sections`}><a href="#workspace">Workspace</a><a href="#capabilities">What you can do</a><a href="#project-brief">Project brief</a></nav>:null}
    {insert?<section className="section workspaceSection" id="workspace"><div className="workspaceSectionIntro"><div className="eyebrow dark">WORKING TOOLS</div><h2>Continue the work saved on this device.</h2><p>Changes persist locally and can be included in a whole-project export. Review boundaries remain attached to each tool.</p></div><WorkspaceToolNavigator/>{insert}</section>:null}
    <section className="section capabilitySection" id="capabilities"><div className="eyebrow dark">WORKSPACE COVERAGE</div><h2>See what this part of the project connects.</h2><div className="featureListGrid compactFeatureGrid">{area.features.map((feature,index)=><article key={feature}><span>{String(index+1).padStart(2,"0")}</span><h3>{feature}</h3></article>)}</div></section>
    <section className="ctaSection" id="project-brief"><div className="ctaInner"><div className="eyebrow gold">PROJECT FOUNDATION</div><h2>Keep every tool connected to an accountable project brief.</h2><p>Review community needs, location, decision roles, constraints and professional appointments as the project develops.</p><Link className="button" href="/start">Review project brief</Link></div></section>
  </main><SiteFooter/></>;
}
