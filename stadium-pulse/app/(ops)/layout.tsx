import { OpsShell } from "@/components/layout/OpsShell";

export default function OpsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <OpsShell>{children}</OpsShell>;
}
