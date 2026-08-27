import { TARGET_NUMBER } from "@shared/game";
import { GameResult } from "@/components/game/GameResult";
import { TimerDisplay } from "@/components/game/TimerDisplay";
import { candidate } from "@/config/candidate";
import type { GameSession } from "@/types";
import { CandidatePanel } from "./CandidatePanel";
import { NumberDisplay } from "./NumberDisplay";

type MachineScreenProps = {
  session: GameSession;
  startedAt: number | null;
  error: string | null;
  blankVote: boolean;
  onNewAttempt: () => void;
  onShare: () => Promise<"shared" | "copied" | "failed">;
};

function VoteFooter() {
  return (
    <>
      <p>Aperte a tecla:</p>
      <p>CONFIRMA para CONFIRMAR este voto</p>
      <p>CORRIGE para REINICIAR este voto</p>
    </>
  );
}

export function MachineScreen({
  session,
  startedAt,
  error,
  blankVote,
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

  const candidateVisible = session.status === "candidate" && !blankVote;
  const unrecognized =
    !candidateVisible && !blankVote && session.digits.length === TARGET_NUMBER.length;

  return (
    <section className="machine-display" aria-label={`Tela de votação para ${candidate.office}`}>
      <div className="urna-lcd">
        <div className="urna-lcd-header">
          <p className="urna-lcd-kicker">Seu voto para</p>
          <p className="urna-lcd-banner">Treino</p>
          <TimerDisplay startedAt={startedAt} status={session.status} />
        </div>

        {blankVote ? (
          <>
            <h1 className="urna-lcd-office">{candidate.office}</h1>
            <p className="urna-lcd-blank">VOTO EM BRANCO</p>
          </>
        ) : candidateVisible ? (
          <>
            <h1 className="urna-lcd-office">{candidate.office}</h1>
            <CandidatePanel digits={session.digits} />
          </>
        ) : (
          <div className="urna-number-entry">
            <h1 className="urna-lcd-office">{candidate.office}</h1>
            <NumberDisplay digits={session.digits} />
          </div>
        )}

        <div className="urna-lcd-footer" aria-live="polite">
          {error ? (
            <p>{error}</p>
          ) : unrecognized ? (
            <p>Número não reconhecido. Use CORRIGE.</p>
          ) : candidateVisible || blankVote ? (
            <VoteFooter />
          ) : null}
        </div>
      </div>
    </section>
  );
}
