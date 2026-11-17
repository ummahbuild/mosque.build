import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from '../apps/web/node_modules/typescript/lib/typescript.js';
import {CONCEPT_HANDOFF_KEY,parseMosqueConcept} from '../apps/web/lib/concept-onboarding.ts';
import {newProjectDraft,readProjectDraft,persistProjectDraft,parseProjectDraft,PROJECT_DRAFT_KEY,DRAFT_RECOVERY_KEY,ProjectDraftConflictError} from '../apps/web/lib/project-draft.ts';
async function load(name,dependency){
 const source=readFileSync(new URL(`../apps/web/lib/${name}.ts`,import.meta.url),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll(`"./${dependency}"`,JSON.stringify(new URL(`../apps/web/lib/${dependency}.ts`,import.meta.url).href));
 return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}
const {parseConceptHandoff,clearReviewedConcept,commitReviewedConcept,ConceptHandoffConflictError}=await load('concept-handoff-storage','concept-onboarding');
const {mergeReviewedConcept}=await load('concept-brief-review','project-draft');
const notes='A Moroccan mosque in Rabat for 400 worshippers with a school, 3 storeys, under USD 1 million.';
const handoff=(text=notes,createdAt='first')=>JSON.stringify({schema:'mosque.build/concept-handoff@1',fields:{notes:text},createdAt});
const original=handoff();
function storage(source=original,draft={...newProjectDraft(),name:'Saved brief',location:'Existing location',type:'Mosque expansion',notes:'Existing notes'}){
 const values=new Map([[CONCEPT_HANDOFF_KEY,source],[PROJECT_DRAFT_KEY,JSON.stringify(draft)]]);
 if(source===null)values.delete(CONCEPT_HANDOFF_KEY);
 return {values,getItem(key){return values.get(key)??null},setItem(key,value){values.set(key,value)},removeItem(key){values.delete(key)}};
}
test('missing concept is not a proposal and original source text is preserved',()=>{
 assert.equal(parseConceptHandoff(null),null);
 const raw='  '+notes+'\n';assert.equal(parseConceptHandoff(handoff(raw)).notes,raw);
});
for(const [label,raw] of Object.entries({malformed:'{',null:'null',array:'[]',schema:JSON.stringify({schema:'future',fields:{notes}}),missing:JSON.stringify({schema:'mosque.build/concept-handoff@1'}),empty:handoff('  '),nonstring:handoff(42),oversize:handoff('x'.repeat(3001)),envelope:' '.repeat(30001)})){
 test(`rejects ${label} source without touching saved data`,()=>{const s=storage(raw);const before=[...s.values];assert.throws(()=>parseConceptHandoff(raw));assert.throws(()=>commitReviewedConcept(s,raw,()=>assert.fail('must not save')));assert.deepEqual([...s.values],before)});
}
test('derived fields are reparsed from source instead of trusting persisted suggestions',()=>{
 const raw=JSON.stringify({schema:'mosque.build/concept-handoff@1',fields:{notes,storeys:'99',style:['untrusted'],budget:'1'}});
 assert.deepEqual(parseConceptHandoff(raw),parseMosqueConcept(notes));
});
for(const [label,current] of [['replacement',handoff('An Ottoman mosque for 200 people.')],['deleted',null],['corrupted','{'],['same text new review',handoff(notes,'second')]]){
 test(`${label} pending concept blocks old acceptance and preserves all saved bytes`,()=>{
  const s=storage(current),before=[...s.values];assert.throws(()=>commitReviewedConcept(s,original,()=>assert.fail('stale callback')),ConceptHandoffConflictError);
  assert.equal(clearReviewedConcept(s,original),false);assert.deepEqual([...s.values],before);
 });
}
test('unread or absent snapshots never permit save or removal',()=>{
 const s=storage(),before=[...s.values];for(const expected of [undefined,null]){assert.throws(()=>commitReviewedConcept(s,expected,()=>assert.fail('no source')));assert.throws(()=>clearReviewedConcept(s,expected))}assert.deepEqual([...s.values],before);
});
test('unavailable source storage fails before touching the brief',()=>{
 const s=storage();s.getItem=()=>{throw Error('read denied')};assert.throws(()=>commitReviewedConcept(s,original,()=>assert.fail('no read')),/read denied/);
});
test('keeping a reviewed concept removes only the matching pending source',()=>{
 const s=storage(),draft=s.getItem(PROJECT_DRAFT_KEY);assert.equal(clearReviewedConcept(s,original),true);assert.equal(s.getItem(CONCEPT_HANDOFF_KEY),null);assert.equal(s.getItem(PROJECT_DRAFT_KEY),draft);
});
test('selected styles and storeys persist, exact original is backed up, and unselected fields survive reload',()=>{
 const s=storage(),snapshot=readProjectDraft(s),draft=parseProjectDraft(snapshot.raw),proposal=parseConceptHandoff(original);
 const result=commitReviewedConcept(s,original,()=>persistProjectDraft(s,mergeReviewedConcept(draft,proposal,['style','storeys']),snapshot,true));
 assert.equal(result.cleanup,'cleared');assert.equal(s.getItem(CONCEPT_HANDOFF_KEY),null);
 const loaded=parseProjectDraft(readProjectDraft(s).raw);assert.deepEqual(loaded.style,['Moroccan']);assert.equal(loaded.storeys,'3');
 for(const key of Object.keys(draft))if(!['style','storeys'].includes(key))assert.deepEqual(loaded[key],draft[key]);
 assert.equal(JSON.parse(s.getItem(DRAFT_RECOVERY_KEY)).raw,snapshot.raw);assert.equal(result.value.raw,s.getItem(PROJECT_DRAFT_KEY));
});
test('empty brief keeps default fields until explicit acceptance',()=>{
 const s=storage(original,newProjectDraft()),snapshot=readProjectDraft(s),draft=parseProjectDraft(snapshot.raw);
 assert.deepEqual(mergeReviewedConcept(draft,parseConceptHandoff(original),[]),draft);
 commitReviewedConcept(s,original,()=>persistProjectDraft(s,mergeReviewedConcept(draft,parseConceptHandoff(original),['location','style','storeys']),snapshot,true));
 const result=parseProjectDraft(readProjectDraft(s).raw);assert.equal(result.name,'');assert.equal(result.type,'New mosque');assert.equal(result.location,'Rabat');assert.equal(result.storeys,'3');assert.deepEqual(result.style,['Moroccan']);
});
test('concurrent brief change throws typed recovery error and retains pending source',()=>{
 const s=storage(),snapshot=readProjectDraft(s),draft=parseProjectDraft(snapshot.raw);s.setItem(PROJECT_DRAFT_KEY,JSON.stringify({...draft,name:'Newer saved brief'}));const before=[...s.values];
 assert.throws(()=>commitReviewedConcept(s,original,()=>persistProjectDraft(s,mergeReviewedConcept(draft,parseConceptHandoff(original),['style']),snapshot,true)),ProjectDraftConflictError);
 assert.deepEqual([...s.values],before);
});
for(const key of [DRAFT_RECOVERY_KEY,PROJECT_DRAFT_KEY])test(`failed ${key} write keeps original draft and pending concept`,()=>{
 const s=storage(),snapshot=readProjectDraft(s),draft=parseProjectDraft(snapshot.raw),set=s.setItem.bind(s);s.setItem=(target,value)=>{if(target===key)throw Error('quota');set(target,value)};
 assert.throws(()=>commitReviewedConcept(s,original,()=>persistProjectDraft(s,mergeReviewedConcept(draft,parseConceptHandoff(original),['style']),snapshot,true)),/quota/);
 assert.equal(s.getItem(CONCEPT_HANDOFF_KEY),original);assert.equal(s.getItem(PROJECT_DRAFT_KEY),snapshot.raw);
});
test('a newer handoff queued while saving survives successful commit',()=>{
 const s=storage(),newer=handoff('A mosque for 200 people.');let calls=0;
 const result=commitReviewedConcept(s,original,()=>{calls++;s.setItem(CONCEPT_HANDOFF_KEY,newer);return 'saved'});
 assert.deepEqual(result,{value:'saved',cleanup:'changed'});assert.equal(calls,1);assert.equal(s.getItem(CONCEPT_HANDOFF_KEY),newer);
});
for(const method of ['getItem','removeItem'])test(`cleanup ${method} failure is not reported as a failed brief save`,()=>{
 const s=storage();let calls=0;const result=commitReviewedConcept(s,original,()=>{calls++;s[method]=()=>{throw Error('storage unavailable')};return 'saved'});
 assert.deepEqual(result,{value:'saved',cleanup:'unavailable'});assert.equal(calls,1);assert.equal(s.values.get(CONCEPT_HANDOFF_KEY),original);
});
test('wizard provides separate stale-source and draft-conflict recovery with fresh consent and focus',()=>{
 const wizard=readFileSync(new URL('../apps/web/components/start-project-wizard.tsx',import.meta.url),'utf8');
 const review=readFileSync(new URL('../apps/web/components/concept-import-review.tsx',import.meta.url),'utf8');
 assert.match(wizard,/key=\{conceptRevision\}/);assert.match(wizard,/blocked=\{conceptStale\|\|!!saveError\}/);assert.match(wizard,/Review latest concept/);assert.match(wizard,/Download working brief/);assert.match(wizard,/Reload saved brief/);assert.match(wizard,/error instanceof ProjectDraftConflictError/);
 assert.doesNotMatch(wizard,/removeItem\(CONCEPT_HANDOFF_KEY\)/);assert.match(review,/disabled=\{blocked\|\|!accepted.length\}/);assert.match(review,/heading.current\?\.focus\(\)/);assert.match(review,/useState<ConceptReviewField\[\]>\(\[\]\)/);
});
