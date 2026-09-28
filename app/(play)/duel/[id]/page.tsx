import { DuelArenaView } from "@/components/duels/DuelArenaView";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function DuelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PageHeader
        eyebrow="Duel arena"
        title="Code showdown"
        description="Random question · first correct answer wins."
      />
      <DuelArenaView duelId={id} />
    </div>
  );
}
