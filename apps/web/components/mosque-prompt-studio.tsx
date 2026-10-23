"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import "./mosque-prompt-studio.css";

export const conceptPrompts=[
{title:"Moroccan courtyard · Nairobi",group:"New mosque",text:"Design a Moroccan-inspired mosque in Kilimani, Nairobi for 450 worshippers, with a madrasa, shaded courtyard and natural ventilation, below USD 1 million. Include a phased budget and local-material alternatives."},
{title:"Indian modern · multistorey",group:"Urban mosque",text:"Plan a 3-storey mosque in Nairobi for 700 worshippers combining Indian Islamic architectural details with contemporary timber, generous daylight, accessible lifts and a community clinic."},
{title:"Mall prayer room",group:"Adaptive reuse",text:"Convert an existing top-floor retail unit in a busy mall into a modest 80-person prayer room with qibla alignment, acoustic privacy, accessible wudu and safe circulation. No dome required."},
{title:"Swahili coastal · Mombasa",group:"Regional tradition",text:"Create a Swahili coastal mosque in Mombasa for 250 worshippers using coral-stone-inspired finishes, screened verandas, cross ventilation and a rainwater strategy."},
{title:"Low-cost rural · Kenya",group:"Budget first",text:"Develop a simple rural Kenyan mosque for 120 worshippers with a low-cost roof, locally sourced masonry, rainwater harvesting and room for future expansion under USD 90,000."},
{title:"Women-led community hub",group:"Community",text:"Design an inclusive urban mosque and community center with equitable women's prayer space, daycare, counseling rooms, a library, step-free access and flexible event space for 300."},
{title:"Minimal prayer pavilion",group:"Small footprint",text:"Design a 60-person contemporary prayer pavilion on a narrow infill site with filtered daylight, passive cooling, a quiet wudu area and no minaret."},
{title:"Ottoman-informed campus",group:"Historic inspiration",text:"Explore an Ottoman-informed central-dome mosque for 1000 people with a school, library and landscaped public square. Compare long-span roof alternatives and phased costs."},
{title:"Reuse an old warehouse",group:"Adaptive reuse",text:"Turn a disused warehouse into a 500-person mosque with an exposed industrial structure, accessible prayer areas and classrooms, while retaining as much of the existing fabric as possible."},
{title:"Sahelian earth architecture",group:"Climate",text:"Design a Sahelian-inspired mosque for 350 people using passive cooling, earth-based material studies, thick shaded walls and a maintenance strategy for seasonal rainfall."},
{title:"Solar-powered neighborhood",group:"Resilience",text:"Plan a resilient mosque for 400 worshippers with a rooftop solar concept, battery-ready infrastructure, greywater options and a shaded courtyard. Separate assumptions from engineering facts."},
{title:"Tiny airport musalla",group:"Adaptive reuse",text:"Fit a 35-person prayer room into an airport concourse with separate accessible washing facilities, luggage storage, clear wayfinding and a non-obstructive entrance."}
] as const;
const STORE_KEY="mosque-build.concept-prompt.v1";
export function MosquePromptStudio(){
 const [value,setValue]=useState(""),[active,setActive]=useState(0),[typing,setTyping]=useState(true),[saved,setSaved]=useState(false);
 useEffect(()=>{try{const v=localStorage.getItem(STORE_KEY);if(v){setValue(v);setTyping(false)}}catch{}},[]);
 useEffect(()=>{if(value.trim()||!typing)return;const timer=window.setInterval(()=>setActive(x=>(x+1)%conceptPrompts.length),4600);return()=>window.clearInterval(timer)},[typing,value]);
 const choose=(text:string)=>{setValue(text);setTyping(false);setSaved(false)};
 const save=()=>{if(!value.trim())return;try{localStorage.setItem(STORE_KEY,value.trim());setSaved(true)}catch{setSaved(false)}};
 return <section className="mosquePrompt" aria-labelledby="mosque-prompt-heading">
 <div className="mosquePromptHead"><span className="mosquePromptOverline">Imagine it. Plan it. Build it together.</span><h2 id="mosque-prompt-heading">Describe the mosque you want to build.</h2><p>Start with a sentence, then use mosque.build to develop the site, space, cost and construction brief. Your prompt stays on this device when saved.</p></div>
 <div className="mosquePromptEditor"><label htmlFor="mosque-prompt">Your mosque concept</label><div className="mosquePromptField"><textarea id="mosque-prompt" rows={4} maxLength={3000} value={value} onChange={e=>{setValue(e.target.value);setTyping(false);setSaved(false)}} aria-describedby="mosque-prompt-help" placeholder={conceptPrompts[active].text}/>{!value&&<span className="mosquePromptHint" aria-hidden="true">Try: {conceptPrompts[active].title} <span className="mosquePromptCaret">|</span></span>}</div><div className="mosquePromptActions"><span id="mosque-prompt-help">Describe location, capacity, budget, local style, school or wudu spaces. No AI generation is claimed yet.</span><button type="button" onClick={save} disabled={!value.trim()} className="mosquePromptSave">Save concept locally ↗</button></div>{saved&&<p role="status" className="mosquePromptSaved">Concept saved on this device. Continue into the existing planning tools to develop your project.</p>}
 <div className="mosquePromptTools"><Link href="/start">Start project brief →</Link><Link href="/design">Explore design tools →</Link><Link href="/prototypes">Browse examples →</Link></div></div>
 <div className="mosquePromptExamples"><div className="mosquePromptExamplesHeading"><h3>Or start from an idea</h3><span>Tap an example to edit it</span></div><div className="mosquePromptChips">{conceptPrompts.map(p=><button type="button" key={p.title} onClick={()=>choose(p.text)}><small>{p.group}</small><strong>{p.title}</strong></button>)}</div></div>
 </section>;
}
