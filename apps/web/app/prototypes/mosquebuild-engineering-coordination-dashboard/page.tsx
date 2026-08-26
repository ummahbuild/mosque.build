import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque.build Engineering Coordination Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosquebuild-engineering-coordination-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
