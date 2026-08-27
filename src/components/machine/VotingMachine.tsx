import type { useGame } from "@/hooks/useGame";
import { MachineKeypad } from "./MachineKeypad";
import { MachineScreen } from "./MachineScreen";

type GameController = ReturnType<typeof useGame>;

type VotingMachineProps = {
  game: GameController;
};

export function VotingMachine({ game }: VotingMachineProps) {
  const completed = game.session.status === "completed";
  const controlsDisabled = completed || game.isSubmitting;

  return (
    <div className="machine-frame" aria-label="Equipamento virtual Treine o 14">
      <div className="machine-layout">
        <MachineScreen
          session={game.session}
          startedAt={game.startedAt}
          error={game.error}
          blankVote={game.blankVote}
          onNewAttempt={game.newAttempt}
          onShare={game.share}
        />

        <aside className="machine-controls" aria-label="Controles da máquina">
          <MachineKeypad
            disabled={controlsDisabled}
            onDigit={game.pressDigit}
            onBlank={game.blank}
            onCorrect={game.correct}
            onConfirm={() => {
              void game.confirm();
            }}
          />

          <p className="mt-3 text-center text-[0.58rem] font-semibold leading-relaxed text-[#5c5c58]">
            Use também os números do teclado, Backspace para corrigir e Enter para confirmar.
          </p>
        </aside>
      </div>
    </div>
  );
}
