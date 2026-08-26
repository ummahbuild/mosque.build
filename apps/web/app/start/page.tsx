import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {StartProjectWizardLoader} from "@/components/start-project-wizard-loader";

export const metadata={title:"Start a Mosque Project"};

export default function Page(){return <><SiteHeader/><main className="startPage"><div className="startIntro"><div className="eyebrow dark">GUIDED START</div><h1>Start with the questions that change the project.</h1><p>Do not begin with a dome, rendering or fundraising number. Begin with community need, location, site reality, capacity, constraints and what you need to decide next.</p></div><StartProjectWizardLoader/></main><SiteFooter/></>}
