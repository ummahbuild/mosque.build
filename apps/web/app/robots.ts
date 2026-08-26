import type {MetadataRoute} from "next";

const trainingCrawlers=["GPTBot","CCBot","Google-Extended","ClaudeBot","anthropic-ai","Bytespider","cohere-ai"];

export default function robots():MetadataRoute.Robots{return {rules:[{userAgent:"*",allow:"/",disallow:["/api/private/","/admin/"]},{userAgent:trainingCrawlers,disallow:"/"}],sitemap:"https://mosque.build/sitemap.xml",host:"https://mosque.build"}}
