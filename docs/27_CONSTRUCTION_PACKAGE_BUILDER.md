# Construction package and material assembly builder

Status: `executable` local planning workflow; outputs remain `scaffolded` professional handoffs.

The construction route now connects saved design context to material studies and sequenced work packages. It does not generate construction instructions or represent an assembly as professionally designed.

## Implemented

- Inherits the saved design scenario and architecture direction.
- Provides eight conceptual assembly studies across external walls, roofs, prayer floors and shading screens.
- Carries evidence requirements and maintainability questions with every assembly.
- Saves one selected study per assembly group on the device.
- Models seven construction packages from enabling works through testing and handover.
- Prevents a package from being marked ready for review while prerequisite packages remain unresolved.
- Saves package-specific responsibility, missing-input and review notes.
- Exports `mosque.build/construction-package@1` JSON with design inputs, selected studies, package states, unresolved dependencies and review gates.
- Includes construction-package state in the whole-project package.
- Preserves explicit structural, MEP, fire, accessibility, cost, availability and authority boundaries.

## Not yet production-ready

- No calculated specifications or quantities.
- No attachments, revisions, signatures, assignments or immutable events.
- No verified product data, price, availability or performance declarations.
- No RLS-backed team collaboration.
- No IFC property-set mapping or quantity-surveyor handoff.
- No inspection/test-plan authoring or approved hold-point release.

Production progression requires qualified discipline review, RLS and security tests, structured file evidence, revision control, mobile/offline conflict handling and formal interchange validation.
