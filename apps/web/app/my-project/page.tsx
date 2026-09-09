import {LocalProjectWorkspace} from "@/components/local-project-workspace";
import {ProjectProcessBoard} from "@/components/project-process-board";
import {ProjectControlCenter} from "@/components/project-control-center";
import {ProjectDataManager} from "@/components/project-data-manager";
import {ProjectRecordRegister} from "@/components/project-record-register";
import {ProjectSchedulePlanner} from "@/components/project-schedule-planner";
import {ProjectIntegrationHub} from "@/components/project-integration-hub";
import {ProjectPlanningWorkspace} from "@/components/project-planning-workspace";
import {MyProjectContents} from "@/components/my-project-contents";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";

export const metadata={title:"My Local Project",description:"Continue a mosque.build project brief with a private, device-local action workspace.",robots:{index:false,follow:false}};

export default function Page(){return <><SiteHeader/><main className="projectWorkspacePage"><div id="project-action-plan" className="projectContentsTarget"><LocalProjectWorkspace/></div><div className="section"><MyProjectContents/><div id="connected-project-map" className="projectContentsTarget"><ProjectIntegrationHub/></div><div id="project-controls" className="projectContentsTarget"><ProjectControlCenter/></div><div id="project-planning" className="projectContentsTarget"><ProjectPlanningWorkspace/></div><div id="project-schedule" className="projectContentsTarget"><ProjectSchedulePlanner/></div><div id="project-records" className="projectContentsTarget"><ProjectRecordRegister/></div><div id="project-lifecycle" className="projectContentsTarget"><ProjectProcessBoard/></div><div id="project-data" className="projectContentsTarget"><ProjectDataManager/></div></div></main><SiteFooter/></>}
