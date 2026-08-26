# mosque.build — Multi-Renderer + Global Region Coverage v27

## Key architectural change
Three.js is no longer a foundation dependency. It is one renderer adapter.

Canonical project state:
domain objects + deterministic geometry + stable IDs + glTF/IFC/GeoJSON assets.

## Renderer strategy
- Web professional 3D: Babylon.js and/or Three/R3F adapters.
- Native mobile 3D: Filament through a React Native/native adapter.
- BIM: That Open Fragments + web-ifc, with lightweight mobile-derived assets.
- Maps: MapLibre GL JS on web; MapLibre Native/React Native on mobile.
- Optional immersive/simulation runtime: Godot.
- Asset interchange: glTF/GLB; KTX2/Basis for compressed textures.
- IFC 4.3/IDS remain BIM exchange/requirements standards.

## glTF status
Khronos registry still lists glTF 2.0 as current. glTF 2.1 is in 2026 finalization/ratification activity, so mosque.build should use 2.0 as compatibility baseline and experiment with 2.1 behind capability flags.

## Global coverage
38 regional packs cover the Middle East, Central/South/East/Southeast Asia, all African subregions, Europe, the Americas and Oceania.
Regional packs are population containers, not claims that every country within a region shares one mosque style.
