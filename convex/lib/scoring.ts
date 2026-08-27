import { calculateScore, isAcceptableDuration } from "../../shared/scoring";
import { SERVER_MIN_DURATION_MS } from "../../shared/game";
import { ConvexError } from "convex/values";

export function calculateScoreServerSide(durationMs: number, streak: number): number {
  if (!isAcceptableDuration(durationMs) || durationMs < SERVER_MIN_DURATION_MS) {
    throw new ConvexError({
      code: "INVALID_DURATION",
      message: "Duração fora dos limites aceitos."
    });
  }

  return calculateScore({ durationMs, streak });
}
