"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";

const links = [
  ["/features", "How it works"],
  ["/studio", "Design studio"],
  ["/patterns", "Patterns"],
  ["/permits", "Permits"],
  ["/marketplace", "Marketplace"],
  ["/funding", "Funding + Waqf"],
  ["/construction", "Build"],
  ["/resources", "Resources"],
  ["/contribute", "Contribute"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [open, setOpen] = useState(false);
  const [projectEntry,setProjectEntry]=useState({href:"/start",label:"Start a project"});
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(()=>{try{const draft=JSON.parse(localStorage.getItem("mosque-build.project-draft.v2")||"null");if(!draft?.name?.trim())return;const complete=!!(draft.location?.trim()&&draft.needs?.length&&draft.priorities?.length&&draft.constraints?.length&&draft.owner?.trim()&&draft.team?.length&&draft.funding?.length);setProjectEntry(complete?{href:"/my-project",label:"Continue project"}:{href:"/start",label:"Continue brief"})}catch{}},[pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOutside);
    const focusable=header.current?.querySelectorAll<HTMLElement>('#mobile-navigation a, .menuButton');
    const keepFocus=(event:KeyboardEvent)=>{if(event.key!=="Tab"||!focusable?.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}};
    const closeWide=()=>{if(innerWidth>1100)setOpen(false)};
    window.addEventListener("keydown",keepFocus);
    window.addEventListener("resize",closeWide,{passive:true});
    return () => {
      document.body.style.overflow=previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("keydown",keepFocus);
      window.removeEventListener("resize",closeWide);
    };
  }, [open]);

  return <header ref={header} className="siteNav">
    <Link className="brand" href="/" aria-label="mosque.build home"><span className="brandMark" aria-hidden="true">⌂</span><span>mosque<span className="brandDot">.</span>build</span></Link>
    <nav className="navLinks" aria-label="Primary navigation">{links.map(([href, label]) => <Link href={href} key={href} aria-current={isCurrent(href) ? "page" : undefined}>{label}</Link>)}</nav>
    <div className="navActions">
      <Link className="textButton" href="/studio" aria-current={pathname === "/studio" ? "page" : undefined}>Design studio</Link>
      <Link className="textButton projectNavLink" href="/my-project" aria-current={pathname === "/my-project" ? "page" : undefined}>My project</Link>
      <Link className="button small" href={projectEntry.href} aria-current={pathname === projectEntry.href ? "page" : undefined}>{projectEntry.label}</Link>
      <button ref={menuButton} className="menuButton" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
    </div>
    <nav id="mobile-navigation" className={`mobileNav${open ? " open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open} inert={!open?true:undefined}>
      <strong>Explore mosque.build</strong>
      {links.map(([href, label]) => <Link href={href} key={href} aria-current={isCurrent(href) ? "page" : undefined} tabIndex={open ? 0 : -1}>{label}</Link>)}
      <Link href="/prototypes" aria-current={pathname.startsWith("/prototypes") ? "page" : undefined} tabIndex={open ? 0 : -1}>Examples</Link>
      <Link href="/my-project" aria-current={pathname === "/my-project" ? "page" : undefined} tabIndex={open ? 0 : -1}>My project</Link>
      <Link className="mobileProjectAction" href={projectEntry.href} tabIndex={open?0:-1}>{projectEntry.label}</Link>
    </nav>
  </header>;
}
