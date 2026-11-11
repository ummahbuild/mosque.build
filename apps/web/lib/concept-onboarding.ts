export const CONCEPT_HANDOFF_KEY="mosque-build.concept-handoff.v1";
export type ConceptFields={location:string;attendance:string;budget:string;currency:string;type:string;needs:string[];style:string[];storeys:string;notes:string;warnings?:string[]};
const has=(s:string,r:RegExp)=>r.test(s);
export function parseMosqueConcept(input:string):ConceptFields{
 const s=input.slice(0,3000);
 const location=(s.match(/\b(?:in|at|near)\s+([A-Za-z][A-Za-z\s-]{2,45}?)(?=\s+(?:for|with|under|below|using|combining|that|to\s+(?:fit|serve))\b|[,.;]|$)/i)?.[1]||"").trim();
 let attendance=s.match(/\b(?:for|fit|fits|serve|serving|capacity(?:\s+for|\s+of)?)\s+(\d{1,6}(?:,\d{3})?)\s*(?:worshippers|worshipper|people|persons|person|attendees|praying|seats)\b/i)?.[1]||s.match(/\b(\d{1,6}(?:,\d{3})?)\s*[- ]?\s*(?:worshippers|worshipper|people|persons|person|attendees)\b/i)?.[1]||"";
 const warnings:string[]=[];
 if(/\b\d[\d,]*\s*(?:[-–—]|to|or)\s*\d[\d,]*\s*(?:people|persons?|worshippers?|attendees)\b/i.test(s)){attendance="";warnings.push("Attendance is a range or alternative. Enter the intended design attendance in the brief.");}
 const budgetMatch=s.match(/\b(?:under|below|less than|up to|budget(?: of)?|within)\s*(?:USD|US\$|KES|KSH|GBP|EUR|\$|£|€)?\s*([\d,.]+)\s*(million|m|thousand|k)?\s*(USD|KES|KSH|GBP|EUR|dollars?)?\b/i);
 const prefix=s.match(/\b(?:under|below|less than|up to|budget(?: of)?|within)\s*(USD|US\$|KES|KSH|GBP|EUR|\$|£|€)/i)?.[1]||"";
 const curr=String(budgetMatch?.[3]||prefix).toUpperCase();
 const n=Number((budgetMatch?.[1]||"").replaceAll(",",""));const mult=/^(million|m)$/i.test(budgetMatch?.[2]||"")?1e6:/^(thousand|k)$/i.test(budgetMatch?.[2]||"")?1e3:1;
 let budget=budgetMatch&&Number.isFinite(n)&&n>0&&n*mult<=1e12?String(Math.round(n*mult)):"";
 const budgetTail=budgetMatch?s.slice((budgetMatch.index??0)+budgetMatch[0].length):"";
 if(budgetMatch&&((!curr&&/^m$/i.test(budgetMatch[2]||""))||/^\s*(?:per\s+(?:person|worshipper|m[²2]|square)|\/\s*(?:person|m[²2])|met(?:re|er)s?|m[²2]|sq\b)/i.test(budgetTail))){budget="";warnings.push("The amount may describe dimensions or a unit rate, not the total budget. Confirm it in the brief.");}
 if(budget&&!curr)warnings.push("Budget currency is unspecified. Choose it explicitly before using this amount.");
 // Conservative English negation handling: omit uncertain program requests instead of adding them.
 const positive=s.replace(/\b(?:no|without|not including|do not include|don't include)\s+[^.;]+?(?=\b(?:but|however|instead)\b|[.;]|$)/gi,"");
 if(positive!==s)warnings.push("A negative requirement was found. Suggestions omit that clause; check the original concept for any needs that should still be included.");
 const needs=[["Madrasa / classrooms",/\b(?:madrasa|schools?|classrooms?|education)\b/i],["Women / family",/women|family prayer/i],["Wudu",/wudu|ablution|washing facilities/i],["Accessibility",/accessible|step-free|lift|wheelchair/i],["Library",/library/i],["Youth",/youth/i],["Community hall",/community (?:hall|center|centre)|event space/i],["Kitchen / iftar",/kitchen|iftar/i],["Parking",/parking/i],["Janazah",/janazah/i]].filter(([,re])=>has(positive,re as RegExp)).map(([name])=>name as string);
 const style=["Moroccan","Indian","Swahili","Ottoman","Mughal","Sahelian","modern","contemporary","minimal","traditional"].filter(x=>positive.toLowerCase().includes(x.toLowerCase()));
 const storeys=s.match(/\b(\d{1,2})\s*[- ]?(?:storey|story|floor|level)s?\b/i)?.[1]||"";
 const type=has(positive,/\b(?:mall|warehouse|convert|reuse|existing retail|airport)\b/i)?"Adaptive reuse / conversion":has(positive,/\b(?:prayer room|musalla)\b/i)?"Prayer room / musalla":needs.includes("Madrasa / classrooms")?"Mosque + madrasa":has(positive,/community cent(?:er|re)/i)?"Community center":has(positive,/\bcampus\b/i)?"Phased campus":"New mosque";
 return {location,attendance:attendance.replaceAll(",",""),budget,currency:/KES|KSH/.test(curr)?"Other / mixed":/GBP|£/.test(curr)?"GBP":/EUR|€/.test(curr)?"EUR":/USD|US\$|\$|DOLLAR/.test(curr)?"USD":"",type,needs,style,storeys,notes:s,warnings};
}
