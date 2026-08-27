type BrailleDotsProps = {
  pattern: string;
};

const PATTERNS: Record<string, readonly boolean[]> = {
  "1": [true, false, false, false, false, false],
  "2": [true, false, true, false, false, false],
  "3": [true, true, false, false, false, false],
  "4": [true, true, false, true, false, false],
  "5": [true, false, false, true, false, false],
  "6": [true, true, true, false, false, false],
  "7": [true, true, true, true, false, false],
  "8": [true, false, true, true, false, false],
  "9": [false, true, true, false, false, false],
  "0": [false, true, true, true, false, false],
  branco: [true, false, true, false, false, false],
  corrige: [true, true, false, false, false, false],
  confirma: [true, true, false, false, false, false]
};

export function BrailleDots({ pattern }: BrailleDotsProps) {
  const dots = PATTERNS[pattern];

  if (!dots) {
    return null;
  }

  return (
    <span className="braille-cell" aria-hidden="true">
      {dots.map((on, index) => (
        <span key={index} className="braille-dot" data-on={on ? "true" : "false"} />
      ))}
    </span>
  );
}
