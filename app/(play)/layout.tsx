import { DuelProvider } from "@/components/duels/DuelProvider";
import { AppShell } from "@/components/shell/AppShell";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <DuelProvider>
      <AppShell>{children}</AppShell>
    </DuelProvider>
  );
}
