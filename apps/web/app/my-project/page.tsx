import {LocalProjectWorkspace} from "@/components/local-project-workspace";
import {ProjectProcessBoard} from "@/components/project-process-board";
import {ProjectControlCenter} from "@/components/project-control-center";
import {ProjectDataManager} from "@/components/project-data-manager";
import {ProjectRecordRegister} from "@/components/project-record-register";
import {ProjectSchedulePlanner} from "@/components/project-schedule-planner";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";

export const metadata={title:"My Local Project",description:"Continue a mosque.build project brief with a private, device-local action workspace.",robots:{index:false,follow:false}};

export default function Page(){return <><SiteHeader/><main className="projectWorkspacePage"><LocalProjectWorkspace/><div className="section"><ProjectDataManager/><ProjectControlCenter/><ProjectSchedulePlanner/><ProjectRecordRegister/><ProjectProcessBoard/></div></main><SiteFooter/></>}
