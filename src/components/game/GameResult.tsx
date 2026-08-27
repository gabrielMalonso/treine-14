import { useState } from "react";
import { Link } from "react-router-dom";
import { useGameData } from "@/app/providers/GameDataContext";
import { Button } from "@/components/ui/Button";
import { ShareIcon, TrophyIcon } from "@/components/ui/Icons";
import { formatDuration, formatPoints } from "@/lib/formatting";
import type { CompletedAttempt } from "@/types";

type ShareStatus = "idle" | "shared" | "copied" | "failed";

type GameResultProps = {
  result: CompletedAttempt;
  onNewAttempt: () => void;
  onShare: () => Promise<"shared" | "copied" | "failed">;
};

export function GameResult({ result, onNewAttempt, onShare }: GameResultProps) {
  const { auth, signIn } = useGameData();
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");

  const shareLabel =
    shareStatus === "copied"
      ? "Resultado copiado"
      : shareStatus === "shared"
        ? "Compartilhado"
        : shareStatus === "failed"
          ? "Não foi possível compartilhar"
          : "Compartilhar";

  return (
    <section className="flex h-full min-h-0 flex-col justify-center" aria-live="polite">
      <div className="mx-auto w-full max-w-[34rem]">
        <div className="mb-3 text-center">
          <p className="urna-fim">FIM</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="inline-flex rounded-sm bg-[#2f7e4b] px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">
              Treino concluído
            </span>
            {result.isNewBest && result.stats.attempts > 1 ? (
              <span className="rounded-sm bg-[#e85d1c] px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">
                Novo recorde
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[clamp(2.2rem,7vw,4.6rem)] font-black leading-none tracking-[-0.06em]">
              {formatDuration(result.attempt.durationMs)}
            </p>
            <p className="mt-1 text-base font-black text-[#2f7e4b]">
              +{formatPoints(result.attempt.score)} pontos
            </p>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.045] px-3 py-2 text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
              Sequência
            </p>
            <p className="font-mono text-2xl font-black">{result.stats.currentStreak}</p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-black/10 bg-black/[0.045] px-3 py-2">
            <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
              Melhor tempo
            </dt>
            <dd className="font-mono text-lg font-black">
              {formatDuration(result.stats.bestTimeMs)}
            </dd>
          </div>
          <div className="rounded-xl border border-black/10 bg-black/[0.045] px-3 py-2">
            <dt className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--screen-muted)]">
              Treinos
            </dt>
            <dd className="font-mono text-lg font-black">{result.stats.attempts}</dd>
          </div>
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            onClick={onNewAttempt}
            className="col-span-2 min-h-12 bg-[#3ea34a] text-white shadow-[0_4px_0_#1e5c26] hover:bg-[#46b352] active:shadow-[0_2px_0_#1e5c26]"
          >
            TREINAR NOVAMENTE
          </Button>
          <Link
            to="/ranking"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/15 bg-black/[0.045] px-3 text-sm font-extrabold text-[#20231f] transition-colors hover:bg-black/[0.08]"
          >
            <TrophyIcon className="size-4" />
            Ver ranking
          </Link>
          <Button
            variant="secondary"
            className="border-black/15 bg-black/[0.045] text-[#20231f] hover:bg-black/[0.08]"
            icon={<ShareIcon className="size-4" />}
            onClick={() => {
              void onShare().then(setShareStatus);
            }}
          >
            {shareLabel}
          </Button>
        </div>

        {auth.available && !auth.authenticated ? (
          <button
            type="button"
            onClick={() => {
              void signIn();
            }}
            className="mt-3 w-full rounded-xl border border-black/10 bg-white/55 px-3 py-2 text-xs font-bold text-[#33372f] transition-colors hover:bg-white/80"
          >
            Continuar com Google para salvar os próximos treinos
          </button>
        ) : null}
      </div>
    </section>
  );
}
