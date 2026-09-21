"use client";

import {useEffect,useRef,useState} from "react";
import type {BuildingModel,BuildingSolid} from "@/lib/parametric-building";

type ViewApi={select:(id:string)=>void;roof:(visible:boolean)=>void;view:(top:boolean)=>void;exportGlb:()=>void};
export function ParametricBuildingView({model,selected,onSelect}:{model:BuildingModel;selected:string;onSelect:(id:string)=>void}) {
  const host=useRef<HTMLDivElement>(null),api=useRef<ViewApi|null>(null),selectCallback=useRef(onSelect);
  const [active,setActive]=useState(false),[status,setStatus]=useState("Load the interactive model when you are ready."),[roof,setRoof]=useState(true),[renderReady,setRenderReady]=useState(false);
  selectCallback.current=onSelect;
  useEffect(()=>{
    if(!active||!host.current) return;
    setRenderReady(false);setStatus("Preparing building geometry…");
    let cancelled=false,dispose=()=>{};
    void (async()=>{
      try {
        const [T,{OrbitControls}]=await Promise.all([import("three"),import("three/examples/jsm/controls/OrbitControls.js")]);
        if(cancelled||!host.current) return;
        const container=host.current,renderer=new T.WebGLRenderer({antialias:true,alpha:false});
        renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xf0eee5);
        const scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,1000),group=new T.Group();
        const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;
        const sun=new T.DirectionalLight(0xfff1d7,3);sun.position.set(20,40,20);
        scene.add(new T.HemisphereLight(0xffffff,0x526a5e,2),sun,group);
        const geometries:import("three").BufferGeometry[]=[],materials:import("three").MeshStandardMaterial[]=[];
        const colors={wall:0xded1b3,floor:0xaaa38e,roof:0x346555,column:0xe7dbbc,arch:0xb5904a,opening:0x7799aa};
        const geometryFor=(solid:BuildingSolid)=>{
          let geometry:import("three").BufferGeometry;
          if(solid.kind==="extrusion") {
            const shape=new T.Shape(solid.profile.map(pt=>new T.Vector2(...pt)));
            for(const hole of solid.holes) shape.holes.push(new T.Path(hole.map(pt=>new T.Vector2(...pt))));
            geometry=new T.ExtrudeGeometry(shape,{depth:solid.depth,bevelEnabled:false,steps:1});
            // Canonical Z-up becomes renderer Y-up using a proper rotation (no reflection).
            if(solid.axis==="negative-y") geometry.rotateX(Math.PI/2);
            geometry.translate(...solid.origin);geometry.rotateX(-Math.PI/2);
          } else {
            geometry=new T.BufferGeometry();
            geometry.setAttribute("position",new T.Float32BufferAttribute(solid.faces.flatMap(face=>face.flatMap(i=>solid.vertices[i])),3));
            geometry.rotateX(-Math.PI/2);geometry.computeVertexNormals();
          }
          geometries.push(geometry);return geometry;
        };
        const draw=()=>{if(!cancelled&&!document.hidden) renderer.render(scene,camera);};
        dispose=()=>{controls.dispose();for(const g of geometries) g.dispose();for(const m of materials)m.dispose();renderer.dispose();renderer.domElement.remove();api.current=null;};
        for(const element of model.elements.filter(e=>e.role!=="opening")) {
          const material=new T.MeshStandardMaterial({color:colors[element.role],roughness:.82});materials.push(material);
          for(const solid of element.solids) {
            const mesh=new T.Mesh(geometryFor(solid),material);mesh.userData={elementId:element.id,role:element.role};group.add(mesh);
          }
        }
        const bounds=new T.Box3().setFromObject(group),center=bounds.getCenter(new T.Vector3()),size=Math.max(...bounds.getSize(new T.Vector3()).toArray());
        const view=(top:boolean)=>{camera.up.set(0,top?0:1,top?-1:0);camera.position.set(center.x+(top?0:size),center.y+size*.85,center.z-(top?0:size));controls.target.copy(center);controls.update();draw();};
        const resize=()=>{const width=container.clientWidth,height=container.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();draw();};
        const observer=new ResizeObserver(resize);observer.observe(container);
        const raycaster=new T.Raycaster();let startX=0,startY=0;
        const down=(e:PointerEvent)=>{startX=e.clientX;startY=e.clientY;};
        const pick=(e:PointerEvent)=>{
          if(Math.hypot(e.clientX-startX,e.clientY-startY)>5)return;
          const rect=renderer.domElement.getBoundingClientRect();
          raycaster.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
          const hit=raycaster.intersectObjects(group.children).find(h=>h.object.visible);
          if(hit)selectCallback.current(hit.object.userData.elementId);
        };
        const contextLost=(e:Event)=>{e.preventDefault();setStatus("The 3D view lost its graphics connection. Use the plan and element list, or close and reload 3D.");};
        controls.addEventListener("change",draw);document.addEventListener("visibilitychange",draw);
        renderer.domElement.addEventListener("pointerdown",down);renderer.domElement.addEventListener("pointerup",pick);renderer.domElement.addEventListener("webglcontextlost",contextLost);
        renderer.domElement.setAttribute("aria-label","Mosque building model. Drag to orbit; use the view buttons and element list for keyboard access.");
        container.replaceChildren(renderer.domElement);
        api.current={select:(id)=>{group.children.forEach(o=>{const m=(o as import("three").Mesh).material as import("three").MeshStandardMaterial;m.emissive.setHex(o.userData.elementId===id?0x79531b:0);});draw();},roof:(visible)=>{group.children.forEach(o=>{if(o.userData.role==="roof")o.visible=visible;});draw();},view,exportGlb:()=>{
          void import("three/examples/jsm/exporters/GLTFExporter.js").then(({GLTFExporter})=>new GLTFExporter().parse(group,result=>{
            const url=URL.createObjectURL(new Blob([result as ArrayBuffer],{type:"model/gltf-binary"})),a=document.createElement("a");a.href=url;a.download="mosque-build-building.glb";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus("Complete building GLB exported, including hidden roofs.");
          },()=>setStatus("GLB export failed. Try exporting IFC or the editable study."),{binary:true,onlyVisible:false})).catch(()=>setStatus("The GLB exporter could not load. Try again when online."));
        }};
        resize();view(false);api.current.roof(roof);api.current.select(selected);setRenderReady(true);setStatus("3D model ready. Select an element to inspect it.");
        const release=dispose;dispose=()=>{observer.disconnect();controls.removeEventListener("change",draw);document.removeEventListener("visibilitychange",draw);renderer.domElement.removeEventListener("pointerdown",down);renderer.domElement.removeEventListener("pointerup",pick);renderer.domElement.removeEventListener("webglcontextlost",contextLost);release();};
      } catch {dispose();if(!cancelled)setStatus("3D is unavailable on this device. The plan, dimensions, saved study and IFC export still work.");}
    })();
    return()=>{cancelled=true;dispose();};
    // Geometry regenerates only after Apply; display controls are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[active,model]);
  useEffect(()=>api.current?.select(selected),[selected]);
  useEffect(()=>api.current?.roof(roof),[roof]);
  return <div className="buildingView">
    <div className="buildingActions"><button type="button" onClick={()=>{setActive(v=>!v);setRenderReady(false);if(active)setStatus("3D closed. The plan and exports remain available.");}}>{active?"Close 3D":"Load 3D model"}</button>{active?<><button type="button" disabled={!renderReady} onClick={()=>api.current?.view(false)}>Perspective</button><button type="button" disabled={!renderReady} onClick={()=>api.current?.view(true)}>Top view</button><button type="button" disabled={!renderReady} aria-pressed={!roof} onClick={()=>setRoof(v=>!v)}>{roof?"Remove roof for inspection":"Show roof"}</button><button type="button" disabled={!renderReady} onClick={()=>api.current?.exportGlb()}>Export GLB</button></>:null}</div>
    {active?<div ref={host} className="buildingCanvas"/>:null}<p role="status">{status}</p>
  </div>;
}
