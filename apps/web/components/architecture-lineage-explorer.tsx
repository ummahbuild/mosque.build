"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import lineages from "@/data/architecture-lineages.json";
import references from "@/data/architecture-image-references.json";
import {ARCHITECTURE_REFERENCE_ACTIONS_KEY,ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA,actionCategoryLabel,actionsForLineage,safeReferenceActions,type ArchitectureActionCategory} from "@/lib/architecture-reference-actions";
import patterns from "@/lib/pattern-catalog";
import "./architecture-reference.css";

const directionKey = "mosque-build.architecture-direction.v1";
const shortlistKey = "mosque-build.pattern-shortlist.v1";
const patternMap = new Map(patterns.map(pattern => [pattern.id, pattern]));
const referenceMap = new Map(references.map(reference => [reference.lineageId, reference]));

export function ArchitectureLineageExplorer() {
  const [selectedId, setSelectedId] = useState(lineages[0].id);
  const [savedId, setSavedId] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState<"all"|ArchitectureActionCategory>("all");
  const [actionNotes, setActionNotes] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const active = lineages.find(item => item.id === selectedId) ?? lineages[0];
  const reference = referenceMap.get(active.id)!;
  const referenceActions = useMemo(() => actionsForLineage(active.id), [active]);
  const visibleActions = actionFilter === "all" ? referenceActions : referenceActions.filter(item => item.category === actionFilter);
  const compatible = useMemo(() => active.compatiblePatternIds.flatMap(id => {
    const pattern = patternMap.get(id);
    return pattern ? [pattern] : [];
  }), [active]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(directionKey) || "null") as {lineageId?: string} | null;
      if (stored?.lineageId && lineages.some(item => item.id === stored.lineageId)) {
        setSelectedId(stored.lineageId);
        setSavedId(stored.lineageId);
      }
      const savedActions = safeReferenceActions(JSON.parse(localStorage.getItem(ARCHITECTURE_REFERENCE_ACTIONS_KEY) || "null"));
      setSelectedActions(savedActions.selectedIds);
      setActionNotes(savedActions.notes);
    } catch {}
  }, []);

  function saveDirection() {
    const record = {lineageId: active.id, savedAt: new Date().toISOString(), status: "concept"};
    try { localStorage.setItem(directionKey, JSON.stringify(record)); } catch {}
    setSavedId(active.id);
    dispatchEvent(new Event("mosque-build:project-change"));
  }

  function saveCompatiblePatterns() {
    try {
      const current = JSON.parse(localStorage.getItem(shortlistKey) || "[]") as string[];
      const next = [...new Set([...current, ...active.compatiblePatternIds])];
      localStorage.setItem(shortlistKey, JSON.stringify(next));
      dispatchEvent(new Event("mosque-build:project-change"));
    } catch {}
  }

  function toggleAction(id:string) {
    setActionMessage("");
    setSelectedActions(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id].slice(0, 100));
  }

  function saveReferenceActions() {
    const record = {schema: ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA, updatedAt: new Date().toISOString(), selectedIds: selectedActions, notes: actionNotes.trim()};
    try {
      localStorage.setItem(ARCHITECTURE_REFERENCE_ACTIONS_KEY, JSON.stringify(record));
      dispatchEvent(new Event("mosque-build:project-change"));
      setActionMessage(`${selectedActions.length} reference action${selectedActions.length === 1 ? "" : "s"} saved to this project.`);
    } catch { setActionMessage("This browser could not save the reference actions."); }
  }

  function exportReferenceActions() {
    const selected = referenceActions.filter(item => selectedActions.includes(item.id));
    const payload = {schema: ARCHITECTURE_REFERENCE_ACTIONS_SCHEMA, exportedAt: new Date().toISOString(), lineageId: active.id, lineageTitle: active.title, reference, selectedActions: selected, notes: actionNotes.trim(), boundary: "Reference actions are design prompts for accountable review. They are not authenticity findings, specifications, compliance checks, cost advice, construction instructions or approvals."};
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"}));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mosque-build-${active.id}-reference-actions.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setActionMessage("Reference action packet exported with source and review boundaries.");
  }

  return <section className="lineageExplorer" aria-labelledby="lineage-title">
    <header>
      <div><span className="eyebrow">ARCHITECTURE STUDY</span><h2 id="lineage-title">Start with space, climate and craft.</h2><p>Compare documented lineages without turning them into a style catalogue. Saving one records a study direction—not a final design or authenticity claim.</p></div>
      <div className="lineageBoundary"><b>Concept boundary</b><span>Structural, fire, accessibility, environmental and religious review still apply.</span></div>
    </header>
    <div className="lineageTabs" role="tablist" aria-label="Architecture lineages">
      {lineages.map(item => <button key={item.id} id={`lineage-tab-${item.id}`} type="button" role="tab" aria-selected={active.id === item.id} aria-controls="lineage-panel" onClick={() => setSelectedId(item.id)}><small>{item.region}</small><span>{item.title}</span>{savedId === item.id ? <i>Saved direction</i> : null}</button>)}
    </div>
    <article className="lineagePanel" id="lineage-panel" role="tabpanel" aria-labelledby={`lineage-tab-${active.id}`} tabIndex={0}>
      <header><div><small>{active.period} · {active.status.replace("_", " ")}</small><h3>{active.title}</h3><p>{active.summary}</p></div><div className={`lineageDiagram lineageDiagram-${active.id}`} aria-hidden="true"><i/><i/><i/><i/></div></header>
      <section className="lineageReference" aria-label={`Built reference for ${active.title}`}>
        <figure><img key={reference.lineageId} src={reference.imageUrl} alt={`${reference.exampleName}: ${reference.classificationFocus}`} loading="lazy" decoding="async"/><figcaption>{reference.classificationFocus}</figcaption></figure>
        <div className="lineageReferenceInfo"><small>CLASSIFIED BUILT REFERENCE</small><h4>{reference.exampleName}</h4><p>{reference.relationship}</p><div className="lineageReferenceMeta"><span>Photograph: {reference.creator}</span><span>{reference.license} · observed {reference.observedAt}</span><span>Image record: {reference.confidence.replace("_", " ")}</span></div><div className="lineageReferenceLinks"><a href={reference.sourcePage} target="_blank" rel="noopener noreferrer">View image record ↗</a><a href={reference.licenseUrl} target="_blank" rel="noopener noreferrer">Review license ↗</a></div><p className="lineageReferenceNotice">Reference photography supports precedent study only. Verify history, community meaning, alterations and construction evidence through the linked lineage source and qualified local review.</p></div>
      </section>
      <section className="referenceActionPlanner" aria-labelledby="reference-actions-title">
        <header>
          <div><small>REFERENCE TO DESIGN</small><h4 id="reference-actions-title">Turn this precedent into reviewable project actions.</h4><p>Select the prompts worth carrying into the project. They stay tied to the source, image record and review gate.</p></div>
          <b>{selectedActions.filter(id => referenceActions.some(item => item.id === id)).length}/{referenceActions.length} selected here</b>
        </header>
        <div className="referenceActionFilters" role="group" aria-label="Reference action filters">
          {(["all","spatial","climate-material","test-move","misuse-guard"] as const).map(item => <button key={item} type="button" aria-pressed={actionFilter === item} onClick={() => setActionFilter(item)}>{item === "all" ? "All" : actionCategoryLabel(item)}</button>)}
        </div>
        <div className="referenceActionGrid">{visibleActions.map(item => <article key={item.id} data-selected={selectedActions.includes(item.id)}><header><span>{actionCategoryLabel(item.category)}</span><button type="button" aria-pressed={selectedActions.includes(item.id)} onClick={() => toggleAction(item.id)}>{selectedActions.includes(item.id) ? "Selected" : "Add"}</button></header><p>{item.prompt}</p><dl><div><dt>Evidence</dt><dd>{item.evidenceNeeded}</dd></div><div><dt>Review</dt><dd>{item.reviewGate}</dd></div></dl></article>)}</div>
        <label className="referenceActionNotes">Project translation notes<textarea rows={3} value={actionNotes} onChange={event => setActionNotes(event.target.value)} placeholder="Record why selected prompts matter for this site, climate, community, budget or stewardship plan."/></label>
        <footer><button type="button" className="secondaryButton" onClick={exportReferenceActions} disabled={!selectedActions.some(id => referenceActions.some(item => item.id === id))}>Export selected actions</button><button type="button" className="button" onClick={saveReferenceActions}>Save reference actions</button><p role="status" aria-live="polite">{actionMessage}</p></footer>
      </section>
      <div className="lineageColumns">
        <section><h4>Spatial DNA</h4><ul>{active.spatialPrinciples.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>Climate + material questions</h4><ul>{active.climateAndMaterial.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section><h4>Moves to test</h4><ol>{active.designMoves.map(item => <li key={item}>{item}</li>)}</ol></section>
        <section className="lineageAvoid"><h4>Avoid false shortcuts</h4><ul>{active.avoid.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <section className="compatibleStudies" aria-labelledby="compatible-title"><div><small>COMPATIBLE STUDIES</small><h4 id="compatible-title">Patterns to evaluate—not automatically apply</h4></div><div>{compatible.map(pattern => <a href={`#pattern-${pattern.id}`} key={pattern.id}><span className={`patternSwatch pattern-${pattern.style}`} aria-hidden="true"/><b>{pattern.title}</b><small>{pattern.application}</small></a>)}</div></section>
      <footer><div className="sourceStamp"><b>{active.source.label}</b><span>Observed {active.source.observedAt}</span><span>{active.source.confidence.replace("_", " ")} confidence</span><span>{active.source.rights}</span><a href={active.source.url} target={active.source.url.startsWith("http") ? "_blank" : undefined} rel={active.source.url.startsWith("http") ? "noopener noreferrer" : undefined}>Review source ↗</a></div><div className="lineageActions"><button className="secondaryButton" type="button" onClick={saveCompatiblePatterns}>Save related studies</button><button className="button" type="button" onClick={saveDirection}>{savedId === active.id ? "Direction saved ✓" : "Use as a study direction"}</button><Link href="/design">Test in Design Studio →</Link></div></footer>
    </article>
  </section>;
}
