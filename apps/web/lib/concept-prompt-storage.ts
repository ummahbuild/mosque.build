export const CONCEPT_PROMPT_KEY = "mosque-build.concept-prompt.v1";
type StoragePort=Pick<Storage,"getItem"|"setItem"|"removeItem">;
export function saveConceptPrompt(storage:StoragePort,expected:string|null|undefined,text:string|null):string|null {
  if(expected===undefined)throw new Error("The saved concept could not be read. Copy your text, then reload before saving or clearing it.");
  if(text!==null&&(!text.trim()||text.length>3000))throw new Error("Use 1–3,000 characters. Copy the complete original before shortening it.");
  if(storage.getItem(CONCEPT_PROMPT_KEY)!==expected)throw new Error("Another tab changed the saved concept. Copy your text, then reload to compare before saving or clearing.");
  if(text===null)storage.removeItem(CONCEPT_PROMPT_KEY);else storage.setItem(CONCEPT_PROMPT_KEY,text);
  return text;
}
