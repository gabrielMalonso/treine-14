import { TrophyIcon } from "@/components/ui/Icons";
import type { Leaderboard } from "@/types";
import { RankingRow } from "./RankingRow";

type RankingTableProps = {
  leaderboard: Leaderboard;
};

export function RankingTable({ leaderboard }: RankingTableProps) {
  const currentIsVisible = leaderboard.currentPlayer
    ? leaderboard.entries.some((entry) => entry.id === leaderboard.currentPlayer?.id)
    : false;

  return (
    <section aria-labelledby="ranking-title">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[var(--primary)] text-[#12150f]">
          <TrophyIcon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
            Melhores jogadores
          </p>
          <h1 id="ranking-title" className="text-3xl font-black tracking-tight">
            RANKING
          </h1>
        </div>
      </div>

      <div className="mb-2 hidden grid-cols-[3rem_minmax(0,1fr)_7rem_8rem] gap-3 px-3 text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-secondary)] sm:grid">
        <span>Pos.</span>
        <span>Jogador</span>
        <span className="text-right">Melhor</span>
        <span className="text-right">Pontuação</span>
      </div>

      <ol className="space-y-2">
        {leaderboard.entries.map((entry) => (
          <RankingRow key={entry.id} entry={entry} />
        ))}
      </ol>

      {leaderboard.currentPlayer && !currentIsVisible ? (
        <div className="mt-5 border-t border-dashed border-[var(--border)] pt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            Sua posição
          </p>
          <ol>
            <RankingRow entry={leaderboard.currentPlayer} />
          </ol>
        </div>
      ) : null}
    </section>
  );
}
