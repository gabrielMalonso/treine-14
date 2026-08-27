import { useState, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { BrailleDots } from "./BrailleDots";

type PressableKeyProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  keyId: string;
};

export function PressableKey({
  keyId,
  className,
  children,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: PressableKeyProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={cn(className)}
      data-key={keyId}
      data-pressed={pressed ? "true" : "false"}
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
      {children}
    </button>
  );
}

type KeypadButtonProps = Omit<PressableKeyProps, "keyId" | "children"> & {
  digit: string;
};

export function KeypadButton({ digit, className, ...props }: KeypadButtonProps) {
  return (
    <PressableKey
      keyId={digit}
      className={cn("keypad-key", className)}
      aria-label={`Tecla ${digit}`}
      {...props}
    >
      <span>{digit}</span>
      <BrailleDots pattern={digit} />
    </PressableKey>
  );
}
