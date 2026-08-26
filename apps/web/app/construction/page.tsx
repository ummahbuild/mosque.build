import {ConstructionLog} from "@/components/construction-log";import {ProductAreaPage} from "@/components/product-area-page";import areas from "@/data/product-areas.json";
export const metadata={title:"Construction progress workspace",description:"Capture device-local construction updates while preserving evidence and review boundaries."};
export default function Page(){const area=areas.find(item=>item.slug==="construction")!;return <ProductAreaPage area={area} insert={<ConstructionLog/>}/>}
