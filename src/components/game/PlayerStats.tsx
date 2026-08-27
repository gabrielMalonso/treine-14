import { formatDuration, formatPoints } from "@/lib/formatting";
import type { PlayerStats as PlayerStatsType } from "@/types";

type PlayerStatsProps = {
  stats: PlayerStatsType;
  compact?: boolean;
};

const statClass = "rounded-xl border border-black/10 bg-black/[0.045] px-3 py-2";

export function PlayerStats({ stats, compact = false }: PlayerStatsProps) {
  return (
    <dl className={`grid gap-2 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
      <div className={statClass}>
        <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
          Pontos
        </dt>
        <dd className="mt-0.5 font-mono text-base font-black">{formatPoints(stats.score)}</dd>
      </div>
      <div className={statClass}>
        <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
          Treinos
        </dt>
        <dd className="mt-0.5 font-mono text-base font-black">{stats.attempts}</dd>
      </div>
      <div className={statClass}>
        <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
          Melhor
        </dt>
        <dd className="mt-0.5 font-mono text-base font-black">
          {formatDuration(stats.bestTimeMs)}
        </dd>
      </div>
      {!compact ? (
        <div className={statClass}>
          <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
            Sequência
          </dt>
          <dd className="mt-0.5 font-mono text-base font-black">{stats.currentStreak}</dd>
        </div>
      ) : null}
    </dl>
  );
}
