import test from 'node:test';
import assert from 'node:assert/strict';
import {parseMosqueConcept,CONCEPT_PARSER_VERSION} from '../apps/web/lib/concept-onboarding.ts';
import {deriveConceptProgram} from '../apps/web/lib/concept-room-program.ts';
const ambiguousBudgets=[
 'Land costs USD 50000. Plan a mosque for 300 worshippers.',
 'The plot price is EUR 40000.',
 'Annual operating budget USD 50000 for a mosque.',
 'Monthly rent USD 1200.',
 'Maintenance costs GBP 2000.',
 'Roof estimate USD 40000.',
 'Solar equipment costs INR 200000.',
 'USD 5000 for carpets.',
 'USD 40000 for a roof.',
 'USD 50000 for the land.',
 'USD 20000 pledge.',
 'Donations of USD 50000 have been promised.',
 'We raised KES 2000000 for our mosque.',
 'An equipment grant of EUR 12000.',
 'Budget USD 50000 per year.',
 'USD 6000 every month for maintenance.',
 'Msikiti bajeti ya uendeshaji KES 500000.',
 'Bei ya ardhi KES 2000000.',
 'ميزانية سنوية MAD 50000.',
 'تكلفة الأرض MAD 50000.',
 'A mosque with an annual budget of USD 50000.',
 'Land costs USD 50000; overall project budget USD 500000.',
];
const uncertainQuantities=[
 ['A neighborhood where 10000 people live. Plan a mosque.','attendance'],
 ['The city has 10000 people.','attendance'],
 ['There are 10000 people residing nearby.','attendance'],
 ['A mosque for 300 worshippers initially and 500 eventually.','attendance'],
 ['Plan for 300 worshippers or 500 eventually.','attendance'],
 ['A mosque for 300+ people.','attendance'],
 ['Capacity 300+.','attendance'],
 ['A mosque for approximately 400 worshippers.','attendance'],
 ['A mosque for around 400 people.','attendance'],
 ['A mosque for roughly 400 attendees.','attendance'],
 ['A mosque for > 400 people.','attendance'],
 ['A mosque for ≤ 400 people.','attendance'],
 ['A mosque for 400 people maximum.','attendance'],
 ['A mosque for 400 people or more.','attendance'],
 ['A mosque for takriban 400 watu.','attendance'],
 ['مسجد لحوالي ٤٠٠ مصلين.','attendance'],
 ['Wakazi 400 watu wanaishi karibu.','attendance'],
 ['سكان ٤٠٠ شخص يعيشون هنا.','attendance'],
 ['A mosque with about 3 floors.','storeys'],
 ['A mosque with 3+ floors.','storeys'],
 ['A mosque with 3 floors initially and 5 eventually.','storeys'],
 ['Capacity 300 m².','attendance'],
 ['Capacity 300 litres.','attendance'],
];
function evidenceIsExact(result,text){
 assert.equal(result.notes,text);assert.equal(result.parserVersion,CONCEPT_PARSER_VERSION);
 for(const record of Object.values(result.evidence))for(const span of record.sources){
  assert.ok(span.start>=0&&span.end>span.start&&span.end<=text.length);
  assert.equal(text.slice(span.start,span.end),span.quote);
 }
}
for(const text of ambiguousBudgets)test(`non-total budget stays unresolved: ${text}`,()=>{
 const result=parseMosqueConcept(text);assert.equal(result.budget,'');assert.equal(result.currency,'');
 assert.equal(result.evidence.budget.status,'ambiguous');assert.ok(result.warnings.length);evidenceIsExact(result,text);
});
for(const [text,field] of uncertainQuantities)test(`uncertain ${field}: ${text}`,()=>{
 const result=parseMosqueConcept(text);assert.equal(result[field],'');assert.equal(result.evidence[field].status,'ambiguous');
 if(field==='attendance')assert.equal(deriveConceptProgram(result).rooms[0].areaM2,null);
 evidenceIsExact(result,text);
});
const clearCases=[
 ['A mosque with wudu and a budget USD 500000.',{budget:'500000',currency:'USD'}],
 ['A mosque with solar; overall project budget USD 500000.',{budget:'500000'}],
 ['We own land; budget USD 500000.',{budget:'500000'}],
 ['Land is included in the total project budget USD 500000.',{budget:'500000'}],
 ['Budget USD 500000 for a mosque with solar.',{budget:'500000'}],
 ['Budget USD 500000 including wudu.',{budget:'500000'}],
 ['Budget EUR 1000.50.',{budget:'1000.5',currency:'EUR'}],
 ['Budget INR 12,50,000.',{budget:'1250000'}],
 ['A mosque for 300 people and 3 floors.',{attendance:'300',storeys:'3'}],
 ['A mosque has capacity for 300.',{attendance:'300'}],
 ['Msikiti wa watu 300, ghorofa 3.',{attendance:'300',storeys:'3'}],
 ['Plan for 300 people; a library can be added later.',{attendance:'300'}],
 ['Incapacity 300. Build a mosque.',{attendance:''}],
 ['Capacity 300m². Build a mosque.',{attendance:''}],
 ['A 300-person mosque with a library.',{attendance:'300'}],
];
for(const [text,expected] of clearCases)test(`unrelated context does not corrupt valid values: ${text}`,()=>{
 const result=parseMosqueConcept(text);for(const [key,value] of Object.entries(expected))assert.equal(result[key],value,key);evidenceIsExact(result,text);
});
test('ambiguity quotes include the contextual words rather than just the number',()=>{
 for(const [text,field,word] of [['Annual operating budget USD 50000.','budget','Annual'],['Land costs USD 50000.','budget','Land'],['A mosque for approximately 400 people.','attendance','approximately'],['A neighborhood where 10000 people live.','attendance','neighborhood']]){
  assert.ok(parseMosqueConcept(text).evidence[field].sources.some(s=>s.quote.includes(word)));
 }
});
test('room program ignores stale numbers when evidence is ambiguous, missing or unspecified',()=>{
 const fields=parseMosqueConcept('A mosque for 400 worshippers.');
 for(const evidence of [{},{attendance:{status:'ambiguous'}},{attendance:{status:'unspecified'}}])assert.equal(deriveConceptProgram({...fields,evidence}).rooms[0].areaM2,null);
 assert.equal(deriveConceptProgram(fields).rooms[0].areaM2,500);
});
