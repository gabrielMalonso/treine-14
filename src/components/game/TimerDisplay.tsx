import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/formatting";
import type { GameStatus } from "@/types";

type TimerDisplayProps = {
  startedAt: number | null;
  status: GameStatus;
};

export function TimerDisplay({ startedAt, status }: TimerDisplayProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const active = startedAt !== null && (status === "typing" || status === "candidate");

  useEffect(() => {
    if (!active || startedAt === null) {
      if (status === "idle") {
        setElapsedMs(0);
      }
      return;
    }

    const update = () => {
      setElapsedMs(Math.max(0, performance.now() - startedAt));
    };

    update();
    const interval = window.setInterval(update, 50);
    return () => window.clearInterval(interval);
  }, [active, startedAt, status]);

  return (
    <div
      className="font-mono text-sm font-bold tabular-nums text-[var(--text-secondary)]"
      aria-label={`Cronômetro: ${formatDuration(elapsedMs)}`}
    >
      {active ? formatDuration(elapsedMs) : "0,00s"}
    </div>
  );
}
