import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "@/app/providers/GameDataContext";

export function AuthCallbackPage() {
  const { auth } = useGameData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading) {
      void navigate("/profile", { replace: true });
    }
  }, [auth.loading, navigate]);

  return (
    <div className="safe-x grid min-h-[70dvh] place-items-center text-center">
      <div>
        <span className="mx-auto block size-8 animate-spin rounded-full border-3 border-white/15 border-t-[var(--primary)] motion-reduce:animate-none" />
        <p className="mt-4 text-sm font-bold">Concluindo entrada…</p>
      </div>
    </div>
  );
}
