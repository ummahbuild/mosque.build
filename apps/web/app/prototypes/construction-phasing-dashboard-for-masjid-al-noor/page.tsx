import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Construction Phasing Dashboard for Masjid Al Noor | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "construction-phasing-dashboard-for-masjid-al-noor");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
