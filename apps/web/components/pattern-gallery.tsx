"use client";

import Link from "next/link";
import {useEffect, useMemo, useState, type CSSProperties} from "react";
import patterns from "@/lib/pattern-catalog";

const shortlistKey = "mosque-build.pattern-shortlist.v1";
const categories = ["All", ...new Set(patterns.map(item => item.category))];
const computationalPreview=(style:string):CSSProperties|undefined=>{if(["star","hex","diamond","lattice","paving","rosette","slats","threshold","saff","arches"].includes(style))return;const seed=[...style].reduce((n,c)=>n+c.charCodeAt(0),0),angle=18+seed%64,size=24+seed%42;return{backgroundColor:seed%2?"#0b5749":"#eee5d1",backgroundImage:`repeating-conic-gradient(from ${angle}deg at ${35+seed%31}% ${34+(seed*3)%33}%, transparent 0 9deg, ${seed%2?"#d8ad56":"#0b5749"} 10deg 13deg, transparent 14deg 29deg), radial-gradient(circle at center, transparent 0 28%, ${seed%3?"rgba(255,255,255,.34)":"rgba(180,122,39,.35)"} 29% 32%, transparent 33%)`,backgroundSize:`${size}px ${size}px, ${size*2}px ${size*2}px`}};

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
        {filtered.map(item => <article id={`pattern-${item.id}`} className={`patternCard${active.id === item.id ? " active" : ""}`} key={item.id}>
          <button className={`patternVisual pattern-${item.style}`} style={computationalPreview(item.style)} type="button" onClick={() => setSelected(item.id)} aria-label={`Inspect ${item.title}`} aria-pressed={active.id === item.id}><span>{item.category}</span></button>
          <div><small>{item.status.replace("_", " ")}</small><h2>{item.title}</h2><p>{item.application}</p><div className="patternActions"><button type="button" onClick={() => setSelected(item.id)}>Review study</button><button type="button" aria-pressed={shortlist.includes(item.id)} onClick={() => toggle(item.id)}>{shortlist.includes(item.id) ? "Saved ✓" : "Save study"}</button></div></div>
        </article>)}
        {!filtered.length && <div className="workspaceEmpty"><h2>No matching studies</h2><p>Clear the search or choose another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}
      </section>
      <aside className="patternInspector" aria-live="polite">
        <div className={`patternVisual pattern-${active.style}`} style={computationalPreview(active.style)} aria-hidden="true" />
        <small>{active.category} · {active.status.replace("_", " ")}</small><h2>{active.title}</h2><p>{active.description}</p><div className="historicalContext"><b>Documented context</b><span>{active.historicalContext}</span></div>
        <h3>Review before selection</h3><ul>{active.reviewPoints.map(point => <li key={point}>{point}</li>)}</ul>
        <div className="sourceStamp"><b>{active.source.label}</b><span>Observed {active.source.observedAt}</span><span>{active.source.confidence.replace("_"," ")} confidence</span><span>{active.source.rights}</span><code>{active.source.path}</code><a href={active.source.url} target={active.source.url.startsWith("http")?"_blank":undefined} rel={active.source.url.startsWith("http")?"noopener noreferrer":undefined}>Open reference ↗</a></div>
        <button className="button" type="button" aria-pressed={shortlist.includes(active.id)} onClick={() => toggle(active.id)}>{shortlist.includes(active.id) ? "Remove from project studies" : "Add to project studies"}</button>
        <Link href="/my-project">Continue in my project →</Link>
      </aside>
    </div>
  </div>;
}
