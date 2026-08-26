"use client";

import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import patterns from "@/data/pattern-library.json";

const shortlistKey = "mosque-build.pattern-shortlist.v1";
const categories = ["All", ...new Set(patterns.map(item => item.category))];

export function PatternGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(patterns[0].id);
  const [shortlist, setShortlist] = useState<string[]>([]);

  useEffect(() => { try { setShortlist(JSON.parse(localStorage.getItem(shortlistKey) || "[]")); } catch {} }, []);
  const filtered = useMemo(() => patterns.filter(item => (category === "All" || item.category === category) && `${item.title} ${item.application} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const active = patterns.find(item => item.id === selected) || filtered[0] || patterns[0];
  const toggle = (id: string) => setShortlist(current => { const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id]; try { localStorage.setItem(shortlistKey, JSON.stringify(next)); } catch {} return next; });

  return <div className="patternExplorer">
    <section className="patternTools" aria-label="Pattern library controls">
      <label><span>Search studies</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by use or name…" /></label>
      <div className="patternFilters" aria-label="Filter by category">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p aria-live="polite">{filtered.length} studies shown · {shortlist.length} saved on this device</p>
    </section>
    <div className="patternLayout">
      <section className="patternGrid" aria-label="Illustrative pattern studies">
        {filtered.map(item => <article className={`patternCard${active.id === item.id ? " active" : ""}`} key={item.id}>
          <button className={`patternVisual pattern-${item.style}`} type="button" onClick={() => setSelected(item.id)} aria-label={`Inspect ${item.title}`} aria-pressed={active.id === item.id}><span>{item.category}</span></button>
          <div><small>{item.status.replace("_", " ")}</small><h2>{item.title}</h2><p>{item.application}</p><div className="patternActions"><button type="button" onClick={() => setSelected(item.id)}>Review study</button><button type="button" aria-pressed={shortlist.includes(item.id)} onClick={() => toggle(item.id)}>{shortlist.includes(item.id) ? "Saved ✓" : "Save study"}</button></div></div>
        </article>)}
        {!filtered.length && <div className="workspaceEmpty"><h2>No matching studies</h2><p>Clear the search or choose another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}
      </section>
      <aside className="patternInspector" aria-live="polite">
        <div className={`patternVisual pattern-${active.style}`} aria-hidden="true" />
        <small>{active.category} · {active.status.replace("_", " ")}</small><h2>{active.title}</h2><p>{active.description}</p><div className="historicalContext"><b>Documented context</b><span>{active.historicalContext}</span></div>
        <h3>Review before selection</h3><ul>{active.reviewPoints.map(point => <li key={point}>{point}</li>)}</ul>
        <div className="sourceStamp"><b>{active.source.label}</b><span>Observed {active.source.observedAt}</span><span>{active.source.confidence.replace("_"," ")} confidence</span><span>{active.source.rights}</span><code>{active.source.path}</code><a href={active.source.url} target={active.source.url.startsWith("http")?"_blank":undefined} rel={active.source.url.startsWith("http")?"noopener noreferrer":undefined}>Open reference ↗</a></div>
        <button className="button" type="button" aria-pressed={shortlist.includes(active.id)} onClick={() => toggle(active.id)}>{shortlist.includes(active.id) ? "Remove from project studies" : "Add to project studies"}</button>
        <Link href="/my-project">Continue in my project →</Link>
      </aside>
    </div>
  </div>;
}
