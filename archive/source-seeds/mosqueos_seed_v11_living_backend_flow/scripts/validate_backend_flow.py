#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
procs = json.loads((ROOT/"schemas/BACKEND_PROCESS_REGISTRY.json").read_text())
edges = json.loads((ROOT/"schemas/BACKEND_FLOW_EDGES.json").read_text())

required = ["id","domain","name","trigger","inputs","auth","validation","writes","events","downstream","failures","audit","ui_state"]
ids=set()
errors=[]
for p in procs:
    for k in required:
        if k not in p or p[k] in (None,"",[]):
            errors.append(f'{p.get("id","<no id>")}: missing {k}')
    if p.get("id") in ids:
        errors.append(f'duplicate process id {p.get("id")}')
    ids.add(p.get("id"))
for a,b in edges:
    if a not in ids: errors.append(f'edge source missing: {a}')
    if b not in ids: errors.append(f'edge target missing: {b}')
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(procs)} processes, {len(edges)} edges")
