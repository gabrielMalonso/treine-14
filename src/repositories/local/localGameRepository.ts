import { LOCAL_HISTORY_LIMIT, nextStreak } from "@shared/game";
import { calculateScore, isAcceptableDuration } from "@shared/scoring";
import { createId } from "@/lib/ids";
import { mockRankingEntries } from "@/mocks/ranking";
import type { GameRepository, RepositorySnapshot } from "@/repositories/types";
import type {
  AppSettings,
  Attempt,
  CompletedAttempt,
  Leaderboard,
  PlayerStats,
  RankingEntry
} from "@/types";
import {
  decodeStoredState,
  defaultPersistedState,
  encodeStoredState,
  STORAGE_KEY,
  type PersistedPlayerState,
  type StorageLike
} from "./storageCodec";

type LocalRepositoryOptions = {
  now?: () => number;
  createAttemptId?: () => string;
};

export class LocalGameRepository implements GameRepository {
  private readonly now: () => number;
  private readonly createAttemptId: () => string;
  private memoryState: PersistedPlayerState | null = null;
  private storageUnavailable = false;

  public constructor(
    private readonly storage: StorageLike,
    options: LocalRepositoryOptions = {}
  ) {
    this.now = options.now ?? Date.now;
    this.createAttemptId = options.createAttemptId ?? (() => createId());
  }

  public getSnapshot(): RepositorySnapshot {
    const state = this.read();
    const leaderboard = this.buildLeaderboard(state);
    const currentPlayer = leaderboard.currentPlayer;

    return {
      profile: {
        identity: state.identity,
        stats: state.stats,
        recentAttempts: state.attempts,
        rank: currentPlayer?.position ?? null,
        rankLabel: currentPlayer ? String(currentPlayer.position) : null
      },
      leaderboard,
      settings: state.settings
    };
  }

  public recordAttempt(durationMs: number): CompletedAttempt {
    if (!isAcceptableDuration(durationMs)) {
      throw new RangeError("Duração da tentativa fora dos limites aceitos.");
    }

    const state = this.read();
    const createdAt = this.now();
    const currentStreak = nextStreak(
      state.stats.currentStreak,
      state.stats.lastAttemptAt,
      createdAt
    );
    const score = calculateScore({ durationMs, streak: currentStreak });
    const isNewBest = state.stats.bestTimeMs === null || durationMs < state.stats.bestTimeMs;

    const attempt: Attempt = {
      id: this.createAttemptId(),
      durationMs,
      score,
      createdAt,
      synced: false
    };

    const stats: PlayerStats = {
      score: state.stats.score + score,
      attempts: state.stats.attempts + 1,
      bestTimeMs: isNewBest ? durationMs : state.stats.bestTimeMs,
      currentStreak,
      bestStreak: Math.max(state.stats.bestStreak, currentStreak),
      lastAttemptAt: createdAt
    };

    this.write({
      ...state,
      stats,
      attempts: [attempt, ...state.attempts].slice(0, LOCAL_HISTORY_LIMIT)
    });

    return {
      attempt,
      stats,
      isNewBest
    };
  }

  public setSoundEnabled(enabled: boolean): AppSettings {
    const state = this.read();
    const settings = { soundEnabled: enabled };
    this.write({ ...state, settings });
    return settings;
  }

  public resetProgress(): RepositorySnapshot {
    const current = this.read();
    const reset = defaultPersistedState();
    this.write({
      ...reset,
      identity: current.identity,
      settings: current.settings
    });
    return this.getSnapshot();
  }

  public markAttemptSynced(attemptId: string): void {
    const state = this.read();
    const attempts = state.attempts.map((attempt) =>
      attempt.id === attemptId ? { ...attempt, synced: true } : attempt
    );
    this.write({ ...state, attempts });
  }

  private read(): PersistedPlayerState {
    let raw: string | null;

    try {
      raw = this.storage.getItem(STORAGE_KEY);
    } catch {
      this.storageUnavailable = true;
      return this.memoryState ?? defaultPersistedState();
    }

    if (raw === null) {
      if (this.storageUnavailable && this.memoryState) {
        return this.memoryState;
      }

      const fallback = defaultPersistedState();
      this.memoryState = fallback;
      return fallback;
    }

    try {
      JSON.parse(raw);
    } catch {
      try {
        this.storage.removeItem(STORAGE_KEY);
      } catch {
        // O armazenamento pode estar indisponível; o fallback em memória segue ativo.
      }

      const fallback = defaultPersistedState();
      this.memoryState = fallback;
      return fallback;
    }

    const decoded = decodeStoredState(raw);
    this.memoryState = decoded;
    return decoded;
  }

  private write(state: PersistedPlayerState): void {
    this.memoryState = state;

    try {
      this.storage.setItem(STORAGE_KEY, encodeStoredState(state));
      this.storageUnavailable = false;
    } catch {
      this.storageUnavailable = true;
      // Quota ou modo privado usam o fallback em memória durante a sessão.
    }
  }

  private buildLeaderboard(state: PersistedPlayerState): Leaderboard {
    const currentBase = {
      id: state.identity.id,
      name: state.identity.name,
      avatarUrl: state.identity.avatarUrl,
      score: state.stats.score,
      bestTimeMs: state.stats.bestTimeMs,
      isCurrentPlayer: true
    };

    const all = [
      ...mockRankingEntries.map((entry) => ({
        ...entry,
        isCurrentPlayer: false
      })),
      currentBase
    ].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const aTime = a.bestTimeMs ?? Number.POSITIVE_INFINITY;
      const bTime = b.bestTimeMs ?? Number.POSITIVE_INFINITY;
      return aTime - bTime;
    });

    const ranked: RankingEntry[] = all.map((entry, index) => ({
      ...entry,
      position: index + 1
    }));

    const currentPlayer = ranked.find((entry) => entry.isCurrentPlayer) ?? null;

    return {
      entries: ranked.slice(0, 10),
      currentPlayer
    };
  }
}

export function createBrowserLocalRepository(): LocalGameRepository {
  return new LocalGameRepository(window.localStorage);
}
