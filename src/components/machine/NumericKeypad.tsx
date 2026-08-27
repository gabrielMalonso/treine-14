import { KeypadButton } from "./KeypadButton";

type NumericKeypadProps = {
  onDigit: (digit: string) => void;
  disabled?: boolean;
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export function NumericKeypad({ onDigit, disabled = false }: NumericKeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5" aria-label="Teclado numérico">
      {digits.map((digit) => (
        <KeypadButton
          key={digit}
          digit={digit}
          disabled={disabled}
          onClick={() => onDigit(digit)}
        />
      ))}
      <div aria-hidden="true" />
      <KeypadButton digit="0" disabled={disabled} onClick={() => onDigit("0")} />
      <div aria-hidden="true" />
    </div>
  );
}
