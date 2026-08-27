import type { AppSettings, CompletedAttempt, Leaderboard, PlayerProfile } from "@/types";

export type RepositorySnapshot = {
  profile: PlayerProfile;
  leaderboard: Leaderboard;
  settings: AppSettings;
};

export interface GameRepository {
  getSnapshot(): RepositorySnapshot;
  recordAttempt(durationMs: number): CompletedAttempt;
  setSoundEnabled(enabled: boolean): AppSettings;
  resetProgress(): RepositorySnapshot;
}
