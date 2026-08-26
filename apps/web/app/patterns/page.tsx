import type {Metadata} from "next";
import {PatternGallery} from "@/components/pattern-gallery";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";

export const metadata:Metadata={title:"Pattern + material studies",description:"Explore and shortlist source-labelled geometric, material and spatial studies for mosque project conversations."};

export default function PatternsPage(){return <><SiteHeader/><main><section className="patternHero"><div className="eyebrow gold">DESIGN STUDY LIBRARY</div><h1>Explore patterns as decisions, not decoration.</h1><p>Compare geometric, material and spatial modules, save useful studies on this device, and carry their review questions into your project. These are original conceptual diagrams—not products, sacred calligraphy, performance evidence or professional specifications.</p><div className="heroActions"><a className="button" href="#library">Explore studies ↓</a><a className="secondaryButton lightButton" href="/design">Open Design Studio</a></div></section><section className="section" id="library"><PatternGallery/></section></main><SiteFooter/></>}
