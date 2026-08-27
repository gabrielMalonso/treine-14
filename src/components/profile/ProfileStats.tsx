import { formatDuration, formatPoints } from "@/lib/formatting";
import type { PlayerStats } from "@/types";

type ProfileStatsProps = {
  stats: PlayerStats;
  rankLabel: string | null;
};

const items = (
  stats: PlayerStats,
  rankLabel: string | null
): Array<{ label: string; value: string }> => [
  { label: "Pontos", value: formatPoints(stats.score) },
  { label: "Ranking", value: rankLabel ? `#${rankLabel}` : "—" },
  { label: "Treinos", value: String(stats.attempts) },
  { label: "Melhor tempo", value: formatDuration(stats.bestTimeMs) },
  { label: "Sequência atual", value: String(stats.currentStreak) },
  { label: "Melhor sequência", value: String(stats.bestStreak) }
];

export function ProfileStats({ stats, rankLabel }: ProfileStatsProps) {
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items(stats, rankLabel).map((item) => (
        <div key={item.label} className="rounded-xl border border-white/7 bg-white/[0.025] p-3.5">
          <dt className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            {item.label}
          </dt>
          <dd className="mt-1 font-mono text-xl font-black tracking-tight">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
