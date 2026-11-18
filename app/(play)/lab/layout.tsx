import { LabShell } from "@/components/lab/LabShell";
export const metadata = { title: "Developer lab" };
export default function DeveloperLabLayout({ children }: { children: React.ReactNode }) { return <LabShell>{children}</LabShell>; }
