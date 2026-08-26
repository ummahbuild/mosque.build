#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
processes = json.loads((ROOT/"schemas/BACKEND_PROCESS_REGISTRY.json").read_text())
edges = json.loads((ROOT/"schemas/BACKEND_FLOW_EDGES.json").read_text())

by_id = {p["id"]: p for p in processes}

# Executive overview
groups = {}
for p in processes:
    groups.setdefault(p["domain"], []).append(p)

lines = ["flowchart LR"]
for domain, items in groups.items():
    safe = domain.replace("-","_")
    lines.append(f'  subgraph {safe}["{domain.title()}"]')
    for p in items:
        label = p["name"].replace('"',"'")
        lines.append(f'    {p["id"].replace("-","_")}["{label}"]')
    lines.append("  end")
for a,b in edges:
    if a in by_id and b in by_id:
        lines.append(f'  {a.replace("-","_")} --> {b.replace("-","_")}')
(ROOT/"flows/EXECUTIVE_BACKEND_FLOW.mmd").write_text("\n".join(lines))

# Technical process detail
lines = ["flowchart TB"]
for p in processes:
    pid = p["id"].replace("-","_")
    trig = pid+"_TRIG"; auth=pid+"_AUTH"; val=pid+"_VAL"; wr=pid+"_WRITE"; evt=pid+"_EVT"; down=pid+"_DOWN"; fail=pid+"_FAIL"; aud=pid+"_AUD"
    lines += [
      f'  subgraph {pid}_SG["{p["id"]} — {p["name"]}"]',
      f'    {trig}["Trigger: {p["trigger"]}"]',
      f'    {auth}["Auth/RLS: {p["auth"]}"]',
      f'    {val}["Validate: {"; ".join(p["validation"])}"]',
      f'    {wr}["Writes: {"; ".join(p["writes"])}"]',
      f'    {evt}["Events: {"; ".join(p["events"])}"]',
      f'    {down}["Downstream: {"; ".join(p["downstream"])}"]',
      f'    {fail}["Failures: {"; ".join(p["failures"])}"]',
      f'    {aud}["Audit: {p["audit"]}"]',
      f'    {trig} --> {auth} --> {val} --> {wr} --> {evt} --> {down}',
      f'    {val} -. fail .-> {fail}',
      f'    {wr} --> {aud}',
      '  end'
    ]
(ROOT/"flows/TECHNICAL_BACKEND_PROCESS_FLOW.mmd").write_text("\n".join(lines))

# Process catalog markdown
md = ["# Backend Process Catalog",""]
for p in processes:
    md += [
      f'## {p["id"]} — {p["name"]}',
      f'- **Domain:** {p["domain"]}',
      f'- **Trigger:** {p["trigger"]}',
      f'- **Inputs:** {", ".join(p["inputs"])}',
      f'- **Auth/RLS:** {p["auth"]}',
      f'- **Validation:** {", ".join(p["validation"])}',
      f'- **Writes:** {", ".join(p["writes"])}',
      f'- **Events:** {", ".join(p["events"])}',
      f'- **Downstream:** {", ".join(p["downstream"])}',
      f'- **Failures:** {", ".join(p["failures"])}',
      f'- **Audit:** {p["audit"]}',
      f'- **UI state:** {p["ui_state"]}',
      ''
    ]
(ROOT/"docs/BACKEND_PROCESS_CATALOG.md").write_text("\n".join(md))

print("Generated flows and process catalog.")
