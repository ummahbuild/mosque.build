import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Prayer Hall Interior Design Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "prayer-hall-interior-design-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
