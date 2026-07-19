import { FanShell } from "@/components/layout/FanShell";

export default function FanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <FanShell>{children}</FanShell>;
}
