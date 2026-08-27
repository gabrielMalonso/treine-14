import { describe, expect, it } from "vitest";
import { createInitialGameSession, gameReducer } from "@/services/game/gameMachine";
import type { CompletedAttempt } from "@/types";

const completedResult: CompletedAttempt = {
  attempt: {
    id: "attempt_12345678",
    durationMs: 1_240,
    score: 184,
    createdAt: 1_700_000_000_000,
    synced: false
  },
  stats: {
    score: 184,
    attempts: 1,
    bestTimeMs: 1_240,
    currentStreak: 1,
    bestStreak: 1,
    lastAttemptAt: 1_700_000_000_000
  },
  isNewBest: true
};

describe("gameReducer", () => {
  it("começa no estado inicial", () => {
    expect(createInitialGameSession()).toEqual({
      status: "idle",
      digits: "",
      completed: null
    });
  });

  it("digitar 1 entra no estado typing", () => {
    const state = gameReducer(createInitialGameSession(), {
      type: "DIGIT",
      digit: "1"
    });

    expect(state.status).toBe("typing");
    expect(state.digits).toBe("1");
  });

  it("digitar 14 revela o estado candidate", () => {
    const one = gameReducer(createInitialGameSession(), {
      type: "DIGIT",
      digit: "1"
    });
    const fourteen = gameReducer(one, {
      type: "DIGIT",
      digit: "4"
    });

    expect(fourteen.status).toBe("candidate");
    expect(fourteen.digits).toBe("14");
  });

  it("CORRIGE limpa e retorna ao estado inicial", () => {
    const typed = {
      status: "typing" as const,
      digits: "19",
      completed: null
    };

    expect(gameReducer(typed, { type: "CORRECT" })).toEqual(createInitialGameSession());
  });

  it("confirma 14 e conclui", () => {
    const candidate = {
      status: "candidate" as const,
      digits: "14",
      completed: null
    };

    const completed = gameReducer(candidate, {
      type: "COMPLETE",
      result: completedResult
    });

    expect(completed.status).toBe("completed");
    expect(completed.completed).toEqual(completedResult);
  });

  it("impede confirmação inválida", () => {
    const invalid = {
      status: "typing" as const,
      digits: "15",
      completed: null
    };

    expect(
      gameReducer(invalid, {
        type: "COMPLETE",
        result: completedResult
      })
    ).toBe(invalid);
  });

  it("inicia nova tentativa sem resíduo do resultado", () => {
    const completed = {
      status: "completed" as const,
      digits: "14",
      completed: completedResult
    };

    expect(gameReducer(completed, { type: "NEW_ATTEMPT" })).toEqual(createInitialGameSession());
  });
});
