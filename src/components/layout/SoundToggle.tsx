import { useSound } from "@/hooks/useSound";
import { VolumeIcon, VolumeOffIcon } from "@/components/ui/Icons";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound();
  const label = soundEnabled ? "Desativar sons" : "Ativar sons";

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-white/[0.035] text-[var(--text-secondary)] transition-colors hover:bg-white/[0.07] hover:text-[var(--text-primary)]"
      aria-label={label}
      title={label}
      aria-pressed={soundEnabled}
    >
      {soundEnabled ? <VolumeIcon className="size-4.5" /> : <VolumeOffIcon className="size-4.5" />}
    </button>
  );
}
