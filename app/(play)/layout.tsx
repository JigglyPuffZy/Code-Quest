import { AppShell } from "@/components/shell/AppShell";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
