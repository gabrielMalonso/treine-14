type NumberDisplayProps = {
  digits: string;
};

export function NumberDisplay({ digits }: NumberDisplayProps) {
  const slots = [digits[0] ?? "", digits[1] ?? ""];

  return (
    <div className="flex items-center gap-2" aria-label={`Número digitado: ${digits || "vazio"}`}>
      {slots.map((digit, index) => (
        <div
          key={index}
          className="number-slot"
          aria-label={`Dígito ${index + 1}: ${digit || "vazio"}`}
        >
          {digit || <span className="opacity-0">0</span>}
        </div>
      ))}
    </div>
  );
}
