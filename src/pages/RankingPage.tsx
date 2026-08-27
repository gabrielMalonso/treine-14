import { useGameData } from "@/app/providers/GameDataContext";
import { RankingTable } from "@/components/ranking/RankingTable";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

export function RankingPage() {
  const { leaderboard, mode, ready } = useGameData();

  return (
    <div className="safe-x mx-auto w-full max-w-[860px] py-8 sm:py-12">
      <div className="mb-4 flex justify-end">
        <StatusPill>{mode === "demo" ? "Ranking de demonstração" : "Ranking conectado"}</StatusPill>
      </div>
      <Card className="p-4 sm:p-6">
        {ready ? (
          <RankingTable leaderboard={leaderboard} />
        ) : (
          <div className="grid min-h-80 place-items-center text-sm text-[var(--text-secondary)]">
            Carregando ranking…
          </div>
        )}
      </Card>
    </div>
  );
}
