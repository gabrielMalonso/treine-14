import { ActionButtons } from "./ActionButtons";
import { MachineScreen } from "./MachineScreen";
import { NumericKeypad } from "./NumericKeypad";
import type { useGame } from "@/hooks/useGame";

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
          onNewAttempt={game.newAttempt}
          onShare={game.share}
        />

        <aside className="machine-controls" aria-label="Controles da máquina">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#595b52]">
              Teclado
            </span>
            <span className="flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-wider text-[#686a61]">
              <span
                className={`size-2 rounded-full ${
                  game.session.status === "candidate"
                    ? "bg-[#42a766] shadow-[0_0_0_4px_rgb(66_167_102_/_0.15)]"
                    : "bg-[#8e9088]"
                }`}
                aria-hidden="true"
              />
              {game.isSubmitting ? "Registrando" : "Pronto"}
            </span>
          </div>

          <NumericKeypad onDigit={game.pressDigit} disabled={controlsDisabled} />
          <ActionButtons
            onCorrect={game.correct}
            onConfirm={() => {
              void game.confirm();
            }}
            confirmEnabled={game.session.status === "candidate"}
            disabled={controlsDisabled}
          />

          <p className="mt-4 text-center text-[0.58rem] font-semibold leading-relaxed text-[#686a61]">
            Use também os números do teclado, Backspace para corrigir e Enter para confirmar.
          </p>
        </aside>
      </div>
    </div>
  );
}
