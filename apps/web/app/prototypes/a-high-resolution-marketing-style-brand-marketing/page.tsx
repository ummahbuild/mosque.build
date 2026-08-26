import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "High Resolution Marketing Style Brand Marketing | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-high-resolution-marketing-style-brand-marketing");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
