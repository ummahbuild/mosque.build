import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "High Resolution Marketing Asset Collage Brand Ki | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-high-resolution-marketing-asset-collage-brand-ki");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
