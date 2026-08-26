import test from "node:test";
import assert from "node:assert/strict";
import {RendererRegistry,normalizeScene,selectAssetVariant} from "../src/renderer_registry.mjs";
const fake=(caps={})=>({capabilities:caps,init(){},loadScene(){},patchNodes(){},removeNodes(){},setCamera(){},hitTest(){},setOverlay(){},captureImage(){},dispose(){}});
test("registry validates and selects",()=>{
 const r=new RendererRegistry().register("web",fake({WebGPU:true})).register("mobile",fake({native_GPU:true}));
 assert.equal(r.choose({native_GPU:true}),"mobile");
});
test("missing adapter throws",()=>assert.throws(()=>new RendererRegistry().get("x")));
test("scene normalized",()=>{
 const s=normalizeScene([{object_id:"o1",kind:"wall"}]); assert.equal(s[0].visibility,true); assert.equal(s[0].transform.scale[0],1);
});
test("platform asset variant",()=>assert.equal(selectAssetVariant({glb:"base.glb",mobile_glb:"m.glb"},"mobile"),"m.glb"));
