import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Wide High Resolution Infographic Style Collage S | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-wide-high-resolution-infographic-style-collage-s");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
