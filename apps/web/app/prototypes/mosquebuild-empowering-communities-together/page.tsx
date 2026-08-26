import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque.build Empowering Communities Together | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "mosquebuild-empowering-communities-together");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
