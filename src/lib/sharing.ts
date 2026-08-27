import { formatDuration } from "./formatting";

export function buildShareText(durationMs: number): string {
  return `Fiz ${formatDuration(durationMs)} no Treine o 14. Você consegue fazer mais rápido?`;
}

export async function shareResult(durationMs: number): Promise<"shared" | "copied" | "failed"> {
  const text = buildShareText(durationMs);

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Treine o 14",
        text
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "failed";
      }
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
