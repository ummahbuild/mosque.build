import Image from "next/image";
import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
type Frame={id:string;slug:string;title:string;source_file:string;asset_path:string;width:number;height:number;family:string;canonical_route:string;feature_tags:string[];related_renditions:string[]};
export function PrototypeFrame({frame}:{frame:Frame}){
 return <><SiteHeader/><div className="prototype">
  <main><p className="muted">Visual reference · {frame.family}</p><h1>{frame.title}</h1>
   <Image src={frame.asset_path} alt={frame.title} width={frame.width||1600} height={frame.height||1000} priority />
  </main>
  <aside><Link className="prototypeBack" href="/prototypes">← All screens</Link><h2>Implementation contract</h2><p><b>Canonical area</b><br/><code>{frame.canonical_route}</code></p>
   <h3>Feature tags</h3>{frame.feature_tags.map(x=><span className="pill" style={{margin:4}} key={x}>{x}</span>)}
   <h3>Rule</h3><p className="muted">Image text and numbers are illustrative. Production UI must use source-backed domain data and shared components.</p>
   {frame.related_renditions.length>0&&<><h3>Related renditions</h3><ul>{frame.related_renditions.map(x=><li key={x}>{x}</li>)}</ul></>}
  </aside>
 </div><SiteFooter/></>
}
