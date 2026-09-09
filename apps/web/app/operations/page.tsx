import areas from "@/data/product-areas.json";
import {EmergencyContinuityOverview} from "@/components/emergency-continuity-overview";
import {EmergencyReadinessWorkspace} from "@/components/emergency-readiness-workspace";
import {OperationsWorkspace} from "@/components/operations-workspace";
import {PeoplePrivacyWorkspace} from "@/components/people-privacy-workspace";
import {ProductAreaPage} from "@/components/product-area-page";
import {WorkOrderWorkspace} from "@/components/work-order-workspace";

export const metadata={title:"Opening and operations workspace",description:"Build a device-local handover, maintenance and emergency-continuity plan."};
export default function Page(){const area=areas.find(item=>item.slug==="operations")!;return <ProductAreaPage area={area} insert={<><OperationsWorkspace/><WorkOrderWorkspace/><PeoplePrivacyWorkspace/><EmergencyContinuityOverview/><EmergencyReadinessWorkspace/></>}/>}
