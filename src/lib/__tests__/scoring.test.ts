import { describe, expect, it } from "vitest";
import { calculateScore } from "@/lib/scoring";

describe("calculateScore", () => {
  it("calcula uma pontuação razoável para um tempo normal", () => {
    const score = calculateScore({ durationMs: 1_240, streak: 12 });

    expect(score).toBeGreaterThanOrEqual(170);
    expect(score).toBeLessThanOrEqual(210);
  });

  it("limita tempos absurdamente rápidos", () => {
    const impossible = calculateScore({ durationMs: 1, streak: 0 });
    const minimum = calculateScore({ durationMs: 350, streak: 0 });

    expect(impossible).toBe(minimum);
  });

  it("mantém pontos não negativos em um tempo lento", () => {
    const score = calculateScore({ durationMs: 90_000, streak: 0 });

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBe(100);
  });

  it("aplica bônus de sequência com limite", () => {
    const noStreak = calculateScore({ durationMs: 1_500, streak: 0 });
    const withStreak = calculateScore({ durationMs: 1_500, streak: 10 });
    const capped = calculateScore({ durationMs: 1_500, streak: 999 });
    const maxExpected = calculateScore({ durationMs: 1_500, streak: 25 });

    expect(withStreak - noStreak).toBe(20);
    expect(capped).toBe(maxExpected);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "nunca retorna número inválido para duração %s",
    (durationMs) => {
      const score = calculateScore({ durationMs, streak: Number.NaN });

      expect(Number.isFinite(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
    }
  );
});
