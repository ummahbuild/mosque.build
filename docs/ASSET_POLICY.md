# Asset and media policy

This policy applies to images, icons, fonts, flags, 3D models, textures, diagrams, screenshots, documents, and generated media committed to mosque.build.

## License boundary

The MIT License covers original mosque.build software and documentation. It cannot relicense third-party material. Every redistributed asset remains subject to its original license or permission, even when stored in this repository.

Do not add an asset unless its redistribution and intended use are understood. When rights are unclear, link to the authoritative source instead of copying the asset.

## Asset locations

| Path | Purpose |
|---|---|
| `apps/web/public/icons` | Install and application icons |
| `apps/web/public/flags` | Country identifiers used by jurisdiction selectors |
| `apps/web/public/assets/mockups` | Web-served visual project examples |
| `assets/mockups` | Source/reference visual assets |
| `docs/frames` | Text records describing example frames and their intended use |
| `apps/web/data/frame-registry.json` | Runtime index of visual examples |
| `THIRD_PARTY_NOTICES.md` | Repository-level third-party notices and rights boundaries |

## Required asset record

Each new asset contribution must document:

- filename and repository path;
- creator or issuing organization;
- original source URL or creation record;
- acquisition or creation date;
- license, permission, or public-domain basis;
- required attribution;
- allowed use and redistribution limits;
- whether the asset was modified or generated;
- accessible alternative text or a reason it is decorative;
- reviewer and review date for sensitive cultural or religious material.

Add notices to `THIRD_PARTY_NOTICES.md` when the license or attribution requires it.

## Cultural and religious safeguards

- Do not generate or use sacred calligraphy as decorative filler.
- Do not label generic geometry as authentic to a tradition without sources and cultural review.
- Do not copy a historic monument, protected artwork, or craft design and imply it is an original mosque.build asset.
- Attribute documented craft, regional, and institutional context.
- Use patterns as design studies until authorship, application, fabrication, safety, and cultural context are reviewed.

## Privacy and security

Before commit, remove EXIF location, author names, hidden document revisions, embedded credentials, private project names, addresses, people, vehicle plates, and other identifiers. Use neutral demonstration data.

## Web performance and accessibility

- Use SVG for simple interface icons and flags when an accurate source or original drawing is available.
- Use modern raster formats and responsive image sizing for photographs and previews.
- Compress assets without destroying necessary detail.
- Avoid embedding text in images when HTML can communicate it.
- Provide useful alt text for informative images and empty alt text for decorative images.
- Test contrast when an image sits behind text.
- Provide a non-WebGL or static fallback for essential 3D information.

## 3D assets

Prefer glTF/GLB for portable render assets. Record units, scale, coordinate basis, material assumptions, polygon count, texture licenses, and semantic element IDs. A render asset must not become the canonical project model.

## Removal

Maintainers may remove or quarantine an asset when provenance, privacy, cultural review, or redistribution rights are incomplete. Removal does not imply a judgment about the creator; it protects contributors and downstream users until the record is resolved.
