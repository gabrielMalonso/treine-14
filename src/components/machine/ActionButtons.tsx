type ActionButtonsProps = {
  onCorrect: () => void;
  onConfirm: () => void;
  confirmEnabled: boolean;
  disabled?: boolean;
};

export function ActionButtons({
  onCorrect,
  onConfirm,
  confirmEnabled,
  disabled = false
}: ActionButtonsProps) {
  return (
    <div className="mt-3 grid grid-cols-[0.9fr_1.1fr] gap-2.5">
      <button
        type="button"
        className="action-key correction-key"
        onClick={onCorrect}
        disabled={disabled}
        aria-label="Corrige: limpar número e reiniciar tentativa"
      >
        CORRIGE
      </button>
      <button
        type="button"
        className="action-key confirm-key"
        onClick={onConfirm}
        disabled={disabled || !confirmEnabled}
        aria-label="Confirma: concluir treino com o número 14"
      >
        CONFIRMA
      </button>
    </div>
  );
}
