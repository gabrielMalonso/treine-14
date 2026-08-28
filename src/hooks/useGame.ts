import { useCallback, useEffect, useRef, useState } from "react";
import { useGameData } from "@/app/providers/GameDataContext";
import { shareResult } from "@/lib/sharing";
import { performanceClock } from "@/lib/timing";
import { createInitialGameSession, gameReducer, type GameEvent } from "@/services/game/gameMachine";
import { useKeyboardControls } from "./useKeyboardControls";
import { useSound } from "./useSound";

export function useGame() {
  const { recordAttempt } = useGameData();
  const { playConfirm, playCorrect, playKey, playRecord } = useSound();

  const [session, setSession] = useState(createInitialGameSession);
  const sessionRef = useRef(session);
  const startedAtRef = useRef<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const submittingRef = useRef(false);
  const recordSoundTimeoutRef = useRef<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blankVote, setBlankVote] = useState(false);

  const transition = useCallback((event: GameEvent) => {
    const next = gameReducer(sessionRef.current, event);
    sessionRef.current = next;
    setSession(next);
    return next;
  }, []);

  const pressDigit = useCallback(
    (digit: string) => {
      const current = sessionRef.current;
      if (submittingRef.current || current.status === "completed" || current.digits.length >= 2) {
        return;
      }

      setBlankVote(false);

      if (current.digits.length === 0) {
        const now = performanceClock.now();
        startedAtRef.current = now;
        setStartedAt(now);
      }

      setError(null);
      transition({ type: "DIGIT", digit });
      playKey();
    },
    [playKey, transition]
  );

  const resetInput = useCallback(
    (sound: "correct" | "key") => {
      if (submittingRef.current || sessionRef.current.status === "completed") {
        return false;
      }

      startedAtRef.current = null;
      setStartedAt(null);
      setError(null);
      transition({ type: "CORRECT" });

      if (sound === "correct") {
        playCorrect();
      } else {
        playKey();
      }

      return true;
    },
    [playCorrect, playKey, transition]
  );

  const correct = useCallback(() => {
    setBlankVote(false);
    resetInput("correct");
  }, [resetInput]);

  const blank = useCallback(() => {
    if (resetInput("key")) {
      setBlankVote(true);
    }
  }, [resetInput]);

  const confirm = useCallback(async () => {
    const current = sessionRef.current;
    const start = startedAtRef.current;

    if (
      submittingRef.current ||
      current.status !== "candidate" ||
      current.digits !== "14" ||
      start === null
    ) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const durationMs = Math.max(1, performanceClock.now() - start);
      const result = await recordAttempt(durationMs);
      transition({ type: "COMPLETE", result });
      playConfirm();

      if (result.isNewBest && result.stats.attempts > 1) {
        recordSoundTimeoutRef.current = window.setTimeout(playRecord, 1_200);
      }
    } catch {
      setError("Não foi possível registrar agora. Use CORRIGE e tente novamente.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [playConfirm, playRecord, recordAttempt, transition]);

  const newAttempt = useCallback(() => {
    if (recordSoundTimeoutRef.current !== null) {
      window.clearTimeout(recordSoundTimeoutRef.current);
      recordSoundTimeoutRef.current = null;
    }

    submittingRef.current = false;
    setIsSubmitting(false);
    startedAtRef.current = null;
    setStartedAt(null);
    setError(null);
    setBlankVote(false);
    transition({ type: "NEW_ATTEMPT" });
  }, [transition]);

  useEffect(
    () => () => {
      if (recordSoundTimeoutRef.current !== null) {
        window.clearTimeout(recordSoundTimeoutRef.current);
      }
    },
    []
  );

  const share = useCallback(async () => {
    const durationMs = sessionRef.current.completed?.attempt.durationMs;
    if (durationMs === undefined) {
      return "failed" as const;
    }

    return shareResult(durationMs);
  }, []);

  useKeyboardControls({
    onDigit: pressDigit,
    onCorrect: correct,
    onConfirm: () => {
      void confirm();
    },
    disabled: session.status === "completed" || isSubmitting
  });

  return {
    session,
    startedAt,
    isSubmitting,
    error,
    blankVote,
    pressDigit,
    correct,
    blank,
    confirm,
    newAttempt,
    share
  };
}
