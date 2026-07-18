import { SharedShell } from "@/components/layout/SharedShell";

export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return <SharedShell>{children}</SharedShell>;
}
