export const CONSTRUCTION_LOG_EXPORT_SCHEMA="mosque.build/construction-log@2";
export type SiteEntry={id:string;date:string;area:string;type:string;progress:number;note:string;evidence:string;review:"unreviewed"|"reviewed"};
export type ConstructionLogFilters={query:string;type:string;review:"all"|SiteEntry["review"];evidence:"all"|"with"|"missing";sort:"newest"|"oldest"|"progress-high"|"progress-low"};
export type ConstructionLogDraft=Omit<SiteEntry,"id"|"review">;
const day=/^\d{4}-\d{2}-\d{2}$/;
const clean=(value:string)=>value.trim().replace(/\s+/g," ");
const validDay=(value:string)=>{if(!day.test(value))return false;const parsed=new Date(`${value}T00:00:00Z`);return !Number.isNaN(parsed.valueOf())&&parsed.toISOString().slice(0,10)===value};

export function constructionDraftErrors(draft:ConstructionLogDraft,today=new Date().toISOString().slice(0,10)){
  const errors:string[]=[];
  if(!validDay(draft.date))errors.push("Choose a valid observation date.");
  else if(draft.date>today)errors.push("A factual site update cannot use a future observation date.");
  if(!clean(draft.area))errors.push("Choose or enter an area.");
  if(!clean(draft.type))errors.push("Choose an update type.");
  if(!Number.isFinite(draft.progress)||draft.progress<0||draft.progress>100)errors.push("Reported progress must be between 0 and 100 percent.");
  if(clean(draft.note).length<8)errors.push("Add a factual note of at least 8 characters.");
  if(draft.note.length>2000)errors.push("Keep the factual note within 2,000 characters.");
  if(draft.evidence.length>1000)errors.push("Keep the evidence reference within 1,000 characters.");
  return errors;
}
export function createConstructionEntry(draft:ConstructionLogDraft,id:string,today?:string):{entry:SiteEntry|null;errors:string[]}{
  const errors=constructionDraftErrors(draft,today);if(errors.length)return{entry:null,errors};
  return{entry:{...draft,id,date:draft.date,area:clean(draft.area),type:clean(draft.type),note:clean(draft.note),evidence:clean(draft.evidence),progress:Math.round(draft.progress),review:"unreviewed"},errors:[]};
}
export function setConstructionReview(entry:SiteEntry,review:SiteEntry["review"]){
  if(review==="reviewed"&&!entry.evidence.trim())return{entry,error:"Add an evidence reference before marking this update reviewed."};
  return{entry:{...entry,review},error:""};
}
export function filterConstructionEntries(entries:SiteEntry[],filters:ConstructionLogFilters){
  const needle=clean(filters.query).toLowerCase();
  return [...entries].filter(entry=>(filters.type==="All"||entry.type===filters.type)&&(filters.review==="all"||entry.review===filters.review)&&(filters.evidence==="all"||(filters.evidence==="with"?Boolean(entry.evidence.trim()):!entry.evidence.trim()))&&(!needle||`${entry.area} ${entry.type} ${entry.note} ${entry.evidence} ${entry.date}`.toLowerCase().includes(needle))).sort((a,b)=>filters.sort==="oldest"?a.date.localeCompare(b.date)||a.id.localeCompare(b.id):filters.sort==="progress-high"?b.progress-a.progress||b.date.localeCompare(a.date):filters.sort==="progress-low"?a.progress-b.progress||b.date.localeCompare(a.date):b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
}
export function constructionLogSummary(entries:SiteEntry[]){return{total:entries.length,reviewed:entries.filter(x=>x.review==="reviewed").length,awaiting:entries.filter(x=>x.review==="unreviewed").length,evidenced:entries.filter(x=>x.evidence.trim()).length,missingEvidence:entries.filter(x=>!x.evidence.trim()).length,areas:new Set(entries.map(x=>x.area)).size};}
const csvCell=(value:string|number)=>{let text=String(value);if(/^[=+\-@]/.test(text))text=`'${text}`;return `"${text.replaceAll('"','""')}"`};
export function constructionLogCsv(entries:SiteEntry[]){const rows=[["Date","Area","Type","Reported progress","Factual note","Evidence reference","Review state"],...entries.map(x=>[x.date,x.area,x.type,x.progress,x.note,x.evidence,x.review])];return rows.map(row=>row.map(csvCell).join(",")).join("\n");}
export function constructionLogExport(entries:SiteEntry[],exportedAt=new Date().toISOString()){return JSON.stringify({schema:CONSTRUCTION_LOG_EXPORT_SCHEMA,exportedAt,entries:entries.slice(0,500),boundary:"Device-local observations. Not instructions, certified progress, inspection results, payment evidence or professional approval."},null,2)}
