import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatusPillProps = {
  children: ReactNode;
  className?: string;
};

export function StatusPill({ children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]",
        className
      )}
    >
      {children}
    </span>
  );
}
