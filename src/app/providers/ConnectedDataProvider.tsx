import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useWorkOSAuthLike, normalizeWorkOSUser } from "./workosAdapter";
import { GameDataContext } from "./GameDataContext";
import { createBrowserLocalRepository } from "@/repositories/local/localGameRepository";
import {
  currentUserRef,
  ensureCurrentUserRef,
  leaderboardRef,
  recordAttemptRef
} from "@/repositories/convex/functionReferences";
import { mapRemoteLeaderboard, mapRemoteProfile } from "@/repositories/convex/remoteTypes";

export function ConnectedDataProvider({ children }: PropsWithChildren) {
  const [localRepository] = useState(createBrowserLocalRepository);
  const [localSnapshot, setLocalSnapshot] = useState(() => localRepository.getSnapshot());

  const workos = useWorkOSAuthLike();
  const {
    user: workosUser,
    isLoading: workosIsLoading,
    signIn: workosSignIn,
    signOut: workosSignOut
  } = workos;
  const convexAuth = useConvexAuth();
  const authenticated = Boolean(workosUser) && convexAuth.isAuthenticated;

  const ensureCurrentUser = useMutation(ensureCurrentUserRef);
  const recordRemoteAttempt = useMutation(recordAttemptRef);
  const remoteProfile = useQuery(currentUserRef, authenticated ? {} : "skip");
  const remoteLeaderboard = useQuery(leaderboardRef, { limit: 10 });

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    void ensureCurrentUser({}).catch(() => {
      // O fallback local continua disponível mesmo se a sincronização falhar.
    });
  }, [authenticated, ensureCurrentUser]);

  const refreshLocal = useCallback(() => {
    const next = localRepository.getSnapshot();
    setLocalSnapshot(next);
    return next;
  }, [localRepository]);

  const refresh = useCallback(() => {
    refreshLocal();
    return Promise.resolve();
  }, [refreshLocal]);

  const recordAttempt = useCallback(
    (durationMs: number) => {
      const localResult = localRepository.recordAttempt(durationMs);
      refreshLocal();

      if (authenticated) {
        void recordRemoteAttempt({
          durationMs,
          clientAttemptId: localResult.attempt.id
        })
          .then(() => {
            localRepository.markAttemptSynced(localResult.attempt.id);
            refreshLocal();
          })
          .catch(() => {
            // A tentativa permanece local e pode ser repetida sem perder a rodada.
          });
      }

      return Promise.resolve(localResult);
    },
    [authenticated, localRepository, recordRemoteAttempt, refreshLocal]
  );

  const profile =
    authenticated && remoteProfile ? mapRemoteProfile(remoteProfile) : localSnapshot.profile;

  const leaderboard =
    remoteLeaderboard && remoteLeaderboard.entries.length > 0
      ? mapRemoteLeaderboard(remoteLeaderboard)
      : localSnapshot.leaderboard;

  const normalizedUser = normalizeWorkOSUser(workosUser);

  const value = useMemo(
    () => ({
      ready: remoteLeaderboard !== undefined,
      mode: "connected" as const,
      profile,
      leaderboard,
      settings: localSnapshot.settings,
      auth: {
        available: true,
        authenticated,
        loading: Boolean(workosIsLoading) || convexAuth.isLoading,
        user: normalizedUser
      },
      recordAttempt,
      setSoundEnabled: (enabled: boolean) => {
        localRepository.setSoundEnabled(enabled);
        refreshLocal();
      },
      refresh,
      signIn: () => Promise.resolve(workosSignIn?.()),
      signOut: () => Promise.resolve(workosSignOut?.())
    }),
    [
      authenticated,
      convexAuth.isLoading,
      leaderboard,
      localRepository,
      localSnapshot.settings,
      normalizedUser,
      profile,
      recordAttempt,
      refresh,
      refreshLocal,
      remoteLeaderboard,
      workosIsLoading,
      workosSignIn,
      workosSignOut
    ]
  );

  return <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>;
}
