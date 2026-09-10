import rules from "../data/cost-saving-rules.json" with {type:"json"};

export const COST_RULE_SCHEMA="mosque.build/cost-saving-rule-study@1" as const;
export const COST_RULE_KEY="mosque-build.cost-saving-rules.v1";
export type CostSavingRule=(typeof rules)[number];
export type RuleReview={ruleId:string;applicability:"unassessed"|"applicable"|"not-applicable";decision:"consider"|"accepted-user-record"|"rejected-user-record";ownerRole:string;evidenceRef:string;notes:string};
export type CostRuleStudy={schema:typeof COST_RULE_SCHEMA;status:"executable";reviews:RuleReview[];focusRuleId:string;updatedAt:string};
export type ProjectCostSignals={keywords:string[];sources:string[]};
export const costSavingRules=rules;
export const costRuleCategories=[...new Set(rules.map(rule=>rule.category))];
export const blankRuleReview=(ruleId:string):RuleReview=>({ruleId,applicability:"unassessed",decision:"consider",ownerRole:"",evidenceRef:"",notes:""});
export const createCostRuleStudy=():CostRuleStudy=>({schema:COST_RULE_SCHEMA,status:"executable",reviews:[],focusRuleId:"",updatedAt:""});
const text=(value:unknown,max:number)=>typeof value==="string"&&value.length<=max;
export function safeCostRuleStudy(value:unknown):CostRuleStudy|null{
  if(!value||typeof value!=="object")return null;const study=value as CostRuleStudy;
  if(study.schema!==COST_RULE_SCHEMA||study.status!=="executable"||!Array.isArray(study.reviews)||study.reviews.length>100)return null;
  const ids=new Set(rules.map(rule=>rule.id));
  if(!study.reviews.every(review=>ids.has(review.ruleId)&&["unassessed","applicable","not-applicable"].includes(review.applicability)&&["consider","accepted-user-record","rejected-user-record"].includes(review.decision)&&text(review.ownerRole,100)&&text(review.evidenceRef,300)&&text(review.notes,1000)))return null;
  return {...study,reviews:study.reviews.filter((review,index,all)=>all.findIndex(item=>item.ruleId===review.ruleId)===index),focusRuleId:ids.has(study.focusRuleId)?study.focusRuleId:""};
}
const categoryTerms:Record<string,string[]>={Massing:["footprint","area","compact","circulation","phase"],Structure:["structure","foundation","grid","span","column"],Roof:["roof","dome","waterproof","drainage"],Minaret:["minaret","tower"],Envelope:["wall","window","door","facade","screen","insulation"],Interior:["interior","carpet","ceiling","finish","prayer"],Wudu:["wudu","washroom","water","drain"],MEP:["mep","electrical","hvac","lighting","plumbing","energy","solar"],Site:["site","parking","landscape","ground","access"],Development:["brief","phase","funding","permit","template"],Construction:["construction","schedule","package","procurement","material"]};
export function ruleSignalScore(rule:CostSavingRule,signals:ProjectCostSignals){const terms=categoryTerms[rule.category]??[],haystack=signals.keywords.join(" ").toLowerCase(),matches=terms.filter(term=>haystack.includes(term));return {score:matches.length,matchedTerms:matches,sourceCount:signals.sources.length}}
export function rankedCostRules(signals:ProjectCostSignals){return rules.map(rule=>({rule,...ruleSignalScore(rule,signals)})).sort((a,b)=>b.score-a.score||a.rule.number-b.rule.number)}
export function ruleReviewGaps(rule:CostSavingRule,review:RuleReview){const gaps:string[]=[];if(review.applicability==="unassessed")gaps.push("applicability");if(!review.ownerRole.trim())gaps.push("accountable role");if(review.applicability==="applicable"&&!review.evidenceRef.trim())gaps.push("evidence reference");if(review.decision!=="consider"&&!review.notes.trim())gaps.push("decision rationale");if(!rule.tradeoff_or_risk.trim())gaps.push("trade-off review");return gaps}
export function costRuleSummary(study:CostRuleStudy){const records=study.reviews.map(review=>({review,rule:rules.find(rule=>rule.id===review.ruleId)!})).filter(row=>row.rule),gaps=records.flatMap(row=>ruleReviewGaps(row.rule,row.review));return {reviewed:records.filter(row=>row.review.applicability!=="unassessed").length,applicable:records.filter(row=>row.review.applicability==="applicable").length,accepted:records.filter(row=>row.review.decision==="accepted-user-record").length,openGaps:gaps.length,categories:new Set(records.map(row=>row.rule.category)).size}}
export function modelFocusForRule(rule:CostSavingRule){const layers:Record<string,string[]>={Massing:["spaces","site"],Structure:["structure"],Roof:["roof"],Minaret:["architecture"],Envelope:["walls","openings"],Interior:["spaces","interiors"],Wudu:["spaces","services"],MEP:["services"],Site:["site"],Development:["site","spaces"],Construction:["structure","walls","roof"]};return {schema:"mosque.build/cost-rule-model-focus@1",ruleId:rule.id,category:rule.category,parameter:rule.threejs_parameter,layers:layers[rule.category]??["spaces"],label:rule.strategy,boundary:"Visual coordination cue only. It does not calculate savings, alter geometry, or establish technical suitability."}}
