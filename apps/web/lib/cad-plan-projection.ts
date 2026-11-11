import { wallLength, type CadDocument } from "./cad-authoring-core";

/** Renderer-neutral endpoints for hosted openings, in document metres. */
export function cadPlanOpenings(doc: CadDocument) {
  return doc.openings.flatMap(opening => {
    const host = doc.walls.find(wall => wall.id === opening.hostWallId);
    if (!host) return [];
    const length = wallLength(host);
    if (!Number.isFinite(length) || length <= 0) return [];
    const at = (offset: number) => ({
      x: host.start.x + (host.end.x - host.start.x) * offset / length,
      y: host.start.y + (host.end.y - host.start.y) * offset / length,
    });
    return [{ ...opening, start: at(opening.offsetM), end: at(opening.offsetM + opening.widthM), thicknessM: host.thicknessM }];
  });
}
