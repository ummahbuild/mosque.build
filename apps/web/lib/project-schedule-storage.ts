import {safeSchedule,type ScheduleState} from "./project-schedule";

export const SCHEDULE_STORAGE_KEY="mosque-build.project-schedule.v1";
export const SCHEDULE_MAX_BYTES=2_000_000;
export type ScheduleRead={kind:"missing"|"ready"|"recovery"|"unavailable";raw:string|null|undefined;state:ScheduleState|null;message:string};
export function readScheduleStorage(storage:Pick<Storage,"getItem">):ScheduleRead{
  let raw:string|null;
  try{raw=storage.getItem(SCHEDULE_STORAGE_KEY)}catch{return {kind:"unavailable",raw:undefined,state:null,message:"Browser storage could not be read. Saving is blocked to protect existing work."}}
  if(raw===null)return {kind:"missing",raw,state:null,message:"No schedule is saved yet."};
  try{if(new TextEncoder().encode(raw).byteLength<=SCHEDULE_MAX_BYTES){const state=safeSchedule(JSON.parse(raw));if(state)return {kind:"ready",raw,state,message:"Saved schedule loaded."}}}catch{}
  return {kind:"recovery",raw,state:null,message:"The saved schedule could not be read safely. The original is unchanged. Download it for recovery or restore a repaired project package."};
}
export function writeScheduleStorage(storage:Pick<Storage,"getItem"|"setItem">,expected:string|null|undefined,state:ScheduleState){
  if(expected===undefined)throw new Error("Reload the saved schedule before saving. Browser storage has not been read.");
  if(storage.getItem(SCHEDULE_STORAGE_KEY)!==expected)throw new Error("The saved schedule changed in another tab or planning tool. Download your working copy, then reload the saved schedule. Your changes have not replaced it.");
  if(!safeSchedule(state))throw new Error("The working schedule has unsupported data. Download it before reloading.");
  const raw=JSON.stringify(state);if(new TextEncoder().encode(raw).byteLength>SCHEDULE_MAX_BYTES)throw new Error("This schedule exceeds the 2 MB limit. Download the working copy before reducing it.");
  storage.setItem(SCHEDULE_STORAGE_KEY,raw);return raw;
}
