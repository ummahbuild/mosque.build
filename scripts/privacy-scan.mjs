import fs from "node:fs";import path from "node:path";import {execFileSync} from "node:child_process";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const files=execFileSync("git",["ls-files","--cached","--others","--exclude-standard","-z"],{cwd:root,encoding:"utf8"}).split("\0").filter(Boolean);
const textExtensions=new Set([".css",".csv",".html",".js",".json",".md",".mjs",".sql",".svg",".ts",".tsx",".txt",".yaml",".yml"]);
const rules=[
  ["local home-directory path",/(?:\/Users\/|C:\\Users\\)[^\s"']+/gi],
  ["consumer email address",/[A-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook)\.[A-Z]{2,}/gi],
  ["private network address",/\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/g],
  ["credential-like assignment",/\b(?:api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*["'][^"'\s]{12,}["']/gi],
];
const allowFiles=new Set(["scripts/privacy-scan.mjs"]);const findings=[];
for(const file of files){if(allowFiles.has(file)||!textExtensions.has(path.extname(file)))continue;const text=fs.readFileSync(path.join(root,file),"utf8");for(const [label,pattern] of rules){pattern.lastIndex=0;for(const match of text.matchAll(pattern)){const line=text.slice(0,match.index).split("\n").length;findings.push(`${file}:${line} ${label}`)}}}
if(findings.length){console.error(`PRIVACY_SCAN_FAIL\n${findings.join("\n")}`);process.exit(1)}
console.log(`PRIVACY_SCAN_PASS — ${files.length} repository files checked; public jurisdiction names are treated as cited reference data, not personal data`);
