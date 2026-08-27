import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { createBrowserLocalRepository } from "@/repositories/local/localGameRepository";
import { GameDataContext } from "./GameDataContext";

export function LocalDataProvider({ children }: PropsWithChildren) {
  const [repository] = useState(createBrowserLocalRepository);
  const [snapshot, setSnapshot] = useState(() => repository.getSnapshot());

  const refresh = useCallback(() => {
    setSnapshot(repository.getSnapshot());
    return Promise.resolve();
  }, [repository]);

  useEffect(() => {
    const handleStorage = () => {
      setSnapshot(repository.getSnapshot());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [repository]);

  const value = useMemo(
    () => ({
      ready: true,
      mode: "demo" as const,
      profile: snapshot.profile,
      leaderboard: snapshot.leaderboard,
      settings: snapshot.settings,
      auth: {
        available: false,
        authenticated: false,
        loading: false,
        user: snapshot.profile.identity
      },
      recordAttempt: (durationMs: number) => {
        const result = repository.recordAttempt(durationMs);
        setSnapshot(repository.getSnapshot());
        return Promise.resolve(result);
      },
      setSoundEnabled: (enabled: boolean) => {
        repository.setSoundEnabled(enabled);
        setSnapshot(repository.getSnapshot());
      },
      refresh,
      signIn: () => Promise.resolve(),
      signOut: () => Promise.resolve()
    }),
    [refresh, repository, snapshot]
  );

  return <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>;
}
