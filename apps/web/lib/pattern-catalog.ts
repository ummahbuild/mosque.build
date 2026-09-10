import corePatterns from "../data/pattern-library.json" with {type:"json"};

export type PatternStudy=(typeof corePatterns)[number];
type Seed=[id:string,title:string,style:string,category:string,application:string];

// Contemporary computational studies. These names describe construction logic,
// not a historical culture, sacred meaning, or authenticated traditional pattern.
export const computationalPatternSeeds:Seed[]=[
 ["voronoi-equal-field","Equal-site Voronoi field","voronoi","Computational geometry","Perforated screen or acoustic-panel concept"],
 ["voronoi-weighted-field","Weighted Voronoi field","weighted-voronoi","Computational geometry","Gradient screen or ceiling-panel concept"],
 ["voronoi-centroidal-field","Centroidal Voronoi relaxation","centroidal-voronoi","Computational geometry","Even-density panel subdivision study"],
 ["voronoi-radial-field","Radially biased Voronoi field","radial-voronoi","Computational geometry","Bounded focal panel concept"],
 ["voronoi-border-field","Border-aware Voronoi cells","border-voronoi","Computational geometry","Panel with controlled perimeter zone"],
 ["delaunay-triangulation","Delaunay triangulation network","delaunay","Computational geometry","Screen, truss rhythm or paving concept"],
 ["delaunay-layered","Layered Delaunay network","layered-delaunay","Computational geometry","Two-depth screen study"],
 ["penrose-kite-dart","Penrose kite-and-dart study","penrose-kite","Quasiperiodic geometry","Non-repeating bounded panel study"],
 ["penrose-rhombus","Penrose rhombus study","penrose-rhombus","Quasiperiodic geometry","Non-repeating paving or ceiling concept"],
 ["ammann-beenker","Ammann–Beenker eightfold study","ammann-beenker","Quasiperiodic geometry","Eightfold screen exploration"],
 ["quasiperiodic-fivefold","Fivefold projection field","quasi-five","Quasiperiodic geometry","Contemporary feature-panel study"],
 ["quasiperiodic-twelvefold","Twelvefold projection field","quasi-twelve","Quasiperiodic geometry","Contemporary ceiling study"],
 ["girih-decagon-network","Decagonal strapwork construction","girih-decagon","Strapwork geometry","Joinery or inlay set-out study"],
 ["girih-bowtie-network","Bow-tie strapwork construction","girih-bowtie","Strapwork geometry","Modular panel transition study"],
 ["girih-hexagon-network","Elongated-hexagon strapwork","girih-hexagon","Strapwork geometry","Screen module study"],
 ["girih-rhombus-network","Rhombic strapwork construction","girih-rhombus","Strapwork geometry","Door or wall-panel study"],
 ["girih-pentagon-network","Pentagonal strapwork construction","girih-pentagon","Strapwork geometry","Bounded joinery concept"],
 ["five-point-star-grid","Five-point star grid","star-five","Polygonal geometry","Contemporary screen module"],
 ["six-point-rosette-grid","Six-point rosette grid","star-six","Polygonal geometry","Tile or ceiling module"],
 ["seven-point-star-grid","Seven-point star grid","star-seven","Polygonal geometry","Feature-panel construction study"],
 ["nine-point-star-grid","Nine-point star grid","star-nine","Polygonal geometry","Radial ceiling or screen study"],
 ["ten-point-star-grid","Ten-point star grid","star-ten","Polygonal geometry","Joinery and screen concept"],
 ["twelve-point-star-grid","Twelve-point star grid","star-twelve","Polygonal geometry","Large-module ceiling concept"],
 ["sixteen-point-star-grid","Sixteen-point star grid","star-sixteen","Polygonal geometry","High-density feature panel"],
 ["twenty-four-ray-rosette","Twenty-four-ray rosette","rosette-24","Radial geometry","Dome soffit or bounded ceiling study"],
 ["phyllotaxis-sunflower","Phyllotaxis point lattice","phyllotaxis","Growth geometry","Perforation-density concept"],
 ["fibonacci-spiral-field","Fibonacci spiral field","fibonacci-spiral","Growth geometry","Acoustic or lighting-panel concept"],
 ["logarithmic-spiral-pair","Counter-rotating logarithmic spirals","log-spiral","Growth geometry","Bounded ceiling composition"],
 ["archimedean-spiral-grid","Archimedean spiral grid","archimedean-spiral","Growth geometry","Circular paving or ceiling study"],
 ["apollonian-circle-field","Apollonian circle-packing study","apollonian","Circle geometry","Perforated feature-panel concept"],
 ["tangent-circle-packing","Tangent-circle packing field","circle-packing","Circle geometry","Screen opening-size study"],
 ["concentric-ring-weave","Concentric ring weave","ring-weave","Circle geometry","Ceiling or floor medallion study"],
 ["vesica-chain","Vesica intersection chain","vesica","Circle geometry","Border and teaching construction"],
 ["truchet-quarter-circle","Quarter-circle Truchet field","truchet-curves","Tiling systems","Reconfigurable tile study"],
 ["truchet-diagonal","Diagonal Truchet field","truchet-diagonal","Tiling systems","Paving or acoustic-panel study"],
 ["wang-edge-field","Edge-matched Wang tile field","wang-tiles","Tiling systems","Repeat-managed panel system"],
 ["trihexagonal-grid","Trihexagonal semiregular grid","trihexagonal","Tessellation geometry","Screen or paving concept"],
 ["rhombitrihexagonal-grid","Rhombitrihexagonal grid","rhombitrihexagonal","Tessellation geometry","Multi-module panel study"],
 ["snub-square-grid","Snub-square tessellation","snub-square","Tessellation geometry","Contemporary paving study"],
 ["cairo-pentagon-grid","Cairo pentagonal tessellation","cairo-pentagon","Tessellation geometry","Paving or wall-panel concept"],
 ["herringbone-module","Herringbone modular field","herringbone","Material set-out","Brick, timber or tile set-out"],
 ["basketweave-module","Basketweave modular field","basketweave","Material set-out","Paving or joinery set-out"],
 ["chevron-gradient","Chevron density gradient","chevron-gradient","Material set-out","Directional screen or soffit study"],
 ["hex-weave-interlace","Hexagonal interlace study","hex-weave","Interlace geometry","Screen or textile-panel concept"],
 ["square-knot-interlace","Square-knot interlace study","square-knot","Interlace geometry","Border or door-panel concept"],
 ["three-band-braid","Three-band braided field","three-braid","Interlace geometry","Linear frieze or balustrade study"],
 ["wave-interference-grid","Wave-interference field","wave-interference","Environmental geometry","Acoustic-panel visualisation study"],
 ["islamic-screen-gradient","Aperture-gradient screen","aperture-gradient","Performance geometry","Daylight and privacy mockup concept"],
 ["recursive-octagon-field","Recursive octagon subdivision","recursive-octagon","Recursive geometry","Multi-scale screen concept"],
 ["recursive-star-field","Recursive star subdivision","recursive-star","Recursive geometry","Bounded focal-panel concept"]
];

const reviews=["Treat this as original computational geometry, not a historical or sacred attribution","Prototype module, border, tolerance, fixing and replacement strategy at application scale","Review cultural context, accessibility, fire, weather, daylight, cleaning and fabrication with accountable specialists"];
export const computationalPatterns:PatternStudy[]=computationalPatternSeeds.map(([id,title,style,category,application])=>({
 id,title,style,category,application,
 description:`An editable mosque.build ${title.toLowerCase()} for comparing scale, repetition and application. It is not a copied historic composition or fabrication drawing.`,
 historicalContext:"Contemporary computational geometry study; no historical provenance or cultural authenticity is claimed.",
 reviewPoints:reviews,
 source:{label:"mosque.build computational pattern study",url:"/sources",path:"apps/web/lib/pattern-catalog.ts",observedAt:"2026-09-10",rights:"Original parameterized geometry; project team must document authorship and downstream asset rights",confidence:"conceptual"},
 status:"concept"
}));

export const patterns:PatternStudy[]=[...corePatterns,...computationalPatterns];
export const patternStudyIds=patterns.map(item=>item.id);
export default patterns;
