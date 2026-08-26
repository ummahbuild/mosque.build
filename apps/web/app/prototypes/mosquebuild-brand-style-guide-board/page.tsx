import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque.build Brand Style Guide Board | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosquebuild-brand-style-guide-board");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
