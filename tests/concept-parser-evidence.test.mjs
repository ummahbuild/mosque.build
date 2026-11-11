import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseMosqueConcept,CONCEPT_PARSER_VERSION} from '../apps/web/lib/concept-onboarding.ts';
const fixtures=JSON.parse(readFileSync(new URL('fixtures/concepts/review-prompts.json',import.meta.url),'utf8'));
test('fixture set includes at least 50 independently written prompt variants',()=>assert.ok(fixtures.length>=50));
for(const [i,fixture] of fixtures.entries())test(`concept fixture ${i+1}: ${fixture.text}`,()=>{
 const result=parseMosqueConcept(fixture.text);
 for(const [key,value] of Object.entries(fixture.expect??{}))assert.deepEqual(result[key],value,key);
 for(const key of fixture.ambiguous??[])assert.equal(result.evidence[key].status,'ambiguous',key);
 for(const need of fixture.includes??[])assert.ok(result.needs.includes(need),need);
 for(const need of fixture.excludes??[])assert.ok(!result.needs.includes(need),need);
 if(fixture.styles)assert.deepEqual(result.style,fixture.styles);
 assert.equal(result.notes,fixture.text);assert.equal(result.parserVersion,CONCEPT_PARSER_VERSION);
 for(const [field,record] of Object.entries(result.evidence)){
  for(const span of record.sources){assert.ok(span.start>=0&&span.end<=fixture.text.length&&span.end>span.start,field);assert.equal(fixture.text.slice(span.start,span.end),span.quote,field);}
  if(record.status==='suggested')assert.ok(record.sources.length,field);
 }
});
test('long and HTML-like inputs are preserved as bounded plain text, not interpreted markup',()=>{
 const text='<img src=x onerror=alert(1)> mosque in Rabat for 300 people';const result=parseMosqueConcept(text);assert.equal(result.notes,text);
 const long=parseMosqueConcept('a'.repeat(3001));assert.equal(long.notes.length,3000);assert.ok(long.warnings.some(w=>w.includes('3,000')));
});
test('uncertainty evidence includes the range or unit-rate words that caused it',()=>{
 for(const text of ['Budget USD 1–2 million, with a library.','Budget USD 100 per person.','Budget USD 1 trillion.']){
  const result=parseMosqueConcept(text);assert.equal(result.evidence.budget.status,'ambiguous');assert.equal(result.evidence.budget.sources[0].quote,text.split(/[,.]/)[0]);
 }
});
