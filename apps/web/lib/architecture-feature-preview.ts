import type {ArchitectureFeature} from "@/lib/architecture-feature-plan";
import {createArchitectureComponent, type ArchitectureComponent, type ArchitectureComponentType, type ArchitectureKit} from "@/lib/architectural-components";

const categoryDefaults:Record<string,ArchitectureComponentType>={
  "Site & Context":"courtyard", Programming:"partition", "Prayer Hall":"prayer-rows", "Sacred Core":"mihrab",
  "Wudu & Sanitation":"wudu-line", "Envelope & Climate":"screen", "Acoustics & AV":"service-riser", Lighting:"clerestory",
  "Construction & Fabrication":"column-grid", "Lifecycle & Operations":"service-riser", "AI & Product":"column-grid",
  "Minaret Systems":"minaret", "Roof & Dome":"dome", "Adaptive Envelope":"screen", "Courtyard & Landscape":"courtyard",
  "Structure & Assembly":"column-grid", "Prayer-time Light":"skylight", "Climate & Building Systems":"service-riser",
  "Prayer Floor & Services":"prayer-rows", "Generative Design Systems":"column-grid"
};

export function featurePreviewType(feature:ArchitectureFeature):ArchitectureComponentType{
  const text=`${feature.feature} ${feature.what_it_adds}`.toLowerCase();
  const rules:[RegExp,ArchitectureComponentType][]=[
    [/minaret/,"minaret"],[/mihrab|qibla wall/,"mihrab"],[/minbar|khutbah/,"minbar"],[/dome|oculus/,"dome"],
    [/pitched|folded.plate|slop(ed|ing) roof/,"pitched-roof"],[/roof/,"flat-roof"],[/skylight|daylight|light.slot/,"skylight"],
    [/mashrabiya|jali|screen|façade|facade|perforat/,"screen"],[/courtyard|sahn|bioswale|landscape|garden/,"courtyard"],
    [/solar|photovoltaic|\bpv\b/,"solar-array"],[/wudu|ablution|greywater|drain|water/,"wudu-line"],
    [/door|gate|arrival|exit|egress/,"accessible-door"],[/canopy|shade/,"canopy"],[/window|glazing/,"window"],
    [/carpet|prayer.row|saff|sujood|prayer floor/,"prayer-rows"],[/partition|zoning|flexib/,"partition"],
    [/column|structure|rebar|timber|steel|assembly|prefabricat|panelization/,"column-grid"],
    [/ventilat|hvac|acoustic|speaker|audio|service|energy|digital twin|filter|leak/,"service-riser"]
  ];
  return rules.find(([pattern])=>pattern.test(text))?.[1]??categoryDefaults[feature.category]??"column-grid";
}

export function componentFromFeature(feature:ArchitectureFeature,index=1):ArchitectureComponent{
  const component=createArchitectureComponent(featurePreviewType(feature),index);
  return {...component,name:feature.feature.slice(0,160),family:`${featurePreviewType(feature).replaceAll("-"," ")} proposal`,sourceBasis:`Architecture proposal ${feature.id}; ${feature.source.kind}; observed ${feature.source.observedAt}; rights ${feature.source.rights}; confidence ${feature.source.confidence}`.slice(0,1000),notes:`Concept study from ${feature.id}. ${feature.what_it_adds}`.slice(0,3000),position:[((index-1)%5-2)*3,component.position[1],Math.floor((index-1)/5)*3]};
}

export function featurePreviewKit(feature:ArchitectureFeature):ArchitectureKit{
  return {schema:"mosque.build/architecture-kit@1",status:"executable",name:`Preview · ${feature.feature}`,qiblaBearingDeg:0,qiblaAlignment:"building-axis",components:[componentFromFeature(feature)],updatedAt:"",boundary:"Conceptual type-specific preview only; not resolved geometry, performance, compliance, cultural acceptance or professional approval."};
}

export function addFeatureToArchitectureKit(kit:ArchitectureKit,feature:ArchitectureFeature):{kit:ArchitectureKit;added:boolean;reason?:"duplicate"|"capacity"}{
  if(kit.components.some(component=>component.sourceBasis.includes(feature.id)))return{kit,added:false,reason:"duplicate"};
  if(kit.components.length>=80)return{kit,added:false,reason:"capacity"};
  const component=componentFromFeature(feature,kit.components.length+1);
  return{added:true,kit:{...kit,components:[...kit.components,component],updatedAt:new Date().toISOString()}};
}
