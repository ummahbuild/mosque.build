import"./landing-area-motion.css";
const supported=["design","permits","funding","marketplace","construction","operations"] as const;
export function LandingAreaMotion({scene}:{scene:string}){const safe=supported.includes(scene as typeof supported[number])?scene:"design";return <div className="areaMotion" data-scene={safe} aria-hidden="true"><i/><i/><i/><i/><span/></div>}
