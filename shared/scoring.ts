export const SCORE_LIMITS = {
  minMeasuredDurationMs: 1,
  minScoredDurationMs: 350,
  maxScoredDurationMs: 15_000,
  maxAcceptedDurationMs: 120_000,
  maxStreakBonus: 25
} as const;

export type ScoreInput = {
  durationMs: number;
  streak: number;
};

/**
 * Fórmula única do projeto.
 *
 * - 100 pontos base por treino concluído;
 * - até 100 pontos de velocidade, com retorno decrescente;
 * - 2 pontos por item da sequência, limitados a 25 itens.
 *
 * A duração é limitada apenas para o cálculo; o melhor tempo mantém o valor medido.
 */
export function calculateScore({ durationMs, streak }: ScoreInput): number {
  const safeDuration = Number.isFinite(durationMs)
    ? Math.min(
        SCORE_LIMITS.maxScoredDurationMs,
        Math.max(SCORE_LIMITS.minScoredDurationMs, durationMs)
      )
    : SCORE_LIMITS.maxScoredDurationMs;

  const safeStreak = Number.isFinite(streak)
    ? Math.min(SCORE_LIMITS.maxStreakBonus, Math.max(0, Math.floor(streak)))
    : 0;

  const speedBonus = Math.round(
    100 * Math.exp(-(safeDuration - SCORE_LIMITS.minScoredDurationMs) / 1_800)
  );
  const streakBonus = safeStreak * 2;
  const score = 100 + speedBonus + streakBonus;

  return Number.isFinite(score) ? Math.max(0, Math.round(score)) : 0;
}

export function isAcceptableDuration(durationMs: number): boolean {
  return (
    Number.isFinite(durationMs) &&
    durationMs >= SCORE_LIMITS.minMeasuredDurationMs &&
    durationMs <= SCORE_LIMITS.maxAcceptedDurationMs
  );
}
