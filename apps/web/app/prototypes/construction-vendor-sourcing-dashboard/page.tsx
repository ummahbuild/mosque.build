import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Construction Vendor Sourcing Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "construction-vendor-sourcing-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
