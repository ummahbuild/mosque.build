import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque Masterplan Design Studio Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosque-masterplan-design-studio-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
