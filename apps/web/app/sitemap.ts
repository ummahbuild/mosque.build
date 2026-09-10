import type {MetadataRoute} from "next";

export default function sitemap():MetadataRoute.Sitemap{
  const base="https://mosque.build";
  const paths=["","/features","/features/priority-100","/features/priority-200","/features/priority-300","/features/priority-400","/features/priority-500","/features/priority-600","/features/priority-700","/features/priority-800","/sources","/roadmap","/start","/design","/patterns","/permits","/funding","/marketplace","/construction","/operations","/waqf-library","/resources","/pwa-guide","/methodology","/trust","/privacy","/terms","/accessibility","/prototypes","/open-source","/contribute"];
  return paths.map((path,index)=>({url:base+path,changeFrequency:index===0?"weekly":"monthly",priority:index===0?1:path==="/start"?.9:.7}));
}
