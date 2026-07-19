import { SharedShell } from "@/components/layout/SharedShell";

export default function SharedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SharedShell>{children}</SharedShell>;
}
