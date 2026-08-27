const previewDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;

export function MachinePreview() {
  return (
    <div
      className="machine-frame relative mx-auto w-full max-w-[36rem] rotate-[-1deg] p-3 sm:p-4"
      aria-hidden="true"
    >
      <div className="grid grid-cols-[1.3fr_0.8fr] gap-3 sm:gap-4">
        <div className="machine-display min-h-[15.5rem] !flex-none">
          <div className="urna-lcd">
            <div className="urna-lcd-header">
              <p className="urna-lcd-kicker">Seu voto para</p>
              <p className="urna-lcd-banner">Treino</p>
              <span />
            </div>
            <p className="urna-lcd-office !mb-3 !text-xl">Presidente</p>
            <div className="urna-fields">
              <span className="urna-field-label">Número:</span>
              <span className="flex items-center gap-1.5">
                <span className="number-slot !h-8 !w-8 !text-lg">1</span>
                <span className="number-slot !h-8 !w-8 !text-lg">4</span>
              </span>
              <span className="urna-field-label">Nome:</span>
              <span className="urna-field-value !text-sm">Renan Santos</span>
              <span className="urna-field-label">Partido:</span>
              <span className="urna-field-value !text-sm">MISSÃO</span>
            </div>
            <div className="urna-lcd-footer !pt-3 !text-[0.62rem]">
              <p>Aperte a tecla:</p>
              <p>CONFIRMA para CONFIRMAR este voto</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div
            className="urna-keypad"
            style={{
              gridTemplateRows: "repeat(4, minmax(1.55rem, 1fr))",
              gap: "0.28rem"
            }}
          >
            {previewDigits.map((digit) => (
              <span
                key={digit}
                data-key={digit}
                className="keypad-key pointer-events-none !min-h-0 text-sm"
              >
                {digit}
              </span>
            ))}
            <span
              data-key="branco"
              className="action-key blank-key pointer-events-none !min-h-0 text-[0.42rem]"
            >
              BRANCO
            </span>
            <span
              data-key="corrige"
              className="action-key correction-key pointer-events-none !min-h-0 text-[0.42rem]"
            >
              CORRIGE
            </span>
            <span
              data-key="confirma"
              className="action-key confirm-key pointer-events-none !min-h-0 text-[0.48rem]"
            >
              CONFIRMA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
