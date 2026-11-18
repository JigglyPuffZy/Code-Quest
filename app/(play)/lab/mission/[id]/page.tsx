import { LabMissionView } from "@/components/lab/LabMissionView";
import { getLabMission } from "@/lib/lab/missions";
import { notFound } from "next/navigation";
export default async function LabMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = getLabMission(id);
  if (!mission) notFound();
  return <LabMissionView mission={mission} />;
}
