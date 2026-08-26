import fs from "node:fs";import path from "node:path";import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,"..");let failures=[];
function read(p){return JSON.parse(fs.readFileSync(path.join(root,p),"utf8"))}
const frames=read("data/FRAME_REGISTRY.json");const features=read("data/FEATURE_REGISTRY.json");
for(const f of frames){for(const k of ["id","slug","source_file","family","prototype_route"]){if(!f[k])failures.push(`frame missing ${k}: ${f.id}`)}const md=path.join(root,"docs/frames",`${f.slug}.md`);const route=path.join(root,"apps/web/app/prototypes",f.slug,"page.tsx");const asset=path.join(root,"assets/mockups",f.source_file);if(!fs.existsSync(md))failures.push(`missing frame markdown ${f.slug}`);if(!fs.existsSync(route))failures.push(`missing frame route ${f.slug}`);if(!fs.existsSync(asset))failures.push(`missing frame asset ${f.slug}`)}
for(const f of features){if(typeof f.priority_score!=="number")failures.push(`feature score missing ${f.canonical_key}`);if(f.recommended_wave<0||f.recommended_wave>7)failures.push(`bad wave ${f.canonical_key}`)}
const requiredPublicRoutes=["features","sources","roadmap","start","my-project","design","permits","funding","marketplace","construction","operations","waqf-library","resources","pwa-guide","methodology","trust","privacy","terms","accessibility","open-source"];
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-100/page.tsx")))failures.push("missing priority 100 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-200/page.tsx")))failures.push("missing priority 200 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-300/page.tsx")))failures.push("missing priority 300 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-400/page.tsx")))failures.push("missing priority 400 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-500/page.tsx")))failures.push("missing priority 500 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-600/page.tsx")))failures.push("missing priority 600 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-700/page.tsx")))failures.push("missing priority 700 feature route");
if(!fs.existsSync(path.join(root,"apps/web/app/features/priority-800/page.tsx")))failures.push("missing priority 800 feature route");
for(const r of requiredPublicRoutes){if(!fs.existsSync(path.join(root,"apps/web/app",r,"page.tsx")))failures.push(`missing public route ${r}`)}
const publicAssets=["manifest.webmanifest","sw.js","offline.html","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png",".well-known/security.txt"];for(const a of publicAssets){if(!fs.existsSync(path.join(root,"apps/web/public",a)))failures.push(`missing PWA asset ${a}`)}
const framePublic=path.join(root,"apps/web/public/assets/mockups");for(const f of frames){if(!fs.existsSync(path.join(framePublic,f.source_file)))failures.push(`missing public frame asset ${f.source_file}`)}
if(failures.length){console.error(failures.join("\n"));process.exit(1)}console.log(`VALIDATION_PASS — ${frames.length} frames, ${features.length} normalized features, ${requiredPublicRoutes.length} public routes, PWA assets linked`);
