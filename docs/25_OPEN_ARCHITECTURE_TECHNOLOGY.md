# Open architecture technology direction

Status: `specified`

Observed: 2026-09-08

## Decision

Keep the canonical mosque, site, room and measurement objects renderer-neutral. Use SVG for the current deterministic 2D schematic, glTF/GLB for efficient rendered assets, and IFC for professional BIM exchange. Do not make a viewer library the source of truth.

## Evaluated foundations

| Technology | Suitable role | License / provenance | Decision |
| --- | --- | --- | --- |
| IFC 4.3.2.0 | Vendor-neutral professional built-asset exchange | buildingSMART official standard; specification CC BY-ND 4.0 | Adopt as the professional exchange boundary after an export mapping and validation profile are specified. |
| That Open Engine / web-ifc | Browser-side IFC reading and writing through WebAssembly | Official That Open documentation; `web-ifc` MPL-2.0 | Preferred implementation candidate for an isolated, dynamically loaded IFC adapter. Review transitive licenses and performance before adding it. |
| glTF / GLB | Portable web rendering and handoff of visual geometry | Existing repository architecture rule | Use for render assets, not canonical project semantics. |
| OpenCascade.js | Browser CAD/B-rep operations | Project repository and license require a dedicated legal and bundle-size review | Defer until solid modeling is a demonstrated need; it is too heavy for the current room-program workflow. |

## Integration sequence

1. Stabilize versioned site, footprint, room, opening and measurement objects with provenance and verification state.
2. Add deterministic 2D/3D geometry tests and accessible non-WebGL fallback views.
3. Generate glTF from canonical geometry in an isolated adapter.
4. Add an opt-in, dynamically loaded IFC viewer/import worker; imported files remain local by default.
5. Specify IFC class/property mappings and validate exports against the selected IFC version and model-view definition.
6. Add professional review/sign-off separately from file generation. An exported file is not an approved design.

## Sources

- buildingSMART, IFC 4.3.2.0 official documentation: https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/
- buildingSMART, IFC schema specifications and license: https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/
- That Open documentation: https://docs.thatopen.com/
- That Open `web-ifc` repository: https://github.com/ThatOpen/engine_web-ifc
