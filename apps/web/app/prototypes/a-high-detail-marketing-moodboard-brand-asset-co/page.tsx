import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "High Detail Marketing Moodboard Brand Asset Co | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-high-detail-marketing-moodboard-brand-asset-co");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
