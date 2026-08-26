
import {smallestRoomCycles,saffLayoutV2,runTakeoff,costRollup} from "../src/core_algorithms_v26.mjs";
import fs from "node:fs";
const walls=[
{id:"w1",a:{x:0,y:0},b:{x:10,y:0}},
{id:"w2",a:{x:10,y:0},b:{x:10,y:6}},
{id:"w3",a:{x:10,y:6},b:{x:0,y:6}},
{id:"w4",a:{x:0,y:6},b:{x:0,y:0}}
];
const rooms=smallestRoomCycles(walls);
const saff=saffLayoutV2(rooms[0],{rowSpacing:1.1,personWidth:.65});
const rules=[{key:"carpet",object_kind:"space",formula:"floor_area",unit:"m2",waste_default_pct:7}];
const takeoff=runTakeoff([{id:"prayer",kind:"space",polygon:rooms[0]}],rules);
const cost=costRollup(takeoff,{carpet:25});
const trace={rooms:rooms.length,roomArea:60,saff:{usable:saff.usable,rows:saff.rowCount},takeoff,cost};
fs.writeFileSync(new URL("./DEMO_V26_TRACE.json",import.meta.url),JSON.stringify(trace,null,2));
console.log(JSON.stringify(trace,null,2));
