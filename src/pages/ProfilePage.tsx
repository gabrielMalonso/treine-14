import { useGameData } from "@/app/providers/GameDataContext";
import { RecentAttempts } from "@/components/profile/RecentAttempts";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

export function ProfilePage() {
  const { profile, mode, auth, signIn, signOut } = useGameData();

  return (
    <div className="safe-x mx-auto w-full max-w-[900px] py-8 sm:py-12">
      <Card className="overflow-hidden">
        <div className="border-b border-[var(--border)] bg-white/[0.02] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar
                name={profile.identity.name}
                avatarUrl={profile.identity.avatarUrl}
                size="lg"
              />
              <div className="min-w-0">
                <StatusPill>
                  {mode === "demo"
                    ? "Progresso neste dispositivo"
                    : auth.authenticated
                      ? "Conta sincronizada"
                      : "Modo visitante"}
                </StatusPill>
                <h1 className="mt-2 truncate text-2xl font-black tracking-tight sm:text-3xl">
                  {profile.identity.name}
                </h1>
              </div>
            </div>

            {auth.available ? (
              <Button
                variant={auth.authenticated ? "secondary" : "primary"}
                disabled={auth.loading}
                onClick={() => {
                  void (auth.authenticated ? signOut() : signIn());
                }}
              >
                {auth.loading
                  ? "Carregando…"
                  : auth.authenticated
                    ? "Sair"
                    : "Continuar com Google"}
              </Button>
            ) : null}
          </div>

          {auth.available && auth.authenticated ? (
            <p className="mt-4 rounded-xl border border-[var(--correction)]/20 bg-[var(--correction)]/[0.08] px-3 py-2 text-xs leading-relaxed text-[#e8d5a9]">
              Treinos anônimos anteriores permanecem somente neste dispositivo. Eles não são
              importados como pontos para evitar fraude.
            </p>
          ) : null}
        </div>

        <div className="space-y-7 p-5 sm:p-7">
          <ProfileStats stats={profile.stats} rankLabel={profile.rankLabel} />
          <RecentAttempts attempts={profile.recentAttempts} />
        </div>
      </Card>
    </div>
  );
}
