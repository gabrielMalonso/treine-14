type NumberDisplayProps = {
  digits: string;
};

export function NumberDisplay({ digits }: NumberDisplayProps) {
  const slots = [digits[0] ?? "", digits[1] ?? ""];

  return (
    <div
      className="flex items-center gap-[0.35rem]"
      aria-label={`Número digitado: ${digits || "vazio"}`}
    >
      {slots.map((digit, index) => (
        <div
          key={index}
          className="number-slot"
          aria-label={`Dígito ${index + 1}: ${digit || "vazio"}`}
        >
          {digit || "\u00a0"}
        </div>
      ))}
    </div>
  );
}
