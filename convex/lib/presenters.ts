import type { Doc } from "./dataModel";

export function presentAttempt(attempt: Doc<"attempts">) {
  return {
    id: attempt.clientAttemptId,
    durationMs: attempt.durationMs,
    score: attempt.score,
    createdAt: attempt.createdAt
  };
}

export function presentRankingEntry(
  user: Doc<"users">,
  position: number,
  currentUserId: string | null
) {
  return {
    id: user._id,
    position,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    score: user.score,
    bestTimeMs: user.bestTimeMs ?? null,
    isCurrentPlayer: currentUserId === user._id
  };
}

export function presentStats(user: Doc<"users">) {
  return {
    score: user.score,
    attempts: user.attempts,
    bestTimeMs: user.bestTimeMs ?? null,
    currentStreak: user.currentStreak,
    bestStreak: user.bestStreak,
    lastAttemptAt: user.lastAttemptAt ?? null
  };
}
