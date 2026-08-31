import type { ReactNode } from "react";
import futuroGlorioso from "@/assets/futuro-glorioso.jpg";

type VictoryStageProps = {
  children: ReactNode;
};

export function VictoryStage({ children }: VictoryStageProps) {
  return (
    <div className="game-over-screen victory-screen">
      <img src={futuroGlorioso} alt="" className="game-over-bg victory-bg" draggable={false} />
      <div className="game-over-scrim victory-scrim" />
      {children}
    </div>
  );
}
