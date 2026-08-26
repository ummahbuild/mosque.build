import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Wudu and Washroom Planning Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "wudu-and-washroom-planning-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
