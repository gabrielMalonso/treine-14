import { describe, expect, it } from "vitest";
import { LocalGameRepository } from "@/repositories/local/localGameRepository";
import { MemoryStorage } from "@/repositories/local/memoryStorage";
import { STORAGE_KEY } from "@/repositories/local/storageCodec";

function createRepository(storage = new MemoryStorage()) {
  let now = 1_700_000_000_000;
  let id = 0;

  return {
    storage,
    repository: new LocalGameRepository(storage, {
      now: () => {
        now += 1_000;
        return now;
      },
      createAttemptId: () => `attempt_test_${++id}`
    })
  };
}

describe("LocalGameRepository", () => {
  it("lê estado padrão quando não há dados", () => {
    const { repository } = createRepository();
    const snapshot = repository.getSnapshot();

    expect(snapshot.profile.stats).toEqual({
      score: 0,
      attempts: 0,
      bestTimeMs: null,
      currentStreak: 0,
      bestStreak: 0,
      lastAttemptAt: null
    });
    expect(snapshot.profile.recentAttempts).toEqual([]);
    expect(snapshot.settings.soundEnabled).toBe(true);
  });

  it("persiste e recupera uma tentativa e as configurações", () => {
    const { storage, repository } = createRepository();

    const result = repository.recordAttempt(1_240);
    repository.setSoundEnabled(false);

    const restored = new LocalGameRepository(storage).getSnapshot();

    expect(result.attempt.durationMs).toBe(1_240);
    expect(restored.profile.stats.attempts).toBe(1);
    expect(restored.profile.stats.score).toBe(result.attempt.score);
    expect(restored.profile.stats.bestTimeMs).toBe(1_240);
    expect(restored.profile.recentAttempts[0]?.id).toBe(result.attempt.id);
    expect(restored.settings.soundEnabled).toBe(false);
  });

  it("se recupera de JSON corrompido", () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, "{isto não é json");

    const repository = new LocalGameRepository(storage);
    const snapshot = repository.getSnapshot();

    expect(snapshot.profile.stats.attempts).toBe(0);
    expect(snapshot.profile.stats.score).toBe(0);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("se recupera de um formato inválido", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        identity: null,
        stats: { score: "fraude" },
        attempts: "não é lista",
        settings: {}
      })
    );

    const snapshot = new LocalGameRepository(storage).getSnapshot();

    expect(snapshot.profile.stats.attempts).toBe(0);
    expect(snapshot.profile.identity.name).toBe("Você");
  });

  it("mantém a sessão funcional quando o armazenamento está indisponível", () => {
    const unavailableStorage = {
      getItem: () => {
        throw new Error("indisponível");
      },
      setItem: () => {
        throw new Error("indisponível");
      },
      removeItem: () => {
        throw new Error("indisponível");
      }
    };
    const repository = new LocalGameRepository(unavailableStorage, {
      now: () => 1_700_000_000_000,
      createAttemptId: () => "attempt_memory_1"
    });

    repository.recordAttempt(1_100);
    const snapshot = repository.getSnapshot();

    expect(snapshot.profile.stats.attempts).toBe(1);
    expect(snapshot.profile.recentAttempts[0]?.durationMs).toBe(1_100);
  });

  it("limita o histórico local às 100 tentativas mais recentes", () => {
    const { repository } = createRepository();

    for (let index = 0; index < 105; index += 1) {
      repository.recordAttempt(1_000 + index);
    }

    const snapshot = repository.getSnapshot();

    expect(snapshot.profile.stats.attempts).toBe(105);
    expect(snapshot.profile.recentAttempts).toHaveLength(100);
    expect(snapshot.profile.recentAttempts[0]?.durationMs).toBe(1_104);
  });
});
