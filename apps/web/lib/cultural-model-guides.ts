export type CulturalGuide={id:string;label:string;kind:"axis"|"bay"|"court"|"center";points:Array<[number,number,number]>;note:string};

/** Analytical guides, never historic reconstruction geometry. */
export function createCulturalGuides(lineageId:string|undefined,width:number,depth:number):CulturalGuide[]{
  const y=.18,axis=(id:string,label:string,a:[number,number,number],b:[number,number,number],note:string):CulturalGuide=>({id,label,kind:"axis",points:[a,b],note});
  if(lineageId==="hypostyle-courtyard"||lineageId==="anatolian-timber-hypostyle"||lineageId==="andalusi-hypostyle")return Array.from({length:5},(_,index)=>{const x=width*(index+1)/6;return {...axis(`bay-${index}`,`Bay coordination line ${index+1}`,[x,y,depth*.08],[x,y,depth*.78],"Coordinate any structural grid with complete prayer rows, sightlines and accessible routes."),kind:"bay"}});
  if(lineageId==="four-iwan-courtyard"||lineageId==="indo-islamic-courtyard-screen")return [axis("qibla-axis","Qibla hierarchy study",[width/2,y,0],[width/2,y,depth],"A directional study guide, not an iwan or historic reconstruction."),{id:"court-guide",label:"Courtyard proportion study",kind:"court",points:[[width*.25,y,depth*.28],[width*.75,y,depth*.28],[width*.75,y,depth*.72],[width*.25,y,depth*.72],[width*.25,y,depth*.28]],note:"Test climate, circulation and capacity before treating a court as appropriate."}];
  if(lineageId==="ottoman-central-dome")return [{id:"center-study",label:"Central volume coordination ring",kind:"center",points:Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2,r=Math.min(width,depth)*.24;return [width/2+Math.cos(a)*r,y,depth/2+Math.sin(a)*r]}),note:"This ring studies centrality only; it is not dome or structural geometry."}];
  return [axis("qibla-axis","Qibla coordination axis",[width/2,y,0],[width/2,y,depth],"Confirm the working bearing and prayer-row relationship through accountable review.")];
}
