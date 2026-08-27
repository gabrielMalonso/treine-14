import { Link } from "react-router-dom";
import { HomeIcon } from "@/components/ui/Icons";

export function NotFoundPage() {
  return (
    <div className="safe-x grid min-h-[70dvh] place-items-center py-12 text-center">
      <div>
        <p className="font-mono text-7xl font-black text-[var(--primary)]">404</p>
        <h1 className="mt-3 text-2xl font-black">Esta tecla não existe.</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">A rota saiu da sequência.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-black text-[#11140e]"
        >
          <HomeIcon className="size-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
