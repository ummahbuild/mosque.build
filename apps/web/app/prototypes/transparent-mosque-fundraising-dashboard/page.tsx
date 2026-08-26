import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Mosque Fundraising Dashboard | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "transparent-mosque-fundraising-dashboard");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
