import type {
  Attempt,
  CompletedAttempt,
  Leaderboard,
  PlayerProfile,
  PlayerStats,
  RankingEntry
} from "@/types";

export type RemoteAttempt = Omit<Attempt, "synced">;

export type RemoteProfile = {
  identity: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  stats: PlayerStats;
  recentAttempts: RemoteAttempt[];
  rank: number | null;
  rankLabel: string | null;
};

export type RemoteRankingEntry = Omit<RankingEntry, "isCurrentPlayer"> & {
  isCurrentPlayer?: boolean;
};

export type RemoteLeaderboard = {
  entries: RemoteRankingEntry[];
  currentPlayer: RemoteRankingEntry | null;
};

export type RemoteCompletedAttempt = {
  attempt: RemoteAttempt;
  stats: PlayerStats;
  isNewBest: boolean;
};

export function mapRemoteProfile(profile: RemoteProfile): PlayerProfile {
  return {
    ...profile,
    recentAttempts: profile.recentAttempts.map((attempt) => ({
      ...attempt,
      synced: true
    }))
  };
}

function mapRankingEntry(entry: RemoteRankingEntry): RankingEntry {
  return {
    ...entry,
    isCurrentPlayer: entry.isCurrentPlayer ?? false
  };
}

export function mapRemoteLeaderboard(leaderboard: RemoteLeaderboard): Leaderboard {
  return {
    entries: leaderboard.entries.map(mapRankingEntry),
    currentPlayer: leaderboard.currentPlayer
      ? mapRankingEntry({ ...leaderboard.currentPlayer, isCurrentPlayer: true })
      : null
  };
}

export function mapRemoteCompleted(result: RemoteCompletedAttempt): CompletedAttempt {
  return {
    ...result,
    attempt: {
      ...result.attempt,
      synced: true
    }
  };
}
