import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "High Detail Marketing Brand Asset Board Dashbo | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-high-detail-marketing-brand-asset-board-dashbo");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
