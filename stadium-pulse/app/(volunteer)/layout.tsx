import { VolunteerShell } from "@/components/layout/VolunteerShell";

export default function VolunteerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <VolunteerShell>{children}</VolunteerShell>;
}
