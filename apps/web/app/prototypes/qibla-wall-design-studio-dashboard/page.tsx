import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Qibla Wall Design Studio Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "qibla-wall-design-studio-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
