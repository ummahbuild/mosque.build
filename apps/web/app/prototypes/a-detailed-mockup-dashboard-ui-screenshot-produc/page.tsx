import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Detailed Mockup Dashboard Ui Screenshot Produc | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-detailed-mockup-dashboard-ui-screenshot-produc");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
