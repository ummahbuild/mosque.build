import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Parking Compliance Dashboard Mockup | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "parking-compliance-dashboard-mockup");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
