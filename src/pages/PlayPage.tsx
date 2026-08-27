import { RotateIcon } from "@/components/ui/Icons";
import { VotingMachine } from "@/components/machine/VotingMachine";
import { useGame } from "@/hooks/useGame";
import { useOrientation } from "@/hooks/useOrientation";

export function PlayPage() {
  const game = useGame();
  const { compactPortrait } = useOrientation();

  return (
    <div className="safe-x mx-auto w-full max-w-[1240px] py-3 sm:py-5">
      {compactPortrait ? (
        <div className="portrait-hint mb-3 flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-2 text-center text-xs font-semibold text-[var(--text-secondary)]">
          <RotateIcon className="size-4 shrink-0" />
          Para uma experiência melhor, gire o celular.
        </div>
      ) : null}

      <VotingMachine game={game} />
    </div>
  );
}
