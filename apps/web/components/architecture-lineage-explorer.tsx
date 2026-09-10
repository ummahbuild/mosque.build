"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import lineages from "@/data/architecture-lineages.json";
import patterns from "@/lib/pattern-catalog";

const directionKey = "mosque-build.architecture-direction.v1";
const shortlistKey = "mosque-build.pattern-shortlist.v1";
const patternMap = new Map(patterns.map(pattern => [pattern.id, pattern]));

export function ArchitectureLineageExplorer() {
  const [selectedId, setSelectedId] = useState(lineages[0].id);
  const [savedId, setSavedId] = useState("");
  const active = lineages.find(item => item.id === selectedId) ?? lineages[0];
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
    } catch {}
  }, []);

  function saveDirection() {
    const record = {lineageId: active.id, savedAt: new Date().toISOString(), status: "concept"};
    try { localStorage.setItem(directionKey, JSON.stringify(record)); } catch {}
    setSavedId(active.id);
  }

  function saveCompatiblePatterns() {
    try {
      const current = JSON.parse(localStorage.getItem(shortlistKey) || "[]") as string[];
      const next = [...new Set([...current, ...active.compatiblePatternIds])];
      localStorage.setItem(shortlistKey, JSON.stringify(next));
    } catch {}
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
