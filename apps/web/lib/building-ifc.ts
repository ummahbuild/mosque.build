import type {BuildingModel, BuildingSolid, Point3} from "./parametric-building";

// STEP strings: escape apostrophes, backslashes and Unicode; no raw input can add entities.
export function ifcText(value:string):string {
  let result="'";
  for(let i=0;i<value.length;i++) {
    const code=value.charCodeAt(i),char=value[i];
    result+=char==="'"?"''":code<32||code>126||char==="\\"?`\\X2\\${code.toString(16).toUpperCase().padStart(4,"0")}\\X0\\`:char;
  }
  return result+"'";
}
const real=(n:number)=>{if(!Number.isFinite(n)) throw new Error("Non-finite IFC coordinate");const s=Number(n.toFixed(8)).toString();return s.includes(".")?s:`${s}.`;};
const chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
/** Stable 128-bit project-local identifiers encoded in IFC's 22-character alphabet. */
export function buildingIfcGuid(key:string):string {
  const words=[2166136261,2246822519,3266489917,668265263];
  for(const char of key) for(let j=0;j<4;j++) words[j]=Math.imul(words[j]^char.charCodeAt(0),16777619+j*2)>>>0;
  let n=words.reduce((acc,w)=>(acc<<32n)|BigInt(w),0n),out="";
  for(let i=0;i<22;i++){out=chars[Number(n&63n)]+out;n>>=6n;}return out;
}

/** IFC4 STEP with spatial hierarchy, swept solids, BRep shell and hosted openings. */
export function exportBuildingIfc(model:BuildingModel):string {
  const lines:string[]=[],add=(body:string)=>{lines.push(`#${lines.length+1}=${body};`);return `#${lines.length}`;};
  const guid=(id:string)=>ifcText(buildingIfcGuid(`mosque.build:parametric:${id}`));
  const point=(p:number[])=>add(`IFCCARTESIANPOINT((${p.map(real).join(",")}))`);
  const direction=(p:number[])=>add(`IFCDIRECTION((${p.map(real).join(",")}))`);
  const z=direction([0,0,1]),x=direction([1,0,0]),negativeY=direction([0,-1,0]);
  const axis=(origin:Point3,vertical=z)=>add(`IFCAXIS2PLACEMENT3D(${point(origin)},${vertical},${x})`);
  const zero=axis([0,0,0]);
  const context=add(`IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,0.000001,${zero},$)`);
  const units=add(`IFCUNITASSIGNMENT((${add("IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.)")},${add("IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)")},${add("IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)")}))`);
  const project=add(`IFCPROJECT(${guid("project")},$,'mosque.build architectural study',$,$,$,$,(${context}),${units})`);
  const placement=add(`IFCLOCALPLACEMENT($,${zero})`);
  const site=add(`IFCSITE(${guid("site")},$,'Local study origin',$,$,${placement},$,$,.ELEMENT.,$,$,$,$,$)`);
  const building=add(`IFCBUILDING(${guid("building")},$,'Mosque study',$,$,${placement},$,$,.ELEMENT.,$,$,$)`);
  const storey=add(`IFCBUILDINGSTOREY(${guid("ground")},$,'Ground floor',$,$,${placement},$,$,.ELEMENT.,0.)`);
  const aggregate=(id:string,parent:string,child:string)=>add(`IFCRELAGGREGATES(${guid(id)},$,$,$,${parent},(${child}))`);
  aggregate("project-site",project,site);aggregate("site-building",site,building);aggregate("building-storey",building,storey);
  const loop=(profile:number[][])=>{const pts=profile.map(point);return add(`IFCPOLYLINE((${[...pts,pts[0]].join(",")}))`);};
  const solid=(geometry:BuildingSolid):string=>{
    if(geometry.kind==="extrusion") {
      const outer=loop(geometry.profile),profile=geometry.holes.length
        ?add(`IFCARBITRARYPROFILEDEFWITHVOIDS(.AREA.,$,${outer},(${geometry.holes.map(loop).join(",")}))`)
        :add(`IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,$,${outer})`);
      return add(`IFCEXTRUDEDAREASOLID(${profile},${axis(geometry.origin,geometry.axis==="z"?z:negativeY)},${z},${real(geometry.depth)})`);
    }
    const vertices=geometry.vertices.map(point);
    const faces=geometry.faces.map(face=>{
      const poly=add(`IFCPOLYLOOP((${face.map(i=>vertices[i]).join(",")}))`),bound=add(`IFCFACEOUTERBOUND(${poly},.T.)`);
      return add(`IFCFACE((${bound}))`);
    });
    return add(`IFCFACETEDBREP(${add(`IFCCLOSEDSHELL((${faces.join(",")}))`)})`);
  };
  const refs=new Map<string,string>(),contained:string[]=[];
  for(const element of model.elements) {
    const items=element.solids.map(solid),kind=element.solids[0].kind==="faceted"?"Brep":"SweptSolid";
    const representation=add(`IFCSHAPEREPRESENTATION(${context},'Body','${kind}',(${items.join(",")}))`);
    const shape=add(`IFCPRODUCTDEFINITIONSHAPE($,$,(${representation}))`);
    const predefined=element.ifcClass==="IfcSlab"?(element.role==="roof"?"ROOF":"FLOOR"):element.ifcClass==="IfcOpeningElement"?"OPENING":"NOTDEFINED";
    const ref=add(`${element.ifcClass.toUpperCase()}(${guid(element.id)},$,${ifcText(element.name)},$,$,${placement},${shape},${ifcText(element.id)},.${predefined}.)`);
    refs.set(element.id,ref);if(element.role!=="opening") contained.push(ref);
    const props=[
      ["ElementId",element.id],["TemplateId",model.parameters.presetId],["DesignStatus","Conceptual; qualified design review required"],
      ["GeometryBasis","User-entered metres; no dimensions inferred from photographs"],
    ].map(([name,value])=>add(`IFCPROPERTYSINGLEVALUE(${ifcText(name)},$,IFCLABEL(${ifcText(value)}),$)`));
    const pset=add(`IFCPROPERTYSET(${guid(`properties:${element.id}`)},$,'MosqueBuild_Study',$,(${props.join(",")}))`);
    add(`IFCRELDEFINESBYPROPERTIES(${guid(`definition:${element.id}`)},$,$,$,(${ref}),${pset})`);
  }
  add(`IFCRELCONTAINEDINSPATIALSTRUCTURE(${guid("containment")},$,$,$,(${contained.join(",")}),${storey})`);
  for(const element of model.elements.filter(e=>e.hostId)) {
    const host=refs.get(element.hostId!);if(!host) throw new Error("Missing opening host");
    add(`IFCRELVOIDSELEMENT(${guid(`void:${element.id}`)},$,$,$,${host},${refs.get(element.id)})`);
  }
  return `ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('mosque.build conceptual architectural geometry'),'2;1');\nFILE_NAME('mosque-build-study.ifc','${new Date().toISOString()}',(''),(''),'mosque.build','mosque.build','');\nFILE_SCHEMA(('IFC4'));\nENDSEC;\nDATA;\n${lines.join("\n")}\nENDSEC;\nEND-ISO-10303-21;\n`;
}
