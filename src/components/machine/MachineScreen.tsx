import { TARGET_NUMBER } from "@shared/game";
import { GameResult } from "@/components/game/GameResult";
import { TimerDisplay } from "@/components/game/TimerDisplay";
import { candidate } from "@/config/candidate";
import type { GameSession } from "@/types";
import { CandidatePanel } from "./CandidatePanel";
import { GameOverScreen } from "./GameOverScreen";
import { NumberDisplay } from "./NumberDisplay";
import { VictoryStage } from "./VictoryScreen";

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
      <section
        className="machine-display victory-display result-display"
        aria-label="Treino concluído"
      >
        <VictoryStage>
          <GameResult result={session.completed} onNewAttempt={onNewAttempt} onShare={onShare} />
        </VictoryStage>
      </section>
    );
  }

  const candidateVisible = session.status === "candidate" && !blankVote;
  const unrecognized =
    !candidateVisible && !blankVote && session.digits.length === TARGET_NUMBER.length;

  if (unrecognized) {
    return (
      <section className="machine-display game-over-display" aria-label="Game Over">
        <GameOverScreen digits={session.digits} />
        {error ? (
          <p className="game-over-error" aria-live="polite">
            {error}
          </p>
        ) : null}
      </section>
    );
  }

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
          {error ? <p>{error}</p> : candidateVisible || blankVote ? <VoteFooter /> : null}
        </div>
      </div>
    </section>
  );
}
