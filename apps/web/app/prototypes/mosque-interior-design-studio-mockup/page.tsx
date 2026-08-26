import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque Interior Design Studio Mockup | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosque-interior-design-studio-mockup");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
