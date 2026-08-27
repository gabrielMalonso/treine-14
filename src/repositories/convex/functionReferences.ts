import { makeFunctionReference, type FunctionReference } from "convex/server";
import type { RemoteCompletedAttempt, RemoteLeaderboard, RemoteProfile } from "./remoteTypes";

type EmptyArgs = Record<string, never>;

export const ensureCurrentUserRef = makeFunctionReference(
  "users:ensureCurrent"
) as unknown as FunctionReference<"mutation", "public", EmptyArgs, RemoteProfile>;

export const currentUserRef = makeFunctionReference("users:me") as unknown as FunctionReference<
  "query",
  "public",
  EmptyArgs,
  RemoteProfile | null
>;

export const leaderboardRef = makeFunctionReference(
  "leaderboard:get"
) as unknown as FunctionReference<"query", "public", { limit?: number }, RemoteLeaderboard>;

export const recordAttemptRef = makeFunctionReference(
  "attempts:record"
) as unknown as FunctionReference<
  "mutation",
  "public",
  { durationMs: number; clientAttemptId: string },
  RemoteCompletedAttempt
>;
