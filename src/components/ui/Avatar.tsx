import { getInitials } from "@/lib/formatting";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  avatarUrl: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-20 text-xl"
};

export function Avatar({ name, avatarUrl, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-[var(--surface-raised)] font-black text-[var(--primary)]",
        sizes[size],
        className
      )}
      aria-label={`Avatar de ${name}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}
