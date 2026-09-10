import Link from "next/link";
import type {ReactNode} from "react";
import {InteractiveAreaPreview} from "./interactive-area-preview";
import {SiteFooter} from "./site-footer";
import {SiteHeader} from "./site-header";
import {WorkspaceToolNavigator} from "./workspace-tool-navigator";
import {ProjectJourneyNav, type JourneyStage} from "./project-journey-nav";

type Area={slug:string;eyebrow:string;title:string;summary:string;features:string[];cta:string};

export function ProductAreaPage({area,insert}:{area:Area;insert?:ReactNode}){
  const stageByArea:Record<string,JourneyStage>={design:"Design",marketplace:"Approve + resource",construction:"Build",operations:"Open + care",permits:"Approve + resource",funding:"Approve + resource"};
  return <><SiteHeader/><main>
    <section className={`areaHero${insert?" hasWorkspace":""}`}><div><div className="eyebrow gold">{area.eyebrow}</div><h1>{area.title}</h1><p className="heroLead">{area.summary}</p><div className="heroActions"><Link className="button" href={insert?"#workspace":"/start"}>{insert?"Open workspace":area.cta}</Link><Link className="secondaryButton lightButton" href={area.slug==="design"?"/patterns":"/prototypes"}>{area.slug==="design"?"Explore pattern studies":"See visual references"}</Link></div></div><InteractiveAreaPreview area={area}/></section>
    <ProjectJourneyNav current={stageByArea[area.slug]||"Define"} context={area.eyebrow}/>
    {insert?<nav className="workspaceNav" aria-label={`${area.eyebrow.toLowerCase()} page sections`}><a href="#workspace">Start planning</a><a href="#capabilities">What you can do</a><a href="#project-brief">Project brief</a></nav>:null}
    {insert?<section className="section workspaceSection" id="workspace"><div className="workspaceSectionIntro"><div className="eyebrow dark">YOUR PLANNING SPACE</div><h2>Pick up where you left off.</h2><p>Your changes stay in this browser until you export them. Each planning step shows what still needs confirmation by your team, an authority or a qualified professional.</p></div><WorkspaceToolNavigator/>{insert}</section>:null}
    <section className="section capabilitySection" id="capabilities"><div className="eyebrow dark">WHAT YOU CAN PLAN HERE</div><h2>Keep related decisions together.</h2><div className="featureListGrid compactFeatureGrid">{area.features.map((feature,index)=><article key={feature}><span>{String(index+1).padStart(2,"0")}</span><h3>{feature}</h3></article>)}</div></section>
    <section className="ctaSection" id="project-brief"><div className="ctaInner"><div className="eyebrow gold">YOUR PROJECT BRIEF</div><h2>Give every decision a clear purpose.</h2><p>Keep community needs, location, responsibilities, constraints and professional support up to date as the project develops.</p><Link className="button" href="/start">Review my brief</Link></div></section>
  </main><SiteFooter/></>;
}
