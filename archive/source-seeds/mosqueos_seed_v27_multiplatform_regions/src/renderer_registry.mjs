export class RendererRegistry {
  constructor(){ this.adapters=new Map(); }
  register(id,adapter){
    for(const method of ["init","loadScene","patchNodes","removeNodes","setCamera","hitTest","setOverlay","captureImage","dispose"]){
      if(typeof adapter[method]!=="function") throw new Error(`adapter ${id} missing ${method}`);
    }
    this.adapters.set(id,adapter); return this;
  }
  get(id){ const a=this.adapters.get(id); if(!a) throw new Error(`renderer ${id} unavailable`); return a; }
  capabilities(id){ return this.get(id).capabilities??{}; }
  choose(requirements={}){
    const entries=[...this.adapters.entries()];
    return entries.find(([_,a])=>Object.entries(requirements).every(([k,v])=>!v||a.capabilities?.[k]))?.[0] ?? null;
  }
}
export function normalizeScene(nodes){
  return nodes.map(n=>({
    object_id:n.object_id,
    kind:n.kind,
    transform:n.transform??{position:[0,0,0],rotation:[0,0,0,1],scale:[1,1,1]},
    geometry_ref:n.geometry_ref??null,
    material_ref:n.material_ref??null,
    visibility:n.visibility!==false,
    pickable:n.pickable!==false,
    semantic_refs:n.semantic_refs??{}
  }));
}
export function selectAssetVariant(asset,platform){
  if(platform==="mobile" && asset.mobile_glb) return asset.mobile_glb;
  if(platform==="web" && asset.web_glb) return asset.web_glb;
  return asset.glb ?? asset.gltf ?? null;
}
