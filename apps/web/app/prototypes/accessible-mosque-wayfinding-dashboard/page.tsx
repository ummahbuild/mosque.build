import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Accessible Mosque Wayfinding Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "accessible-mosque-wayfinding-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
