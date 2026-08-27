import { LOCAL_HISTORY_LIMIT } from "@shared/game";
import type { AppSettings, Attempt, PlayerIdentity, PlayerStats } from "@/types";

export const STORAGE_KEY = "treine-o-14:player:v1";
export const STORAGE_VERSION = 1 as const;

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type PersistedPlayerState = {
  version: typeof STORAGE_VERSION;
  identity: PlayerIdentity;
  stats: PlayerStats;
  attempts: Attempt[];
  settings: AppSettings;
};

export const defaultStats = (): PlayerStats => ({
  score: 0,
  attempts: 0,
  bestTimeMs: null,
  currentStreak: 0,
  bestStreak: 0,
  lastAttemptAt: null
});

export const defaultPersistedState = (): PersistedPlayerState => ({
  version: STORAGE_VERSION,
  identity: {
    id: "local-player",
    name: "Você",
    avatarUrl: null
  },
  stats: defaultStats(),
  attempts: [],
  settings: {
    soundEnabled: true
  }
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isNullableFiniteNonNegative(value: unknown): value is number | null {
  return value === null || isFiniteNonNegative(value);
}

function parseIdentity(value: unknown): PlayerIdentity | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, name, avatarUrl } = value;
  if (
    typeof id !== "string" ||
    id.length === 0 ||
    typeof name !== "string" ||
    name.trim().length === 0 ||
    !(avatarUrl === null || typeof avatarUrl === "string")
  ) {
    return null;
  }

  return {
    id,
    name: name.trim().slice(0, 80),
    avatarUrl
  };
}

function parseStats(value: unknown): PlayerStats | null {
  if (!isRecord(value)) {
    return null;
  }

  const { score, attempts, bestTimeMs, currentStreak, bestStreak, lastAttemptAt } = value;

  if (
    !isFiniteNonNegative(score) ||
    !Number.isInteger(score) ||
    !isFiniteNonNegative(attempts) ||
    !Number.isInteger(attempts) ||
    !isNullableFiniteNonNegative(bestTimeMs) ||
    !isFiniteNonNegative(currentStreak) ||
    !Number.isInteger(currentStreak) ||
    !isFiniteNonNegative(bestStreak) ||
    !Number.isInteger(bestStreak) ||
    !isNullableFiniteNonNegative(lastAttemptAt)
  ) {
    return null;
  }

  return {
    score,
    attempts,
    bestTimeMs,
    currentStreak,
    bestStreak,
    lastAttemptAt
  };
}

function parseAttempt(value: unknown): Attempt | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, durationMs, score, createdAt, synced } = value;
  if (
    typeof id !== "string" ||
    id.length === 0 ||
    !isFiniteNonNegative(durationMs) ||
    durationMs === 0 ||
    !isFiniteNonNegative(score) ||
    !Number.isInteger(score) ||
    !isFiniteNonNegative(createdAt) ||
    typeof synced !== "boolean"
  ) {
    return null;
  }

  return {
    id,
    durationMs,
    score,
    createdAt,
    synced
  };
}

function parseSettings(value: unknown): AppSettings | null {
  if (!isRecord(value) || typeof value.soundEnabled !== "boolean") {
    return null;
  }

  return {
    soundEnabled: value.soundEnabled
  };
}

export function decodeStoredState(raw: string | null): PersistedPlayerState {
  if (raw === null) {
    return defaultPersistedState();
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) {
      return defaultPersistedState();
    }

    const identity = parseIdentity(parsed.identity);
    const stats = parseStats(parsed.stats);
    const settings = parseSettings(parsed.settings);
    const attemptsRaw = parsed.attempts;

    if (identity === null || stats === null || settings === null || !Array.isArray(attemptsRaw)) {
      return defaultPersistedState();
    }

    const attempts = attemptsRaw
      .map(parseAttempt)
      .filter((attempt): attempt is Attempt => attempt !== null)
      .slice(0, LOCAL_HISTORY_LIMIT);

    return {
      version: STORAGE_VERSION,
      identity,
      stats,
      attempts,
      settings
    };
  } catch {
    return defaultPersistedState();
  }
}

export function encodeStoredState(state: PersistedPlayerState): string {
  return JSON.stringify(state);
}
