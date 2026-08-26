import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Ui Brand Presentation Board Dashboard Mocku | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "wide-ui-brand-presentation-board-dashboard-mocku");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
