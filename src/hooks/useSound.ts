import { useCallback } from "react";
import { useGameData } from "@/app/providers/GameDataContext";
import { soundEngine } from "@/services/sound/soundEngine";

export function useSound() {
  const { settings, setSoundEnabled } = useGameData();

  const play = useCallback(
    (sound: () => Promise<void>) => {
      if (settings.soundEnabled) {
        void sound();
      }
    },
    [settings.soundEnabled]
  );

  return {
    soundEnabled: settings.soundEnabled,
    toggleSound: () => setSoundEnabled(!settings.soundEnabled),
    playKey: () => play(soundEngine.key),
    playCorrect: () => play(soundEngine.correct),
    playConfirm: () => play(soundEngine.confirm),
    playRecord: () => play(soundEngine.record)
  };
}
