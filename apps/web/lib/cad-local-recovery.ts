import { CAD_AUTHORING_KEY, CAD_AUTHORING_SCHEMA, createCadAuthoringState, safeCadAuthoringState, starterCadDocument, type CadAuthoringState, type CadDocument } from "./cad-authoring-core";
import { validateCadProduction } from "./cad-production-integrity";

export const CAD_BACKUP_KEY = `${CAD_AUTHORING_KEY}.recovery-backup`;
export const CAD_MAX_BYTES = 2_000_000;
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const bytes = (text: string) => new TextEncoder().encode(text).length;
const equal = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const x = a as Record<string, unknown>, y = b as Record<string, unknown>;
  return Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(key => Object.hasOwn(y, key) && equal(x[key], y[key]));
};

// Fingerprint the historical starter, including names, hosts and boundaries.
// Dates and revision counters are the only fields allowed to differ.
export function isLegacyCadStarter(value: unknown): value is CadDocument {
  if (!value || typeof value !== "object") return false;
  const doc = value as CadDocument, expected = starterCadDocument();
  expected.walls = expected.walls.slice(0, 5);
  expected.walls[0] = { ...expected.walls[0], name: "south", end: { x: 12, y: 0 } };
  expected.walls[2] = { ...expected.walls[2], name: "north", end: { x: 0, y: 8 } };
  expected.spaces[0].boundaryWallIds = ["wall-1", "wall-2", "wall-3", "wall-5"];
  expected.spaces[1].boundaryWallIds = ["wall-1", "wall-3", "wall-4", "wall-5"];
  return Number.isSafeInteger(doc.revision) && doc.revision >= 1 && typeof doc.updatedAt === "string"
    && equal({ ...doc, revision: 1, updatedAt: "" }, { ...expected, revision: 1, updatedAt: "" });
}

function validDocument(value: unknown): value is CadDocument {
  const saved = safeCadAuthoringState({ ...createCadAuthoringState(), document: value });
  return !!saved && !validateCadProduction(saved.document).some(issue => issue.level === "blocker");
}

export type CadReadResult =
  | { kind: "ready"; state: CadAuthoringState }
  | { kind: "legacy"; state: CadAuthoringState }
  | { kind: "recovery"; message: string };

export function readCadRecord(raw: string | null): CadReadResult {
  if (raw === null) return { kind: "ready", state: createCadAuthoringState() };
  if (bytes(raw) > CAD_MAX_BYTES) return { kind: "recovery", message: "Saved model exceeds the 2 MB limit. Download the original for recovery." };
  try {
    const value = JSON.parse(raw);
    if (!value || value.schema !== CAD_AUTHORING_SCHEMA || value.status !== "executable"
      || !Array.isArray(value.past) || value.past.length > 50 || !Array.isArray(value.future) || value.future.length > 50
      || !Array.isArray(value.selection) || value.selection.length > 100 || value.selection.some((id: unknown) => typeof id !== "string")) throw new Error();
    const documents = [value.document, ...value.past, ...value.future];
    const legacy = documents.some(isLegacyCadStarter);
    if (!documents.every(doc => isLegacyCadStarter(doc) || validDocument(doc))) throw new Error();
    const convert = (doc: CadDocument): CadDocument => isLegacyCadStarter(doc)
      ? { ...starterCadDocument(), revision: doc.revision, updatedAt: doc.updatedAt } : doc;
    const document = convert(value.document);
    const state = safeCadAuthoringState({ ...value, document });
    if (!state) throw new Error();
    return { kind: legacy ? "legacy" : "ready", state: { ...state, past: value.past.map(convert), future: value.future.map(convert) } };
  } catch {
    return { kind: "recovery", message: "This saved model or its history needs review. The original is preserved; modified older plans are never repaired automatically." };
  }
}

export type CadWriteResult = { ok: true; raw: string } | { ok: false; error: string };
export function writeCadRecord(store: Store, expected: string | null | undefined, state: CadAuthoringState, backup = false): CadWriteResult {
  if (expected === undefined) return { ok: false, error: "Storage could not be read. Reload before saving, or export your work." };
  const raw = JSON.stringify({ ...state, transaction: null });
  if (bytes(raw) > CAD_MAX_BYTES) return { ok: false, error: "Model and history exceed the 2 MB limit. Export a backup before continuing." };
  if (readCadRecord(raw).kind !== "ready") return { ok: false, error: "The model or its history failed validation. Export your work for review." };
  try {
    if (store.getItem(CAD_AUTHORING_KEY) !== expected) return { ok: false, error: "Another tab changed this model. Export your work, then reload the saved version before continuing." };
    if (backup && expected !== null) store.setItem(CAD_BACKUP_KEY, expected);
    store.setItem(CAD_AUTHORING_KEY, raw);
    return { ok: true, raw };
  } catch {
    return { ok: false, error: "The browser could not save this change. Export your work; the saved model has not been replaced." };
  }
}

export function rollbackCadRecord(store: Store, expected: string | null | undefined): { ok: true; raw: string } | { ok: false; error: string } {
  try {
    if (expected === undefined || store.getItem(CAD_AUTHORING_KEY) !== expected) return { ok: false, error: "The saved model changed. Reload before restoring a backup." };
    const raw = store.getItem(CAD_BACKUP_KEY);
    if (raw === null) return { ok: false, error: "No previous saved model is available." };
    // Retain the backup if the model write fails. Rollback deliberately restores
    // exact bytes, even when that returns the editor to its recovery screen.
    store.setItem(CAD_AUTHORING_KEY, raw);
    return { ok: true, raw };
  } catch { return { ok: false, error: "The browser could not restore the backup. Download it and try again." }; }
}
