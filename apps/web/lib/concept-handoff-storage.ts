import {CONCEPT_HANDOFF_KEY, parseMosqueConcept, type ConceptFields} from "./concept-onboarding";

type HandoffStorage = Pick<Storage, "getItem" | "removeItem">;

/** Only the original text is trusted; saved derived fields are parsed again. */
export function parseConceptHandoff(raw: string | null): ConceptFields | null {
  if (raw === null) return null;
  if (raw.length > 30_000) throw new Error("The pending concept is too large to review.");
  const entry = JSON.parse(raw);
  if (entry?.schema !== "mosque.build/concept-handoff@1" || typeof entry.fields?.notes !== "string" ||
      !entry.fields.notes.trim() || entry.fields.notes.length > 3000) {
    throw new Error("The pending concept could not be read.");
  }
  return parseMosqueConcept(entry.fields.notes);
}

export class ConceptHandoffConflictError extends Error {
  constructor() {super("The pending concept changed in another tab. Review the latest concept before applying suggestions.");}
}

function requireReviewedSnapshot(expected: string | null | undefined): asserts expected is string {
  if (typeof expected !== "string" || !parseConceptHandoff(expected)) {
    throw new Error("The pending concept must be read again before it can be applied or cleared.");
  }
}

/** Never clear a different pending concept, including one created during the save. */
export function clearReviewedConcept(storage: HandoffStorage, expected: string | null | undefined): boolean {
  requireReviewedSnapshot(expected);
  if (storage.getItem(CONCEPT_HANDOFF_KEY) !== expected) return false;
  storage.removeItem(CONCEPT_HANDOFF_KEY);
  return true;
}

/** Keep commit failures distinct from cleanup failures after a successful brief save. */
export function commitReviewedConcept<T>(
  storage: HandoffStorage,
  expected: string | null | undefined,
  save: () => T,
): {value: T; cleanup: "cleared" | "changed" | "unavailable"} {
  requireReviewedSnapshot(expected);
  if (storage.getItem(CONCEPT_HANDOFF_KEY) !== expected) throw new ConceptHandoffConflictError();
  const value = save();
  try {return {value, cleanup: clearReviewedConcept(storage, expected) ? "cleared" : "changed"};}
  catch {return {value, cleanup: "unavailable"};}
}
