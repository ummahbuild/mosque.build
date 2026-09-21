"use client";

import {useEffect,useMemo,useState} from "react";
import {mosqueArchitectureAtlas,MOSQUE_ARCHITECTURE_ATLAS_KEY,MOSQUE_ARCHITECTURE_ATLAS_SCHEMA,safeAtlasStudyRecord,type AtlasStudyRecord,type MosqueArchitectureProfile} from "@/lib/mosque-architecture-atlas";
import "./mosque-architecture-atlas.css";

type SaveState="idle"|"saved"|"exported";

function downloadJson(filename:string,value:unknown){
  const blob=new Blob([JSON.stringify(value,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=filename;
  link.click();
  URL.revokeObjectURL(url);
}

function readSavedAtlas():AtlasStudyRecord{
  try{return safeAtlasStudyRecord(JSON.parse(localStorage.getItem(MOSQUE_ARCHITECTURE_ATLAS_KEY)??"null"))}
  catch{return safeAtlasStudyRecord(null)}
}

function sourceHost(url:string){
  try{return new URL(url).hostname.replace(/^www\./,"")}
  catch{return "source"}
}

function ReferenceImage({profile}:{profile:MosqueArchitectureProfile}){
  if(!profile.referenceImage)return <div className="atlasImageFallback" aria-label={`No image loaded for ${profile.title}`}>Reference image pending</div>;
  return <img src={profile.referenceImage} alt={`${profile.referenceName}, reference example for ${profile.title}`} loading="lazy"/>;
}

export function MosqueArchitectureAtlas(){
  const [record,setRecord]=useState<AtlasStudyRecord>(()=>safeAtlasStudyRecord(null));
  const [status,setStatus]=useState<SaveState>("idle");

  useEffect(()=>{setRecord(readSavedAtlas())},[]);

  const selected=useMemo(()=>mosqueArchitectureAtlas.find(item=>item.id===record.styleId)??mosqueArchitectureAtlas[0], [record.styleId]);
  const savedFrames=new Set(record.savedFrameIds);
  const selectedSavedFrames=selected.mockupFrames.filter(frame=>savedFrames.has(frame.id));

  function update(next:Partial<AtlasStudyRecord>){
    setStatus("idle");
    setRecord(current=>safeAtlasStudyRecord({...current,...next,updatedAt:new Date().toISOString()}));
  }

  function toggleFrame(id:string){
    const next=savedFrames.has(id)?record.savedFrameIds.filter(frameId=>frameId!==id):[...record.savedFrameIds,id];
    update({savedFrameIds:next});
  }

  function saveAtlas(){
    const next=safeAtlasStudyRecord({...record,updatedAt:new Date().toISOString()});
    localStorage.setItem(MOSQUE_ARCHITECTURE_ATLAS_KEY,JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("mosque-build:project-change",{detail:{key:MOSQUE_ARCHITECTURE_ATLAS_KEY}}));
    setRecord(next);
    setStatus("saved");
  }

  function exportAtlas(){
    const packet={
      schema:MOSQUE_ARCHITECTURE_ATLAS_SCHEMA,
      exportedAt:new Date().toISOString(),
      activeStyle:selected,
      selectedFrames:selectedSavedFrames,
      projectNotes:record.projectNotes,
      boundary:selected.boundary
    };
    downloadJson(`mosque-build-${selected.id}-architecture-atlas.json`,packet);
    setStatus("exported");
  }

  return <section className="mosqueAtlas" aria-labelledby="mosque-architecture-atlas-title">
    <div className="atlasIntro">
      <div>
        <span className="eyebrow">MOSQUE ARCHITECTURE ATLAS</span>
        <h2 id="mosque-architecture-atlas-title">Study every style as a complete system.</h2>
        <p>Use sourced examples, textbook anatomy and reviewable mockup frames to brief a project team before choosing a style. These references support design conversations; they are not approvals, specifications or claims of authenticity.</p>
      </div>
      <div className="atlasStatPanel" aria-label="Atlas coverage">
        <strong>{mosqueArchitectureAtlas.length}</strong>
        <span>style lineages</span>
        <small>with source links, reference images, anatomy notes and mockup frames</small>
      </div>
    </div>

    <div className="atlasLayout">
      <nav className="atlasStyleRail" aria-label="Mosque style references">
        {mosqueArchitectureAtlas.map(profile=><button
          key={profile.id}
          type="button"
          className={profile.id===selected.id?"active":""}
          onClick={()=>update({styleId:profile.id})}
          aria-pressed={profile.id===selected.id}
        >
          <span>{profile.title}</span>
          <small>{profile.region}</small>
        </button>)}
      </nav>

      <article className="atlasProfile">
        <div className="atlasReferenceCard">
          <div className="atlasImage"><ReferenceImage profile={selected}/></div>
          <div className="atlasReferenceCopy">
            <span className="eyebrow">BUILT REFERENCE</span>
            <h3>{selected.referenceName}</h3>
            <p>{selected.title} - {selected.region}. Study the reference for spatial logic, climate response, craft discipline and limits before adapting any visual language.</p>
            <dl className="atlasMeta">
              <div><dt>Period</dt><dd>{selected.period}</dd></div>
              <div><dt>Confidence</dt><dd>{selected.confidence}</dd></div>
              <div><dt>Primary source</dt><dd><a href={selected.sourceUrl} target="_blank" rel="noreferrer">{sourceHost(selected.sourceUrl)}</a></dd></div>
              <div><dt>Image source</dt><dd><a href={selected.referenceSource} target="_blank" rel="noreferrer">{sourceHost(selected.referenceSource)}</a></dd></div>
            </dl>
          </div>
        </div>

        <div className="atlasTwoColumn">
          <section className="atlasPanel" aria-labelledby="atlas-anatomy-title">
            <h3 id="atlas-anatomy-title">Textbook anatomy</h3>
            <div className="atlasAnatomyGrid">
              {selected.textbookAnatomy.map(item=><div key={item.label}>
                <h4>{item.label}</h4>
                <p>{item.detail}</p>
              </div>)}
            </div>
          </section>

          <section className="atlasPanel" aria-labelledby="atlas-prompts-title">
            <h3 id="atlas-prompts-title">Review prompts</h3>
            <ul className="atlasPromptList">
              {selected.reviewPrompts.slice(0,8).map(prompt=><li key={prompt.id}>
                <span>{prompt.category.replace("-"," ")}</span>
                {prompt.prompt}
              </li>)}
            </ul>
          </section>
        </div>

        <section className="atlasPanel" aria-labelledby="atlas-frames-title">
          <div className="atlasPanelHeader">
            <div>
              <h3 id="atlas-frames-title">Mockup reference frames</h3>
              <p>Save the frames you want carried into the project package and design studio conversation.</p>
            </div>
            <span>{selectedSavedFrames.length} saved for this style</span>
          </div>
          <div className="atlasFrameGrid">
            {selected.mockupFrames.map(frame=><article key={frame.id} className={savedFrames.has(frame.id)?"selected":""}>
              <div>
                <h4>{frame.label}</h4>
                <p>{frame.purpose}</p>
              </div>
              <div className="atlasChipRow" aria-label={`${frame.label} should include`}>
                {frame.include.map(item=><span key={item}>{item}</span>)}
              </div>
              <footer>
                <small>{frame.reviewGate}</small>
                <button type="button" onClick={()=>toggleFrame(frame.id)}>{savedFrames.has(frame.id)?"Selected":"Save frame"}</button>
              </footer>
            </article>)}
          </div>
        </section>

        <section className="atlasPanel atlasNotes" aria-labelledby="atlas-notes-title">
          <label htmlFor="atlas-project-notes" id="atlas-notes-title">Project notes for this architecture study</label>
          <textarea id="atlas-project-notes" value={record.projectNotes} maxLength={1200} onChange={event=>update({projectNotes:event.target.value})} placeholder="Example: compare courtyard-first plan with compact urban option; ask architect to test daylight and women's access before committing to surface language."/>
          <div className="atlasActions">
            <p>{selected.boundary}</p>
            <div>
              <button type="button" className="secondaryButton" onClick={exportAtlas}>Export atlas packet</button>
              <button type="button" className="button" onClick={saveAtlas}>Save atlas study</button>
            </div>
          </div>
          {status!=="idle"&&<p className="atlasStatus" role="status">{status==="saved"?"Saved to your local project package.":"Downloaded a shareable atlas packet."}</p>}
        </section>
      </article>
    </div>
  </section>;
}
