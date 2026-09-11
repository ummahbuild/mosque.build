# CAD production integrity — 20 implemented improvements

Status: `executable` conceptual model validation. These checks do not establish code compliance, engineering adequacy, constructability, or professional approval.

1. Added a production-integrity validation layer without renderer dependencies.
2. Added plain-object validation for document and level records.
3. Added metre-unit enforcement at the authoring boundary.
4. Added non-negative whole-number revision validation.
5. Added portable document and level ID validation.
6. Added bounded level elevation validation.
7. Added bounded level height validation.
8. Added plain-object checks for walls, openings, and spaces.
9. Added portable stable-ID checks for every element.
10. Added review findings for unnamed elements.
11. Added duplicate wall-path detection in either direction.
12. Added opening sill-plus-height validation against its host wall.
13. Added overlapping hosted-opening detection.
14. Added review findings for walls outside all space boundaries.
15. Added blocking detection for degenerate space areas.
16. Added repeated boundary-wall detection.
17. Added explicit space-boundary continuity review.
18. Added a five-kilometre model-extent safety limit.
19. Added wall-length, space-area, blocker, and review summaries.
20. Wired hardened validation into command preview and nested import preflight.

## Acceptance criteria

- Invalid revisions, units, levels, IDs, nested shapes, excessive extents, degenerate spaces, repeated boundary references, vertically invalid openings, and overlapping openings cannot pass the hardened boundary.
- Duplicate wall paths, unnamed elements, unassigned walls, and ambiguous boundary continuity remain visible as review findings.
- Editor previews use hardened findings before commit, and imported JSON is structurally preflighted before the existing parser touches nested geometry.
- Summary quantities derive only from the semantic document and retain metre and square-metre meaning.
- The canonical model stays renderer-neutral and all structural, fire, accessibility, services, authority, and professional determinations remain outside these checks.
