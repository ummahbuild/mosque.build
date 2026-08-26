import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Wide Flat Ui Design Mockup Dashboard Screensh | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-wide-flat-ui-design-mockup-dashboard-screensh");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
