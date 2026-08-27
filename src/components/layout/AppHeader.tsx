import { NavLink } from "react-router-dom";
import { useGameData } from "@/app/providers/GameDataContext";
import { cn } from "@/lib/cn";
import { PlayIcon, TrophyIcon, UserIcon } from "@/components/ui/Icons";
import { SoundToggle } from "./SoundToggle";

const navItems = [
  { to: "/play", label: "Jogar", icon: PlayIcon },
  { to: "/ranking", label: "Ranking", icon: TrophyIcon },
  { to: "/profile", label: "Perfil", icon: UserIcon }
] as const;

export function AppHeader() {
  const { auth, signIn, signOut } = useGameData();

  return (
    <header className="site-header safe-x sticky top-0 z-40 flex items-center border-b border-white/7 bg-[var(--background)]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-2 py-2">
        <NavLink
          to="/"
          className="flex min-h-11 items-center gap-2 rounded-xl pr-2 font-black tracking-tight"
          aria-label="Treine o 14 — início"
        >
          <span className="grid size-9 place-items-center rounded-[0.7rem] bg-[var(--primary)] text-sm font-black text-[#11140e] shadow-[0_3px_0_#778d19]">
            14
          </span>
          <span className="hidden text-sm sm:inline">TREINE O 14</span>
        </NavLink>

        <nav className="flex items-center gap-0.5" aria-label="Navegação principal">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  "flex min-h-10 items-center gap-1.5 rounded-xl px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                  isActive
                    ? "bg-white/8 text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                )
              }
            >
              <Icon className="size-4" />
              <span className="hidden min-[470px]:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {auth.available && !auth.loading ? (
            <button
              type="button"
              onClick={() => {
                void (auth.authenticated ? signOut() : signIn());
              }}
              className="hidden min-h-10 rounded-xl border border-[var(--border)] px-3 text-xs font-extrabold text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)] sm:block"
            >
              {auth.authenticated ? "Sair" : "Entrar"}
            </button>
          ) : null}
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
