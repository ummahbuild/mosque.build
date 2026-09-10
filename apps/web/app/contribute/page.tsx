import type {Metadata} from "next";
import Link from "next/link";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {ContributorCapacityWorkspace} from "@/components/contributor-capacity-workspace";
import "./contribute.css";

export const metadata:Metadata={
  title:"Contribute to mosque.build",
  description:"Contribute code, design, research, accessibility, documentation, translation, data review, or professional knowledge to the open-source mosque.build project.",
  alternates:{canonical:"/contribute"},
  openGraph:{title:"Contribute to mosque.build",description:"Help build trustworthy open-source planning tools for mosque communities.",url:"/contribute"}
};

const roles=[
  ["Developers","Improve Next.js, TypeScript, local-first data, tests, security, performance, offline behavior, mapping, and 3D presentation."],
  ["Designers + accessibility specialists","Make complex planning easier to understand on mobile, with a keyboard, with assistive technology, and across different levels of experience."],
  ["Built-environment professionals","Review architecture, engineering, planning, cost, procurement, construction, facilities, and handoff boundaries within your expertise."],
  ["Researchers + data contributors","Add primary sources with dates, geography, rights, confidence, limitations, and an explicit next verification step."],
  ["Cultural + religious reviewers","Help represent mosque lineages, worship needs, patterns, language, craft, and religious content with context and care."],
  ["Writers + translators","Improve plain-language guidance, onboarding, documentation, terminology, and community education without overstating the product."]
];

const workflow=[
  ["01","Read the project rules","Start with AGENTS.md, the contributor guide, architecture guide, security policy, and asset policy."],
  ["02","Choose one user outcome","Search existing issues or open the correct issue form. Keep the change focused and testable."],
  ["03","Protect people and truth","Use neutral sample data. Source external facts. Keep regulated decisions with qualified reviewers."],
  ["04","Build on the right layer","Keep domain records renderer-neutral and put browser or Three.js behavior at the presentation boundary."],
  ["05","Verify the complete change","Run tests, validation, the privacy scan, and the production build. Test accessibility and responsive behavior for interface work."],
  ["06","Open a clear pull request","Explain the outcome, scope, evidence, screenshots, limitations, migration impact, and review still needed."]
];

const standards=[
  ["Privacy","Never commit personal contacts, private project records, precise private addresses, credentials, local paths, or production data."],
  ["Sources","External facts need provenance, an observed date, rights where relevant, confidence, review status, and limitations."],
  ["Permits","Describe requirements as likely applicable and verify them with the responsible authority or professional."],
  ["Safety","Structural, fire, civil, building-services, accessibility, environmental, and construction outputs remain conceptual until qualified review."],
  ["Costs","Include geography, currency, date, source, maturity, confidence, contingency, and exclusions."],
  ["Religious + cultural content","Include source and content review. Never generate sacred calligraphy as decorative filler or claim generic geometry is culturally authentic."],
  ["Architecture","Canonical project records must remain independent of Three.js or any other renderer."],
  ["Accessibility","Support semantic structure, keyboard use, visible focus, reduced motion, readable contrast, responsive layouts, and useful error states."]
];

const github="https://github.com/ummahbuild/mosque.build";

export default function ContributePage(){return <><SiteHeader/><main className="contributePage">
  <section className="contributeHero">
    <div><div className="eyebrow gold">OPEN SOURCE · MIT LICENSE</div><h1>Help communities build mosques with greater clarity.</h1><p>mosque.build brings community need, site evidence, design, approvals, cost, sourcing, construction, and long-term care into one connected journey. Contribute code, design, research, documentation, translation, or professional review.</p><div className="heroActions"><a className="button" href={github} target="_blank" rel="noopener noreferrer">Contribute on GitHub ↗</a><a className="secondaryButton lightButton" href="https://ummah.build" target="_blank" rel="noopener noreferrer">Join ummah.build ↗</a></div><div className="contributeSignals"><span>MIT licensed</span><span>Privacy first</span><span>Evidence aware</span><span>Community centred</span></div></div>
    <aside><span>START HERE</span><h2>A good first contribution is small, verifiable, and useful.</h2><p>Fix one accessible interaction. Clarify one guide. Test one workflow. Review one source record. Document one professional boundary.</p><a href={`${github}/issues`} target="_blank" rel="noopener noreferrer">Browse open issues →</a></aside>
  </section>

  <nav className="contributeJump" aria-label="Contributing page sections"><a href="#capacity-planner-title">Plan capacity</a><a href="#ways-to-help">Ways to help</a><a href="#contribution-path">Contribution path</a><a href="#standards">Project standards</a><a href="#verification">Verification</a><a href="#join">Join the community</a></nav>

  <div className="section"><ContributorCapacityWorkspace/></div>

  <section className="section contributeIntro" id="ways-to-help"><div><div className="eyebrow dark">EVERY DISCIPLINE HELPS</div><h2>There is more than one way to contribute.</h2><p className="sectionLead">You do not need to be an architect or developer. mosque.build needs careful questions, usable interfaces, trustworthy sources, robust tests, and professional review.</p></div><div className="contributeRoleGrid">{roles.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>

  <section className="darkSection" id="contribution-path"><div className="section"><div className="eyebrow gold">CONTRIBUTION PATH</div><h2>Take a change from idea to trusted review.</h2><div className="contributeSteps">{workflow.map(([number,title,body])=><article key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div><div className="ossLinks"><a href={`${github}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">Full contributor guide ↗</a><a href={`${github}/issues`} target="_blank" rel="noopener noreferrer">GitHub issues ↗</a><a href={`${github}/pulls`} target="_blank" rel="noopener noreferrer">Open pull requests ↗</a></div></div></section>

  <section className="section" id="standards"><div className="splitIntro"><div><div className="eyebrow dark">NON-NEGOTIABLE STANDARDS</div><h2>Build trust into the contribution.</h2></div><p className="sectionLead">These boundaries protect communities and keep planning guidance honest. They apply to code, copy, datasets, visual assets, and examples.</p></div><div className="contributeStandards">{standards.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>

  <section className="sectionNarrow" id="verification"><div className="contributeVerify"><div><div className="eyebrow dark">BEFORE A PULL REQUEST</div><h2>Run the complete verification sequence.</h2><p>Interface changes also need keyboard, focus, mobile, desktop, reduced-motion, overflow, and browser-console checks.</p></div><pre aria-label="Required contribution commands"><code>{`pnpm test\npnpm validate\npnpm privacy:scan\npnpm web:build`}</code></pre><div className="contributeDocLinks"><a href={`${github}/blob/main/AGENTS.md`} target="_blank" rel="noopener noreferrer">Project rules</a><a href={`${github}/blob/main/docs/ARCHITECTURE.md`} target="_blank" rel="noopener noreferrer">Architecture</a><a href={`${github}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer">Security</a><a href={`${github}/blob/main/docs/ASSET_POLICY.md`} target="_blank" rel="noopener noreferrer">Asset policy</a><a href={`${github}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noopener noreferrer">Code of conduct</a><a href={`${github}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">MIT License</a></div></div></section>

  <section className="contributeJoin" id="join"><div><div className="eyebrow gold">BUILD WITH UMMAH.BUILD</div><h2>Join a wider community building useful technology for the Ummah.</h2><p>mosque.build is built by ummah.build. Join the community to meet collaborators, bring your discipline to the work, and help turn shared needs into responsible open-source tools.</p><div className="heroActions"><a className="button" href="https://ummah.build" target="_blank" rel="noopener noreferrer">Join ummah.build ↗</a><a className="secondaryButton lightButton" href={github} target="_blank" rel="noopener noreferrer">Open the repository ↗</a></div></div></section>
</main><SiteFooter/></>}
