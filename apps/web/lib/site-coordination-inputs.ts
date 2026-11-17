import type {SiteCoordinationInputs} from "./site-coordination-model";

export const SITE_COORDINATION_KEYS = [
  "mosque-build.site-qibla-evidence.v1", "mosque-build.site-context-analysis.v1",
  "mosque-build.schematic-plan.v1", "mosque-build.site-access-environment.v1",
  "mosque-build.solar-design.v1", "mosque-build.floor-plan.v1", "mosque-build.site-analysis.v1",
] as const;

export function subscribeSiteCoordinationChanges(
  onChange: () => void,
  getStorage: () => Storage,
  target: Pick<Window, "addEventListener" | "removeEventListener"> = window,
): () => void {
  const storageChanged = (event: StorageEvent) => {
    if (event.key !== null && !SITE_COORDINATION_KEYS.some(key => key === event.key)) return;
    try {if (event.storageArea !== getStorage()) return;} catch {return;}
    onChange();
  };
  target.addEventListener("mosque-build:project-change", onChange);
  target.addEventListener("storage", storageChanged);
  return () => {
    target.removeEventListener("mosque-build:project-change", onChange);
    target.removeEventListener("storage", storageChanged);
  };
}

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value !== null && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const text = (value: unknown) => typeof value === "string" ? value.trim().slice(0, 1000) : "";
const number = (value: unknown): number | undefined => {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
};
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Read-only adapter: damaged saved records are never rewritten by the preview. */
export function readSiteCoordinationInputs(storage: Pick<Storage, "getItem">): {inputs: Partial<SiteCoordinationInputs>; warnings: string[]} {
  const warnings = new Set<string>();
  const warn = (name: string) => warnings.add(name);
  const read = (key: string) => {
    try {
      const raw = storage.getItem(key);
      if (raw === null) return {};
      const value: unknown = JSON.parse(raw);
      if (value === null || typeof value !== "object" || Array.isArray(value)) {warn(key); return {};}
      return record(value);
    } catch {warn(key); return {};}
  };
  const rows = (value: unknown, limit: number, label: string): RecordValue[] => {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {warn(label); return [];}
    if (value.length > limit) warn(label);
    return value.slice(0, limit).flatMap(item => {
      if (item === null || typeof item !== "object" || Array.isArray(item)) {warn(label); return [];}
      return [record(item)];
    });
  };
  const [q, context, plan, access, solar, floor, analysis] = SITE_COORDINATION_KEYS.map(read);
  const qibla = record(context.qibla), terrain = record(context.terrain), flood = record(context.flood), parking = record(access.parking);
  const positive = (value: unknown) => {const n = number(value); return n !== undefined && n > 0 ? n : undefined;};
  const terrainPoints = rows(terrain.points, 100, "terrain samples").flatMap((p, i) => {
    const x = number(p.xM), z = number(p.zM), elevation = number(p.elevationM);
    if (x === undefined || z === undefined || elevation === undefined) {warn("terrain samples"); return [];}
    return [{id: text(p.id) || String(i), xM: clamp(x, 0, 500), zM: clamp(z, 0, 500), elevationM: clamp(elevation, -100, 10000), sourceRef: text(p.sourceRef)}];
  });
  const floodZones = rows(flood.zones, 30, "flood zones").flatMap((z, i) => {
    const x = number(z.xM), depth = positive(z.depthM), width = positive(z.widthM), y = number(z.zM), water = number(z.waterDepthM), level = number(z.designLevelM);
    if (x === undefined || y === undefined || width === undefined || depth === undefined || water === undefined || level === undefined) {warn("flood zones"); return [];}
    return [{id: text(z.id) || String(i), label: text(z.label), xM: x, zM: y, widthM: width, depthM: depth, waterDepthM: clamp(water, 0, 100), designLevelM: clamp(level, -100, 10000), sourceRef: text(z.sourceRef), confidence: text(z.confidence) || "unknown"}];
  });
  const solarZones = rows(solar.roofZones, 20, "solar zones").flatMap((z, i) => {
    const area = positive(z.areaM2);
    if (area === undefined) {warn("solar zones"); return [];}
    return [{id: text(z.id) || String(i), label: text(z.label), areaM2: area, usablePercent: number(z.usablePercent) ?? 0, shadePercent: number(z.shadePercent) ?? 0, orientationDeg: number(z.orientationDeg) ?? 0, tiltDeg: number(z.tiltDeg) ?? 0, structureRef: text(z.structureRef)}];
  });
  const constraints = rows(analysis.candidates, 50, "site constraints").flatMap(candidate =>
    Object.entries(record(candidate.criteria)).filter(([, value]) => text(record(value).evidenceRef)).slice(0, 3)
      .map(([id, value]) => ({id, label: id.replaceAll("-", " "), sourceRef: text(record(value).evidenceRef)})),
  ).slice(0, 12);
  const bearingSources = [
    {value: qibla.bearingDeg, reference: text(qibla.methodRef), confidence: text(qibla.mode), tolerance: number(qibla.toleranceDeg) ?? 0},
    {value: q.qiblaBearing, reference: text(q.reference), confidence: text(q.qiblaAccuracy), tolerance: 0},
    {value: plan.qiblaDeg, reference: "", confidence: "unknown", tolerance: 0},
  ];
  const bearingSource = bearingSources.find(source => {
    const n = number(source.value);
    const valid = n !== undefined && n >= 0 && n < 360;
    if (!valid && source.value !== undefined && source.value !== null && source.value !== "") warn("qibla bearing");
    return valid;
  });
  const inputs: Partial<SiteCoordinationInputs> = {
    siteWidthM: positive(q.width) ?? Math.max(48, positive(plan.widthM) ?? 0),
    siteDepthM: positive(q.depth) ?? Math.max(64, positive(plan.depthM) ?? 0),
    buildingWidthM: positive(plan.widthM) ?? 30, buildingDepthM: positive(plan.depthM) ?? 36,
    // Zero is a valid bearing; an empty field is not a zero bearing.
    qiblaDeg: number(bearingSource?.value) ?? 0,
    qiblaToleranceDeg: bearingSource?.tolerance ?? 0, qiblaConfidence: bearingSource?.confidence || "unknown",
    qiblaRef: bearingSource?.reference ?? "", boundaryRef: text(q.reference),
    accessibleRouteRef: text(rows(access.access, 100, "access records").find(x => x.id === "access-5")?.evidenceRef),
    parkingSpaces: number(parking.plannedSpaces) ?? 0, accessibleSpaces: number(parking.accessibleSpaces) ?? 0,
    terrainDatum: text(terrain.datumLabel), terrainSourceRef: text(terrain.sourceRef), terrainPoints,
    finishedFloorLevelM: number(flood.finishedFloorLevelM) ?? 0, floodSourceRef: text(flood.sourceRef), floodZones,
    solarZones, constraints, bimElementCount: rows(floor.spaces, 100000, "floor-plan spaces").length,
  };
  return {inputs, warnings: [...warnings]};
}
