import { formatAttemptDate, formatDuration, formatPoints } from "@/lib/formatting";
import type { Attempt } from "@/types";

type RecentAttemptsProps = {
  attempts: Attempt[];
};

export function RecentAttempts({ attempts }: RecentAttemptsProps) {
  return (
    <section aria-labelledby="recent-attempts-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
            Histórico
          </p>
          <h2 id="recent-attempts-title" className="text-xl font-black">
            Treinos recentes
          </h2>
        </div>
        <span className="text-xs text-[var(--text-secondary)]">
          últimos {Math.min(attempts.length, 100)}
        </span>
      </div>

      {attempts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-secondary)]">
          Seu primeiro tempo aparecerá aqui.
        </div>
      ) : (
        <ol className="divide-y divide-white/7 overflow-hidden rounded-xl border border-white/7">
          {attempts.slice(0, 20).map((attempt, index) => (
            <li
              key={attempt.id}
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 bg-white/[0.02] px-3 py-3"
            >
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm font-black">{formatDuration(attempt.durationMs)}</p>
                <p className="truncate text-xs text-[var(--text-secondary)]">
                  {formatAttemptDate(attempt.createdAt)}
                  {attempt.synced ? " · sincronizado" : ""}
                </p>
              </div>
              <strong className="font-mono text-sm text-[var(--primary)]">
                +{formatPoints(attempt.score)}
              </strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
