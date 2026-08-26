"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useRef, useState} from "react";

const links = [
  ["/features", "How it works"],
  ["/design", "Design"],
  ["/patterns", "Patterns"],
  ["/permits", "Permits"],
  ["/marketplace", "Marketplace"],
  ["/funding", "Funding + Waqf"],
  ["/construction", "Build"],
  ["/resources", "Resources"],
  ["/open-source", "Contribute"],
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
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return <header ref={header} className="siteNav">
    <Link className="brand" href="/" aria-label="mosque.build home"><span className="brandMark" aria-hidden="true">⌂</span><span>mosque<span className="brandDot">.</span>build</span></Link>
    <nav className="navLinks" aria-label="Primary navigation">{links.map(([href, label]) => <Link href={href} key={href} aria-current={isCurrent(href) ? "page" : undefined}>{label}</Link>)}</nav>
    <div className="navActions">
      <Link className="textButton" href="/prototypes" aria-current={pathname.startsWith("/prototypes") ? "page" : undefined}>Concepts</Link>
      <Link className="textButton projectNavLink" href="/my-project" aria-current={pathname === "/my-project" ? "page" : undefined}>My project</Link>
      <Link className="button small" href={projectEntry.href} aria-current={pathname === projectEntry.href ? "page" : undefined}>{projectEntry.label}</Link>
      <button ref={menuButton} className="menuButton" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={`${open ? "Close" : "Open"} navigation menu`} onClick={() => setOpen(value => !value)}><span aria-hidden="true">{open ? "×" : "☰"}</span></button>
    </div>
    <nav id="mobile-navigation" className={`mobileNav${open ? " open" : ""}`} aria-label="Mobile navigation" aria-hidden={!open}>
      {links.map(([href, label]) => <Link href={href} key={href} aria-current={isCurrent(href) ? "page" : undefined} tabIndex={open ? 0 : -1}>{label}</Link>)}
      <Link href="/prototypes" aria-current={pathname.startsWith("/prototypes") ? "page" : undefined} tabIndex={open ? 0 : -1}>Concepts</Link>
      <Link href="/my-project" aria-current={pathname === "/my-project" ? "page" : undefined} tabIndex={open ? 0 : -1}>My project</Link>
    </nav>
  </header>;
}
