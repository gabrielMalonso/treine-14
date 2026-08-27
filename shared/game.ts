export const TARGET_NUMBER = "14";
export const LOCAL_HISTORY_LIMIT = 100;
export const STREAK_WINDOW_MS = 24 * 60 * 60 * 1_000;
export const SERVER_MIN_DURATION_MS = 350;
export const SERVER_SUBMISSION_COOLDOWN_MS = 300;

export function nextStreak(
  currentStreak: number,
  lastAttemptAt: number | null,
  now: number
): number {
  if (lastAttemptAt === null || now - lastAttemptAt > STREAK_WINDOW_MS || now < lastAttemptAt) {
    return 1;
  }

  return Math.max(0, Math.floor(currentStreak)) + 1;
}
