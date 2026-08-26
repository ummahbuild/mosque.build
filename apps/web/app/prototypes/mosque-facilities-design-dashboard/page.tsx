import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque Facilities Design Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosque-facilities-design-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
