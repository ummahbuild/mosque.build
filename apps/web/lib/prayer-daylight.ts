export const PRAYER_DAYLIGHT_SCHEMA="mosque.build/prayer-daylight-study@1" as const;
export const PRAYER_DAYLIGHT_KEY="mosque-build.prayer-daylight.v1";

export const prayerMoments=["fajr","sunrise","dhuhr","asr","maghrib","isha"] as const;
export type PrayerMoment=(typeof prayerMoments)[number];
export type EvidenceState="illustrative"|"entered"|"source-backed";
export type SunPosition={azimuthDeg:number;elevationDeg:number};
export type PrayerDaylightStudy={schema:typeof PRAYER_DAYLIGHT_SCHEMA;status:"executable";updatedAt:string;moment:PrayerMoment;seasonLabel:string;northRotationDeg:number;cloudCoverPercent:number;lightIntensity:number;evidenceState:EvidenceState;sourceRef:string;observedAt:string;reviewerRole:string;positions:Record<PrayerMoment,SunPosition>};

export const prayerMomentLabels:Record<PrayerMoment,string>={fajr:"Fajr",sunrise:"Sunrise",dhuhr:"Dhuhr",asr:"Asr",maghrib:"Maghrib",isha:"Isha"};
// Generic angles provide an immediately usable interaction only. They are deliberately
// not derived prayer times, coordinates, dates, or claims about a real project site.
export const illustrativeSunPositions:Record<PrayerMoment,SunPosition>={
  fajr:{azimuthDeg:78,elevationDeg:-6},sunrise:{azimuthDeg:88,elevationDeg:2},dhuhr:{azimuthDeg:180,elevationDeg:68},
  asr:{azimuthDeg:244,elevationDeg:35},maghrib:{azimuthDeg:272,elevationDeg:2},isha:{azimuthDeg:282,elevationDeg:-8},
};

export function blankPrayerDaylightStudy():PrayerDaylightStudy{return{schema:PRAYER_DAYLIGHT_SCHEMA,status:"executable",updatedAt:new Date(0).toISOString(),moment:"dhuhr",seasonLabel:"Design-day study",northRotationDeg:0,cloudCoverPercent:15,lightIntensity:3,evidenceState:"illustrative",sourceRef:"",observedAt:"",reviewerRole:"",positions:structuredClone(illustrativeSunPositions)}}
const finite=(value:unknown,fallback:number,min:number,max:number)=>typeof value==="number"&&Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
export function safePrayerDaylightStudy(value:unknown):PrayerDaylightStudy{const base=blankPrayerDaylightStudy();if(!value||typeof value!=="object")return base;const x=value as Partial<PrayerDaylightStudy>,positions={...base.positions};for(const moment of prayerMoments){const raw=x.positions?.[moment];if(raw)positions[moment]={azimuthDeg:finite(raw.azimuthDeg,positions[moment].azimuthDeg,0,359.9),elevationDeg:finite(raw.elevationDeg,positions[moment].elevationDeg,-18,90)}}return{...base,...x,schema:PRAYER_DAYLIGHT_SCHEMA,status:"executable",moment:prayerMoments.includes(x.moment as PrayerMoment)?x.moment as PrayerMoment:"dhuhr",seasonLabel:typeof x.seasonLabel==="string"?x.seasonLabel.slice(0,80):base.seasonLabel,northRotationDeg:finite(x.northRotationDeg,0,-180,180),cloudCoverPercent:finite(x.cloudCoverPercent,15,0,100),lightIntensity:finite(x.lightIntensity,3,0,8),evidenceState:["illustrative","entered","source-backed"].includes(x.evidenceState??"")?x.evidenceState as EvidenceState:"illustrative",sourceRef:typeof x.sourceRef==="string"?x.sourceRef.slice(0,500):"",observedAt:typeof x.observedAt==="string"?x.observedAt.slice(0,10):"",reviewerRole:typeof x.reviewerRole==="string"?x.reviewerRole.slice(0,120):"",positions}}
export function activeSunPosition(study:PrayerDaylightStudy):SunPosition{return study.positions[study.moment]}
export function sunVector(position:SunPosition,northRotationDeg=0,distance=60):[number,number,number]{const az=(position.azimuthDeg+northRotationDeg)*Math.PI/180,el=position.elevationDeg*Math.PI/180,horizontal=Math.cos(el)*distance;return[Math.sin(az)*horizontal,Math.sin(el)*distance,-Math.cos(az)*horizontal]}
export function daylightEvidenceGaps(study:PrayerDaylightStudy):string[]{const gaps:string[]=[];if(study.evidenceState!=="source-backed")gaps.push("site-and-date-specific solar position evidence");if(!study.sourceRef)gaps.push("solar source or study reference");if(!study.observedAt)gaps.push("source observation date");if(!study.reviewerRole)gaps.push("accountable reviewer role");return gaps}
