import { useState } from "react";
import { Link } from "react-router-dom";
import { useGameData } from "@/app/providers/GameDataContext";
import { Button } from "@/components/ui/Button";
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
  const isNewRecord = result.isNewBest && result.stats.attempts > 1;

  const shareLabel =
    shareStatus === "copied"
      ? "Copiado"
      : shareStatus === "shared"
        ? "Enviado"
        : shareStatus === "failed"
          ? "Não foi possível compartilhar"
          : "Compartilhar";

  return (
    <section className="victory-result" aria-live="polite">
      <p className="victory-result-title">YOU WIN</p>
      <p className="victory-result-time">{formatDuration(result.attempt.durationMs)}</p>
      <p className="victory-result-meta">
        +{formatPoints(result.attempt.score)} pts
        {isNewRecord ? " · novo recorde" : ""}
      </p>

      <Button
        onClick={onNewAttempt}
        className="mt-5 min-h-12 min-w-[14rem] bg-[#e5ff63] text-[#11140e] shadow-[0_4px_0_#778d19] hover:bg-[#d9ff2f] active:shadow-[0_2px_0_#778d19]"
      >
        TREINAR NOVAMENTE
      </Button>

      <div className="victory-result-links">
        <Link to="/ranking">Ranking</Link>
        <button
          type="button"
          onClick={() => {
            void onShare().then(setShareStatus);
          }}
        >
          {shareLabel}
        </button>
      </div>

      {auth.available && !auth.authenticated ? (
        <button type="button" className="victory-result-auth" onClick={() => void signIn()}>
          Entrar para salvar os treinos
        </button>
      ) : null}
    </section>
  );
}
