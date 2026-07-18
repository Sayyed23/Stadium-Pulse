import { OpsShell } from "@/components/layout/OpsShell";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return <OpsShell>{children}</OpsShell>;
}
