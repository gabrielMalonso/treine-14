import { lazy, Suspense, type PropsWithChildren } from "react";
import { appConfig } from "@/app/config";
import { LocalDataProvider } from "./LocalDataProvider";

const LazyConnectedProviders = lazy(async () => {
  const module = await import("./ConnectedProviders");
  return { default: module.ConnectedProviders };
});

export function AppProviders({ children }: PropsWithChildren) {
  if (appConfig.connected) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-dvh place-items-center bg-[var(--background)] px-4 text-center text-sm text-[var(--text-secondary)]">
            <div>
              <p>Preparando conexão…</p>
              <p className="mt-3 text-xs">Simulação não oficial. Nenhum voto real é registrado.</p>
            </div>
          </div>
        }
      >
        <LazyConnectedProviders>{children}</LazyConnectedProviders>
      </Suspense>
    );
  }

  return <LocalDataProvider>{children}</LocalDataProvider>;
}
