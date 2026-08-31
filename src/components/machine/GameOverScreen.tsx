import brasilOnFire from "@/assets/brasil-on-fire.jpg";

const COLLAPSE_LINES = [
  "O BRASIL QUEBROU.",
  "SERVIDOR NACIONAL OFFLINE.",
  "VOCÊ DIGITOU O FIM.",
  "REINSTALE O PAÍS E TENTE O 14.",
  "INSERT 14 TO CONTINUE"
] as const;

type GameOverScreenProps = {
  digits: string;
};

function collapseLineFor(digits: string) {
  const index = Number.parseInt(digits, 10);
  if (Number.isNaN(index)) {
    return COLLAPSE_LINES[0];
  }

  return COLLAPSE_LINES[index % COLLAPSE_LINES.length];
}

export function GameOverScreen({ digits }: GameOverScreenProps) {
  const line = collapseLineFor(digits);

  return (
    <div className="game-over-screen">
      <img src={brasilOnFire} alt="" className="game-over-bg" draggable={false} />
      <div className="game-over-scrim" />

      <div className="game-over-body" role="alert">
        <p className="game-over-title">GAME OVER</p>
        <p className="game-over-line">{line}</p>
        <p className="game-over-stats">NÚMERO: {digits} · PONTOS: 0 · PAÍS: INDISPONÍVEL</p>
      </div>

      <p className="game-over-hint">APERTE CORRIGE PARA RESTAURAR O BRASIL</p>
    </div>
  );
}
