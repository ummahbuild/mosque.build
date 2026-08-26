import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Imagegen | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "imagegen");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
