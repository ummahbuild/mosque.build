import type {SiteLayer} from "./site-coordination-model";

export const SITE_LAYERS: SiteLayer[] = ["site", "terrain", "flood", "building", "access", "solar", "constraints", "bim"];
export type SiteLayerVisibility = Record<SiteLayer, boolean>;
export const initialSiteLayerVisibility = (): SiteLayerVisibility => ({site: true, terrain: true, flood: true, building: true, access: true, solar: true, constraints: true, bim: true});

/** Structural render-adapter contract, independent of any scene engine. */
type LayerObject = {visible: boolean; userData: {layer?: unknown; id?: unknown}};
export function applySiteLayerVisibility(objects: readonly LayerObject[], visibility: SiteLayerVisibility, selectedId = ""): string {
  for (const object of objects) {
    const layer = object.userData.layer;
    object.visible = typeof layer === "string" && SITE_LAYERS.includes(layer as SiteLayer) && visibility[layer as SiteLayer];
  }
  return objects.some(object => object.visible && object.userData.id === selectedId) ? selectedId : "";
}
