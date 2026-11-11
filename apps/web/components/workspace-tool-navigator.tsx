"use client";
import {useEffect, useMemo, useRef, useState} from "react";
import {filterWorkspaceTools, workspaceHashId, workspaceId, workspaceScrollTop, type WorkspaceTool} from "@/lib/workspace-navigation";
import "./workspace-tool-navigator.css";

export function WorkspaceToolNavigator() {
  const [tools,setTools]=useState<WorkspaceTool[]>([]), [active,setActive]=useState("");
  const [open,setOpen]=useState(false), [query,setQuery]=useState(""), [progress,setProgress]=useState(0);
  const [stickyTop,setStickyTop]=useState(134), [panelHeight,setPanelHeight]=useState(480);
  const navRef=useRef<HTMLElement>(null), toggleRef=useRef<HTMLButtonElement>(null), searchRef=useRef<HTMLInputElement>(null);
  const navigateRef=useRef<(id:string, focus?:boolean)=>void>(()=>{});

  useEffect(()=>{
    const root=document.getElementById("workspace"), nav=navRef.current;
    if(!root||!nav)return;
    const siteHeader=document.querySelector<HTMLElement>(".siteNav"), pageNav=document.querySelector<HTMLElement>(".workspaceNav");
    let sections:HTMLElement[]=[], signature="", frame=0, initialFrame=0, initialHashHandled=false;
    const heights=()=>({header:siteHeader?.getBoundingClientRect().height??0,page:pageNav?.getBoundingClientRect().height??0,tools:nav.getBoundingClientRect().height});
    const measure=()=>{
      const h=heights(); setStickyTop(h.header+h.page);
      // visualViewport also accounts for an on-screen keyboard where supported.
      const viewportBottom=window.visualViewport ? window.visualViewport.offsetTop+window.visualViewport.height : innerHeight;
      setPanelHeight(Math.max(100,Math.min(620,viewportBottom-Math.max(nav.getBoundingClientRect().bottom,h.header+h.page+h.tools)-12)));
      root.style.setProperty("--workspace-anchor-offset",`${h.header+h.page+h.tools+16}px`);
      if(pageNav)pageNav.style.top=`${h.header}px`;
    };
    const onScroll=()=>{
      measure();
      const start=root.getBoundingClientRect().top+scrollY, end=start+root.offsetHeight-innerHeight;
      setProgress(end<=start?100:Math.max(0,Math.min(100,Math.round((scrollY-start)/(end-start)*100))));
      const h=heights(), readingLine=h.header+h.page+h.tools+48;
      let current=sections[0];
      for(const section of sections){if(section.getBoundingClientRect().top<=readingLine)current=section;else break;}
      if(current)setActive(current.id);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;onScroll()})};
    const navigate=(id:string, focus=true)=>{
      const target=document.getElementById(id);
      if(!target||!(target===root||root.contains(target)))return;
      // Reading the target after :target is applied gives its real laid-out size.
      const h=heights();
      if(focus){if(!target.hasAttribute("tabindex"))target.tabIndex=-1;target.focus({preventScroll:true});}
      window.scrollTo({top:workspaceScrollTop(target.getBoundingClientRect().top,scrollY,h.header,h.page,id==="workspace"?0:h.tools),behavior:!focus||matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
      setOpen(false);setActive(id);schedule();
    };
    navigateRef.current=navigate;
    const observer=new IntersectionObserver(schedule,{rootMargin:"-18% 0px -68%",threshold:[0,.1,.4]});
    const refresh=()=>{
      sections=[...root.children].filter(node=>node instanceof HTMLElement&&!node.classList.contains("workspaceSectionIntro")&&!node.classList.contains("toolNavigator")&&node.querySelector("h2")) as HTMLElement[];
      const seen=new Set<string>();
      const items=sections.map((node,index)=>{
        const label=(node.querySelector("h2")?.textContent||`Tool ${index+1}`).trim();
        const id=workspaceId(node.id,label,index,id=>seen.has(id)||!!document.getElementById(id)&&document.getElementById(id)!==node);
        if(node.id!==id)node.id=id;
        seen.add(id);node.dataset.workspaceTool="true";
        return{id,label,eyebrow:(node.querySelector(".eyebrow")?.textContent||`Tool ${index+1}`).trim()};
      });
      const next=JSON.stringify(items);
      if(next!==signature){signature=next;setTools(items);observer.disconnect();sections.forEach(section=>observer.observe(section));}
      if(!initialHashHandled){const id=workspaceHashId(location.hash);if(!id)initialHashHandled=true;else if(document.getElementById(id)){initialHashHandled=true;initialFrame=requestAnimationFrame(()=>navigate(id,false));}}
      schedule();
    };
    const fromHistory=()=>{const id=workspaceHashId(location.hash);if(id)navigate(id)};
    const oldPageTop=pageNav?.style.top??"";
    const sizes=new ResizeObserver(schedule);
    [siteHeader,pageNav,nav].forEach(node=>{if(node)sizes.observe(node)});
    const mutations=new MutationObserver(refresh);
    mutations.observe(root,{childList:true,subtree:true});
    refresh();
    addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule,{passive:true});addEventListener("hashchange",fromHistory);
    window.visualViewport?.addEventListener("resize",schedule);
    return()=>{
      observer.disconnect();mutations.disconnect();sizes.disconnect();cancelAnimationFrame(frame);cancelAnimationFrame(initialFrame);navigateRef.current=()=>{};
      removeEventListener("scroll",schedule);removeEventListener("resize",schedule);removeEventListener("hashchange",fromHistory);
      window.visualViewport?.removeEventListener("resize",schedule);root.style.removeProperty("--workspace-anchor-offset");if(pageNav)pageNav.style.top=oldPageTop;
    };
  },[]);

  useEffect(()=>{
    if(!open)return;
    searchRef.current?.focus({preventScroll:true});
    const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();setOpen(false);toggleRef.current?.focus({preventScroll:true})}};
    const outside=(event:PointerEvent)=>{if(!navRef.current?.contains(event.target as Node))setOpen(false)};
    addEventListener("keydown",escape);addEventListener("pointerdown",outside);
    return()=>{removeEventListener("keydown",escape);removeEventListener("pointerdown",outside)};
  },[open]);

  const visible=useMemo(()=>filterWorkspaceTools(tools,query),[tools,query]), index=tools.findIndex(tool=>tool.id===active);
  const go=(id:string)=>{if(!id)return;const hash=`#${encodeURIComponent(id)}`;if(location.hash!==hash)history.pushState(null,"",hash);navigateRef.current(id)};
  const follow=(event:React.MouseEvent<HTMLAnchorElement>,id:string)=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go(id)};
  // Keep the observing element mounted while headings are discovered.
  return <aside ref={navRef} className="toolNavigator" aria-label="Planning tools" hidden={tools.length<2} style={{top:stickyTop}} onBlur={event=>{if(event.relatedTarget&&!event.currentTarget.contains(event.relatedTarget as Node))setOpen(false)}}>
    <div className="toolProgress" aria-hidden="true"><i style={{width:`${progress}%`}}/></div>
    <div className="toolNavigatorBar">
      <button ref={toggleRef} className="toolBrowse" type="button" aria-expanded={open} aria-controls="tool-navigator-panel" onClick={()=>setOpen(value=>!value)}><span>Jump to a planning tool</span><b>{Math.max(1,index+1)} of {tools.length}</b><i aria-hidden="true">{open?"×":"⌄"}</i></button>
      <div className="toolCurrent"><small>YOU ARE HERE</small><span>{tools[index]?.label||"Planning tools"}</span></div>
      <div className="toolStep"><button type="button" disabled={index<=0} onClick={()=>go(tools[index-1]?.id)} aria-label="Previous planning tool">← <span>Previous</span></button><button type="button" disabled={index<0||index>=tools.length-1} onClick={()=>go(tools[index+1]?.id)} aria-label="Next planning tool"><span>Next</span> →</button></div>
    </div>
    {open&&<div id="tool-navigator-panel" className="toolNavigatorPanel" style={{maxHeight:panelHeight}}>
      <header><label>Find a planning tool<input ref={searchRef} type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search this page"/></label><button type="button" onClick={()=>{setOpen(false);toggleRef.current?.focus({preventScroll:true})}}>Close tools</button></header>
      <div className="toolSearchActions"><a href="#workspace" onClick={event=>follow(event,"workspace")}>Back to the top ↑</a>{query&&<button type="button" onClick={()=>{setQuery("");searchRef.current?.focus({preventScroll:true})}}>Clear search</button>}<span role="status">{visible.length} of {tools.length} tools</span></div>
      <nav aria-label="Jump to a planning tool">{visible.map(tool=><a href={`#${encodeURIComponent(tool.id)}`} key={tool.id} aria-current={tool.id===active?"location":undefined} onClick={event=>follow(event,tool.id)}><span>{String(tools.indexOf(tool)+1).padStart(2,"0")}</span><b>{tool.label}</b><small>{tool.eyebrow}</small></a>)}</nav>
      {!visible.length&&<p>No planning tools match “{query}”. Clear the search to see all {tools.length}.</p>}
    </div>}
  </aside>;
}
