import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Large Clean Marketing App Showcase Poster Mock | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-large-clean-marketing-app-showcase-poster-mock");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
