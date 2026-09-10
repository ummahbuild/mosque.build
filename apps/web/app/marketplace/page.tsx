import {MarketplaceCandidateCatalog} from "@/components/marketplace-candidate-catalog";
import {ProcurementWorkspace} from "@/components/procurement-workspace";
import {ProjectIntegrityWorkbench} from "@/components/project-integrity-workbench";
import {ProductAreaPage} from "@/components/product-area-page";
import areas from "@/data/product-areas.json";
export const metadata={title:"Source + procurement workspace",description:"Compare sourced records and prepare a project procurement brief without implying availability, approval or a quote."};
export default function Page(){const area=areas.find(item=>item.slug==="marketplace")!;return <ProductAreaPage area={area} insert={<><ProcurementWorkspace/><ProjectIntegrityWorkbench compact/><MarketplaceCandidateCatalog/></>}/>}
