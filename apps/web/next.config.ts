import path from "node:path";
import type {NextConfig} from "next";

const securityHeaders=[
  {key:"X-Content-Type-Options",value:"nosniff"},
  {key:"X-Frame-Options",value:"DENY"},
  {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
  {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=(), usb=()"},
  {key:"Cross-Origin-Opener-Policy",value:"same-origin"},
  {key:"Cross-Origin-Resource-Policy",value:"same-origin"},
  {key:"Origin-Agent-Cluster",value:"?1"},
  {key:"X-Permitted-Cross-Domain-Policies",value:"none"},
  {key:"X-DNS-Prefetch-Control",value:"off"},
];
if(process.env.NODE_ENV==="production")securityHeaders.push(
  {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"},
  {key:"Content-Security-Policy",value:"default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests"}
);

const nextConfig:NextConfig={
  allowedDevOrigins:["127.0.0.1"],
  poweredByHeader:false,
  turbopack:{root:path.join(__dirname,"../..")},
  async headers(){return [
    {source:"/sw.js",headers:[{key:"Cache-Control",value:"no-cache, no-store, must-revalidate"},{key:"Service-Worker-Allowed",value:"/"}]},
    {source:"/(.*)",headers:securityHeaders},
  ]},
};

export default nextConfig;
