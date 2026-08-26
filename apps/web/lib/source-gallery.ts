import v0 from "../../../archive/source-seeds/mosqueos_seed_v0/sources.json";
import v4 from "../../../archive/source-seeds/mosqueos_seed_v4_adaptive_reuse/SOURCES.json";
import v5 from "../../../archive/source-seeds/mosqueos_seed_v5_procurement_build_control/SOURCES.json";
import v6 from "../../../archive/source-seeds/mosqueos_seed_v6_costs_scenarios/SOURCES.json";
import v7 from "../../../archive/source-seeds/mosqueos_seed_v7_completeness/SOURCES.json";
import v21 from "../../../archive/source-seeds/mosqueos_seed_v21_islamic_architecture_design/SOURCES.json";
import partnerQueue from "../../../archive/source-seeds/mosqueos_seed_v13_global_vendors/GLOBAL_VENDOR_INGESTION_BACKLOG.json";
import type {PartnerBrief,SourceRecord} from "@/components/source-partner-gallery";

const groups=[
  ["archive/source-seeds/mosqueos_seed_v0/sources.json",v0],
  ["archive/source-seeds/mosqueos_seed_v4_adaptive_reuse/SOURCES.json",v4],
  ["archive/source-seeds/mosqueos_seed_v5_procurement_build_control/SOURCES.json",v5],
  ["archive/source-seeds/mosqueos_seed_v6_costs_scenarios/SOURCES.json",v6],
  ["archive/source-seeds/mosqueos_seed_v7_completeness/SOURCES.json",v7],
  ["archive/source-seeds/mosqueos_seed_v21_islamic_architecture_design/SOURCES.json",v21],
] as const;

const words=(value:unknown)=>Array.isArray(value)?value.map(String):value?[String(value)]:[];
export const sourceRecords:SourceRecord[]=groups.flatMap(([sourceFile,items])=>(items as unknown as Array<Record<string,unknown>>).map(item=>({id:String(item.id),name:String(item.name),url:String(item.url),status:String(item.status||item.review_status||"recorded"),type:String(item.type||item.domain||item.jurisdiction||"general"),uses:words(item.use||item.topics||item.scope||item.production_use),rightsNote:String(item.rights_note||item.note||"Rights and current applicability require review."),sourceFile})));
export const partnerBriefs:PartnerBrief[]=(partnerQueue as Array<Record<string,unknown>>).map(item=>({id:String(item.id),region:String(item.region),category:String(item.category_family),targetCount:Number(item.target_vendor_records),status:String(item.status),required:String(item.required),sourceFile:"archive/source-seeds/mosqueos_seed_v13_global_vendors/GLOBAL_VENDOR_INGESTION_BACKLOG.json"}));
