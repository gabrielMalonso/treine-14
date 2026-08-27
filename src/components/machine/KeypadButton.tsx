import { useState, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type KeypadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  digit: string;
};

export function KeypadButton({
  digit,
  className,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: KeypadButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={cn("keypad-key", className)}
      data-pressed={pressed ? "true" : "false"}
      aria-label={`Tecla ${digit}`}
      onPointerDown={(event) => {
        setPressed(true);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setPressed(false);
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        setPressed(false);
        onPointerCancel?.(event);
      }}
      onPointerLeave={(event) => {
        setPressed(false);
        onPointerLeave?.(event);
      }}
      {...props}
    >
      {digit}
    </button>
  );
}
