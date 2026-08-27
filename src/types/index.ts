export type GameStatus = "idle" | "typing" | "candidate" | "completed";

export type Attempt = {
  id: string;
  durationMs: number;
  score: number;
  createdAt: number;
  synced: boolean;
};

export type PlayerStats = {
  score: number;
  attempts: number;
  bestTimeMs: number | null;
  currentStreak: number;
  bestStreak: number;
  lastAttemptAt: number | null;
};

export type AppSettings = {
  soundEnabled: boolean;
};

export type PlayerIdentity = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type PlayerProfile = {
  identity: PlayerIdentity;
  stats: PlayerStats;
  recentAttempts: Attempt[];
  rank: number | null;
  rankLabel: string | null;
};

export type RankingEntry = {
  id: string;
  position: number;
  name: string;
  avatarUrl: string | null;
  score: number;
  bestTimeMs: number | null;
  isCurrentPlayer: boolean;
};

export type Leaderboard = {
  entries: RankingEntry[];
  currentPlayer: RankingEntry | null;
};

export type CompletedAttempt = {
  attempt: Attempt;
  stats: PlayerStats;
  isNewBest: boolean;
};

export type GameSession = {
  status: GameStatus;
  digits: string;
  completed: CompletedAttempt | null;
};

export type DataMode = "demo" | "connected";

export type AuthState = {
  available: boolean;
  authenticated: boolean;
  loading: boolean;
  user: PlayerIdentity | null;
};

export type GameDataContextValue = {
  ready: boolean;
  mode: DataMode;
  profile: PlayerProfile;
  leaderboard: Leaderboard;
  settings: AppSettings;
  auth: AuthState;
  recordAttempt: (durationMs: number) => Promise<CompletedAttempt>;
  setSoundEnabled: (enabled: boolean) => void;
  refresh: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};
