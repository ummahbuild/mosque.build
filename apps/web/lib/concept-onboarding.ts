export const CONCEPT_HANDOFF_KEY="mosque-build.concept-handoff.v1";
export type ConceptFields={location:string;attendance:string;budget:string;currency:string;type:string;needs:string[];style:string[];storeys:string;notes:string};
const has=(s:string,r:RegExp)=>r.test(s);
export function parseMosqueConcept(input:string):ConceptFields{
 const s=input.slice(0,3000);
 const location=(s.match(/\b(?:in|at|near)\s+([A-Za-z][A-Za-z\s-]{2,45}?)(?=\s+(?:for|with|under|below|using|combining|that|to\s+(?:fit|serve))\b|[,.;]|$)/i)?.[1]||"").trim();
 const attendance=s.match(/\b(?:for|fit|fits|serve|serving|capacity(?:\s+for|\s+of)?)\s+(\d{1,6}(?:,\d{3})?)\s*(?:worshippers|people|persons|attendees|praying|seats)?\b/i)?.[1]||s.match(/\b(\d{1,6}(?:,\d{3})?)\s*[- ]?\s*(?:worshippers|people|persons|attendees)\b/i)?.[1]||"";
 const budgetMatch=s.match(/\b(?:under|below|less than|up to|budget(?: of)?|within)\s*(?:USD|US\$|KES|KSH|GBP|EUR|\$|£|€)?\s*([\d,.]+)\s*(million|m|thousand|k)?\s*(USD|KES|KSH|GBP|EUR|dollars?)?\b/i);
 const prefix=s.match(/\b(?:under|below|less than|up to|budget(?: of)?|within)\s*(USD|US\$|KES|KSH|GBP|EUR|\$|£|€)/i)?.[1]||"";
 const curr=String(budgetMatch?.[3]||prefix).toUpperCase();
 const n=Number((budgetMatch?.[1]||"").replaceAll(",",""));const mult=/^(million|m)$/i.test(budgetMatch?.[2]||"")?1e6:/^(thousand|k)$/i.test(budgetMatch?.[2]||"")?1e3:1;
 const budget=budgetMatch&&Number.isFinite(n)&&n>0?String(Math.round(n*mult)):"";
 const needs=[["Madrasa / classrooms",/madrasa|school|classroom|education/i],["Women / family",/women|family prayer/i],["Wudu",/wudu|ablution|washing facilities/i],["Accessibility",/accessible|step-free|lift|wheelchair/i],["Library",/library/i],["Youth",/youth/i],["Community hall",/community (?:hall|center|centre)|event space/i],["Kitchen / iftar",/kitchen|iftar/i],["Parking",/parking/i],["Janazah",/janazah/i]].filter(([,re])=>has(s,re as RegExp)).map(([name])=>name as string);
 const style=["Moroccan","Indian","Swahili","Ottoman","Mughal","Sahelian","modern","contemporary","minimal","traditional"].filter(x=>s.toLowerCase().includes(x.toLowerCase()));
 const storeys=s.match(/\b(\d{1,2})\s*[- ]?(?:storey|story|floor|level)s?\b/i)?.[1]||"";
 const type=has(s,/mall|warehouse|convert|reuse|existing retail|airport|prayer room|musalla/i)?"Adaptive reuse / conversion":has(s,/madrasa|school/i)?"Mosque + madrasa":has(s,/community cent(?:er|re)/i)?"Community center":has(s,/campus/i)?"Phased campus":"New mosque";
 return {location,attendance:attendance.replaceAll(",",""),budget,currency:/KES|KSH/.test(curr)?"Other / mixed":/GBP|£/.test(curr)?"GBP":/EUR|€/.test(curr)?"EUR":budget?"USD":"",type,needs,style,storeys,notes:s};
}
