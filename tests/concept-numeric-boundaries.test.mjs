import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
import {parseMosqueConcept,CONCEPT_PARSER_VERSION} from '../apps/web/lib/concept-onboarding.ts';
import {deriveConceptProgram} from '../apps/web/lib/concept-room-program.ts';
import {newProjectDraft} from '../apps/web/lib/project-draft.ts';
const source=readFileSync(new URL('../apps/web/lib/concept-brief-review.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace('"./project-draft"',JSON.stringify(new URL('../apps/web/lib/project-draft.ts',import.meta.url).href));
const {mergeReviewedConcept}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const current={...newProjectDraft(),name:'Existing project',location:'Saved location',attendance:'250',budget:'900000',currency:'EUR'};
function verify(text,field){
 const result=parseMosqueConcept(text);assert.equal(result[field],'');assert.equal(result.evidence[field].status,'ambiguous');assert.ok(result.warnings.length);
 assert.equal(result.notes,text);assert.equal(result.parserVersion,CONCEPT_PARSER_VERSION);
 for(const record of Object.values(result.evidence))for(const span of record.sources){assert.ok(span.start>=0&&span.end>span.start&&span.end<=text.length);assert.equal(text.slice(span.start,span.end),span.quote)}
 assert.deepEqual(mergeReviewedConcept(current,result,[field]),current);
 return result;
}
for(const expression of ['1e6','2E+6','3e-2','2.5e6','١e٦','2×10^6','2 * 1000000','2x1000000','10^6','2+2','10−2','50 percent','50 per cent','50 pct','2 times 1000000','50%','٥٠٪','50‰','1_000_000','1 000 000','1m2','1k500'])test(`unsupported budget expression stays unresolved: ${expression}`,()=>{
 const result=verify(`A mosque in Rabat, budget USD ${expression}.`,'budget');assert.equal(result.currency,'');assert.match(result.evidence.budget.reason,/unsupported numeric notation|range/);
});
for(const phrase of ['per day','each week','every month','a year','an hour','over a day','across the week','/day','daily','weekly','monthly','annually','kwa siku','kila wiki','يومياً'])test(`visits over time cannot become prayer capacity: ${phrase}`,()=>{
 const result=verify(`A mosque for 400 people ${phrase}.`,'attendance');assert.equal(deriveConceptProgram(result).rooms[0].areaM2,null);
});
for(const text of ['Daily capacity of 400.','Weekly attendance of 400 people.','Monthly visitors: 400 people.','Annual capacity 400.'])test(`leading throughput context: ${text}`,()=>verify(text,'attendance'));
for(const phrase of ['in phase two','in stage one','in total','in principle','in June','in Ramadan','at Jumuah','at Jumu’ah','at Friday prayers','at Eid','at peak times'])test(`non-place context is not a locality: ${phrase}`,()=>verify(`A mosque for 400 worshippers ${phrase}.`,'location'));
for(const text of ['A mosque in Rabat for 400 people at Jumuah.','A mosque in Nairobi for 400 people in total.','A mosque in Mumbai for 400 people in phase two.'])test(`keep explicit locality alongside non-place context: ${text}`,()=>{
 const result=parseMosqueConcept(text);assert.equal(result.location,text.match(/in (\w+)/)[1]);assert.equal(result.attendance,'400');assert.equal(result.evidence.location.status,'suggested');assert.equal(result.evidence.location.sources.length,1);assert.equal(result.evidence.location.sources[0].quote,result.location);
});
for(const [text,budget,currency] of [
 ['Budget USD 1000000.','1000000','USD'],['Budget USD 1 million.','1000000','USD'],['Budget KES 2m.','2000000','KES'],['Budget INR 1 crore.','10000000','INR'],['Budget EUR 1000.50.','1000.5','EUR'],['Budget MAD ٥٠٠٠٠.','50000','MAD'],['Budget INR 12,50,000.','1250000','INR'],['Budget USD 500000 for a mosque.','500000','USD'],['Budget USD 500000, 400 worshippers.','500000','USD']
])test(`supported budget stays intact: ${text}`,()=>{
 const result=parseMosqueConcept(text);assert.equal(result.budget,budget);assert.equal(result.currency,currency);assert.equal(result.evidence.budget.status,'suggested');
});
for(const text of ['A mosque for 400 people at one prayer.','A mosque for 400 people during Jumuah.','A mosque for 400 people; it opens every day.','A mosque for 400 people with a weekly school.'])test(`one gathering remains usable: ${text}`,()=>{
 const result=parseMosqueConcept(text);assert.equal(result.attendance,'400');assert.equal(deriveConceptProgram(result).rooms[0].areaM2,500);
});
test('place words beginning with time or prayer names are not discarded',()=>{
 for(const place of ['Mayfair','March Town','Eid Road','Friday Harbor'])assert.equal(parseMosqueConcept(`A mosque in ${place} for 400 people.`).location,place);
});
