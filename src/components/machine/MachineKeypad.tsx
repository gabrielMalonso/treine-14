import { BrailleDots } from "./BrailleDots";
import { KeypadButton, PressableKey } from "./KeypadButton";

type MachineKeypadProps = {
  onDigit: (digit: string) => void;
  onBlank: () => void;
  onCorrect: () => void;
  onConfirm: () => void;
  disabled?: boolean;
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;

export function MachineKeypad({
  onDigit,
  onBlank,
  onCorrect,
  onConfirm,
  disabled = false
}: MachineKeypadProps) {
  return (
    <div className="urna-keypad" aria-label="Teclado da urna">
      {digits.map((digit) => (
        <KeypadButton
          key={digit}
          digit={digit}
          disabled={disabled}
          onClick={() => onDigit(digit)}
        />
      ))}

      <PressableKey
        keyId="branco"
        className="action-key blank-key"
        disabled={disabled}
        onClick={onBlank}
        aria-label="Branco: registrar voto em branco neste treino"
      >
        BRANCO
        <BrailleDots pattern="branco" />
      </PressableKey>

      <PressableKey
        keyId="corrige"
        className="action-key correction-key"
        disabled={disabled}
        onClick={onCorrect}
        aria-label="Corrige: limpar número e reiniciar tentativa"
      >
        CORRIGE
        <BrailleDots pattern="corrige" />
      </PressableKey>

      <PressableKey
        keyId="confirma"
        className="action-key confirm-key"
        disabled={disabled}
        onClick={onConfirm}
        aria-label="Confirma: concluir treino com o número 14"
      >
        CONFIRMA
        <BrailleDots pattern="confirma" />
      </PressableKey>
    </div>
  );
}
