import { TARGET_NUMBER } from "@shared/game";
import { GameResult } from "@/components/game/GameResult";
import { TimerDisplay } from "@/components/game/TimerDisplay";
import type { GameSession } from "@/types";
import { CandidatePanel } from "./CandidatePanel";
import { NumberDisplay } from "./NumberDisplay";

type MachineScreenProps = {
  session: GameSession;
  startedAt: number | null;
  error: string | null;
  onNewAttempt: () => void;
  onShare: () => Promise<"shared" | "copied" | "failed">;
};

function getInstruction(session: GameSession): string {
  if (session.status === "idle") {
    return "Digite 14. O cronômetro começa na primeira tecla.";
  }

  if (session.status === "candidate") {
    return "Dados reconhecidos. Aperte CONFIRMA.";
  }

  if (session.digits.length === TARGET_NUMBER.length) {
    return "Digite 14 para concluir o treino. Use CORRIGE.";
  }

  return "Continue digitando.";
}

export function MachineScreen({
  session,
  startedAt,
  error,
  onNewAttempt,
  onShare
}: MachineScreenProps) {
  if (session.status === "completed" && session.completed) {
    return (
      <div className="machine-display result-display p-4 sm:p-6">
        <GameResult result={session.completed} onNewAttempt={onNewAttempt} onShare={onShare} />
      </div>
    );
  }

  const candidateVisible = session.status === "candidate";

  return (
    <section className="machine-display flex min-h-0 flex-col p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[var(--screen-muted)]">
            Equipamento de treino
          </p>
          <h1 className="mt-1 text-xl font-black tracking-[-0.03em] sm:text-2xl">TREINE O 14</h1>
        </div>
        <TimerDisplay startedAt={startedAt} status={session.status} />
      </div>

      <div className="mt-4">
        <p className="mb-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--screen-muted)]">
          Número
        </p>
        <NumberDisplay digits={session.digits} />
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <CandidatePanel visible={candidateVisible} />
      </div>

      <div
        className={`mt-3 min-h-10 rounded-xl border px-3 py-2 text-sm font-bold ${
          candidateVisible
            ? "border-[#2f7e4b]/25 bg-[#2f7e4b]/10 text-[#285f3d]"
            : "border-black/10 bg-black/[0.035] text-[var(--screen-muted)]"
        }`}
        aria-live="polite"
      >
        {error ?? getInstruction(session)}
      </div>
    </section>
  );
}
