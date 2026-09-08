import type {Metadata} from "next";
import {ArchitectureLineageExplorer} from "@/components/architecture-lineage-explorer";
import {PatternGallery} from "@/components/pattern-gallery";
import {MaterialAssemblyLibrary} from "@/components/material-assembly-library";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";

export const metadata:Metadata={title:"Pattern + material studies",description:"Explore and shortlist source-labelled geometric, material and spatial studies for mosque project conversations."};

export default function PatternsPage(){return <><SiteHeader/><main><section className="patternHero"><div className="eyebrow gold">ARCHITECTURE + PATTERN STUDIES</div><h1>Build from lineage, place and purpose.</h1><p>Study spatial traditions before selecting surface geometry. Compare how structure, climate, craft and worship shaped different mosque lineages, then shortlist pattern studies with their sources and review questions intact.</p><div className="heroActions"><a className="button" href="#architecture">Compare lineages ↓</a><a className="secondaryButton lightButton" href="/design">Open Design Studio</a></div></section><section className="section" id="architecture"><ArchitectureLineageExplorer/></section><section className="section patternLibrarySection" id="library"><header className="sectionHeading"><span className="eyebrow">PATTERN APPLICATIONS</span><h2>Move from precedent to a buildable study.</h2><p>Every diagram is an original abstraction paired with a documented context, suitable applications and questions for specialists.</p></header><PatternGallery/></section><section className="section" id="materials"><MaterialAssemblyLibrary/></section></main><SiteFooter/></>}
