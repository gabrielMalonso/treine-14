import { TARGET_NUMBER } from "@shared/game";
import type { CompletedAttempt, GameSession } from "@/types";

export type GameEvent =
  | { type: "DIGIT"; digit: string }
  | { type: "CORRECT" }
  | { type: "COMPLETE"; result: CompletedAttempt }
  | { type: "NEW_ATTEMPT" };

export function createInitialGameSession(): GameSession {
  return {
    status: "idle",
    digits: "",
    completed: null
  };
}

export function gameReducer(state: GameSession, event: GameEvent): GameSession {
  switch (event.type) {
    case "DIGIT": {
      if (
        state.status === "completed" ||
        state.digits.length >= TARGET_NUMBER.length ||
        !/^\d$/.test(event.digit)
      ) {
        return state;
      }

      const digits = `${state.digits}${event.digit}`;
      return {
        status: digits === TARGET_NUMBER ? "candidate" : "typing",
        digits,
        completed: null
      };
    }

    case "CORRECT":
    case "NEW_ATTEMPT":
      return createInitialGameSession();

    case "COMPLETE":
      if (state.status !== "candidate" || state.digits !== TARGET_NUMBER) {
        return state;
      }

      return {
        ...state,
        status: "completed",
        completed: event.result
      };
  }
}
