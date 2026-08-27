import { useEffect } from "react";

type KeyboardControls = {
  onDigit: (digit: string) => void;
  onCorrect: () => void;
  onConfirm: () => void;
  disabled?: boolean;
};

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'a, button, input, textarea, select, summary, [contenteditable="true"], [role="button"]'
    )
  );
}

export function useKeyboardControls({
  onDigit,
  onCorrect,
  onConfirm,
  disabled = false
}: KeyboardControls): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (/^\d$/.test(event.key) && !isTextEntryTarget(event.target)) {
        event.preventDefault();
        onDigit(event.key);
        return;
      }

      if (
        (event.key === "Backspace" || event.key === "Delete" || event.key === "Escape") &&
        !isTextEntryTarget(event.target)
      ) {
        event.preventDefault();
        onCorrect();
        return;
      }

      if (
        event.key === "Enter" &&
        !isTextEntryTarget(event.target) &&
        !isInteractiveTarget(event.target)
      ) {
        event.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onConfirm, onCorrect, onDigit]);
}
