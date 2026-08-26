import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Detailed Flat Graphic Design Marketing Mockup | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-detailed-flat-graphic-design-marketing-mockup");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
