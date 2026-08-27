import { createContext, useContext } from "react";
import type { GameDataContextValue } from "@/types";

export const GameDataContext = createContext<GameDataContextValue | null>(null);

export function useGameData(): GameDataContextValue {
  const value = useContext(GameDataContext);
  if (value === null) {
    throw new Error("useGameData deve ser usado dentro de AppProviders.");
  }

  return value;
}
