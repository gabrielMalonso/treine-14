import { Link } from "react-router-dom";
import { MachinePreview } from "@/components/home/MachinePreview";
import { ArrowRightIcon, TrophyIcon } from "@/components/ui/Icons";

export function HomePage() {
  return (
    <div className="safe-x mx-auto grid w-full max-w-[1240px] items-center gap-10 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:py-16">
      <section className="max-w-[37rem]">
        <p className="mb-4 inline-flex rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/[0.08] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--primary)]">
          Velocidade · precisão · sequência
        </p>
        <h1 className="text-[clamp(3.3rem,10vw,7rem)] font-black leading-[0.82] tracking-[-0.075em]">
          TREINE
          <br />O <span className="text-[var(--primary)]">14</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
          Quanto rápido você consegue digitar 14 e confirmar?
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/play"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-black text-[#11140e] shadow-[0_5px_0_#778d19] transition-[transform,background-color,box-shadow] hover:bg-[var(--primary-strong)] active:translate-y-[3px] active:shadow-[0_2px_0_#778d19]"
          >
            COMEÇAR
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            to="/ranking"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white/[0.035] px-5 text-sm font-extrabold text-[var(--text-primary)] transition-colors hover:bg-white/[0.07]"
          >
            <TrophyIcon className="size-4" />
            Ver ranking
          </Link>
        </div>

        <p className="mt-7 max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
          Funciona com toque, mouse e teclado físico. O cronômetro começa apenas na primeira tecla
          numérica.
        </p>
      </section>

      <section aria-label="Prévia do equipamento virtual">
        <MachinePreview />
      </section>
    </div>
  );
}
