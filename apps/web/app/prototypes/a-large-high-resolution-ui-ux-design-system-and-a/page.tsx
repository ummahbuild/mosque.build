import { PrototypeFrame } from "@/components/prototype-frame";
import frameRegistry from "@/data/frame-registry.json";

export const metadata = {
  title: "Large High Resolution Ui Ux Design System and A | mosque.build prototype",
};

export default function Page() {
  const frame = frameRegistry.find((item) => item.slug === "a-large-high-resolution-ui-ux-design-system-and-a");
  if (!frame) return null;
  return <PrototypeFrame frame={frame} />;
}
