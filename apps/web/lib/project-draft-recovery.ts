export const PROJECT_DRAFT_KEY="mosque-build.project-draft.v2";
export type DraftRead={status:"empty"|"valid"|"invalid";draft:Record<string,unknown>|null;raw:string|null;reason?:string};
const strings=["name","type","location","stage","land","attendance","budget","currency","timeline","governance","owner","notes","email"];
const lists=["needs","priorities","constraints","team","funding"];
export function inspectProjectDraft(raw:string|null):DraftRead{
 if(raw===null)return{status:"empty",draft:null,raw:null};
 if(raw.length>200_000)return{status:"invalid",draft:null,raw,reason:"The draft is larger than the supported 200 KB limit."};
 try{
  const v:unknown=JSON.parse(raw);
  if(!v||typeof v!=="object"||Array.isArray(v))return{status:"invalid",draft:null,raw,reason:"The draft is not a project object."};
  const record=v as Record<string,unknown>;
  for(const k of strings)if(k in record&&(typeof record[k]!=="string"||(record[k] as string).length>10000))return{status:"invalid",draft:null,raw,reason:`Invalid field: ${k}`};
  for(const k of lists)if(k in record&&(!Array.isArray(record[k])||(record[k] as unknown[]).length>100||(record[k] as unknown[]).some(item=>typeof item!=="string"||item.length>500)))return{status:"invalid",draft:null,raw,reason:`Invalid list: ${k}`};
  return{status:"valid",draft:record,raw};
 }catch{return{status:"invalid",draft:null,raw,reason:"The saved draft is not valid JSON."}}
}
export function safeDraftDownload(raw:string){const blob=new Blob([raw],{type:"application/json"});const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="mosque-build-unmodified-draft-backup.json";anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
