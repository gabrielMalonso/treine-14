import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { formatDuration, formatPoints } from "@/lib/formatting";
import type { RankingEntry } from "@/types";

type RankingRowProps = {
  entry: RankingEntry;
};

function positionLabel(position: number): string {
  if (position === 1) return "1º";
  if (position === 2) return "2º";
  if (position === 3) return "3º";
  return String(position);
}

export function RankingRow({ entry }: RankingRowProps) {
  return (
    <li
      className={cn(
        "grid grid-cols-[2.35rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-3 sm:grid-cols-[3rem_minmax(0,1fr)_7rem_8rem]",
        entry.isCurrentPlayer
          ? "border-[var(--primary)]/35 bg-[var(--primary)]/[0.075]"
          : "border-white/7 bg-white/[0.025]"
      )}
    >
      <div
        className={cn(
          "grid size-8 place-items-center rounded-lg font-mono text-sm font-black",
          entry.position <= 3
            ? "bg-[var(--primary)] text-[#13160f]"
            : "bg-white/5 text-[var(--text-secondary)]"
        )}
        aria-label={`Posição ${entry.position}`}
      >
        {positionLabel(entry.position)}
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">
            {entry.isCurrentPlayer ? `${entry.name} · você` : entry.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)] sm:hidden">
            Melhor: {formatDuration(entry.bestTimeMs)}
          </p>
        </div>
      </div>

      <div className="hidden text-right font-mono text-sm text-[var(--text-secondary)] sm:block">
        {formatDuration(entry.bestTimeMs)}
      </div>

      <div className="text-right">
        <p className="font-mono text-sm font-black sm:text-base">{formatPoints(entry.score)}</p>
        <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          pontos
        </p>
      </div>
    </li>
  );
}
