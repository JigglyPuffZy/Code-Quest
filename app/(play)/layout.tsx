import "./workspace.css";
import { DuelProvider } from "@/components/duels/DuelProvider";
import { AppShell } from "@/components/shell/AppShell";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="workspace"><DuelProvider>
      <AppShell>{children}</AppShell>
    </DuelProvider></div>
  );
}
