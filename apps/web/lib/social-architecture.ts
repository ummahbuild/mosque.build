export type InterventionLevel="no-cost"|"low-cost"|"renovation"|"capital";
export type SocialAuditInput={selected:string[];priorityPersonas:string[];mode:string};
export type SocialCriterion={id:string;title:string;category:string;level:string;description:string;personas:string[];modes:string[];privacy:string;acoustic:string;adjacentTo:string[];tradeoff:string};
export type SocialAuditResult={overall:number;categories:{name:string;score:number;selected:number;total:number}[];recommendations:SocialCriterion[];risks:string[]};

export function scoreSocialArchitecture(input:SocialAuditInput,criteria:SocialCriterion[]):SocialAuditResult{
  const selected=new Set(input.selected);const categories=[...new Set(criteria.map(item=>item.category))];
  const categoryScores=categories.map(name=>{const items=criteria.filter(item=>item.category===name);const count=items.filter(item=>selected.has(item.id)).length;return {name,score:Math.round(count/items.length*100),selected:count,total:items.length}});
  const weighted=criteria.map(item=>{const personaFit=item.personas.some(persona=>input.priorityPersonas.includes(persona))?2:1;const modeFit=item.modes.includes(input.mode)?2:1;return {item,weight:personaFit+modeFit}}).sort((a,b)=>b.weight-a.weight||criteria.indexOf(a.item)-criteria.indexOf(b.item));
  const recommendations=weighted.filter(({item})=>!selected.has(item.id)).slice(0,5).map(({item})=>item);
  const risks:string[]=[];
  if(!selected.has("clear-welcome")&&!selected.has("newcomer-host"))risks.push("Newcomers may have no legible or human welcome path.");
  if(!selected.has("shared-commons")&&!selected.has("post-prayer-dwell"))risks.push("The project may function as an auditorium with little space for relationships after prayer.");
  if(!selected.has("women-equitable-route"))risks.push("Women’s arrival, amenities and participation remain untested rather than demonstrably equitable.");
  if(!selected.has("family-proximity")&&!selected.has("youth-territory"))risks.push("Children and youth may be managed through separation instead of belonging.");
  if(input.mode!=="Daily"&&!selected.has("mode-conversion"))risks.push(`${input.mode} operation has no documented conversion and staffing plan.`);
  const overall=Math.round(criteria.reduce((sum,item)=>sum+(selected.has(item.id)?(item.personas.some(persona=>input.priorityPersonas.includes(persona))?2:1):0),0)/criteria.reduce((sum,item)=>sum+(item.personas.some(persona=>input.priorityPersonas.includes(persona))?2:1),0)*100);
  return {overall,categories:categoryScores,recommendations,risks};
}
