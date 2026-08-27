import type { RankingEntry } from "@/types";

export const mockRankingEntries: Omit<RankingEntry, "position" | "isCurrentPlayer">[] = [
  {
    id: "mock-lucas",
    name: "Lucas",
    avatarUrl: null,
    score: 18_420,
    bestTimeMs: 860
  },
  {
    id: "mock-maria",
    name: "Maria",
    avatarUrl: null,
    score: 17_830,
    bestTimeMs: 910
  },
  {
    id: "mock-gabriel",
    name: "Gabriel",
    avatarUrl: null,
    score: 15_910,
    bestTimeMs: 970
  },
  {
    id: "mock-rafael",
    name: "Rafael",
    avatarUrl: null,
    score: 14_230,
    bestTimeMs: 1_030
  },
  {
    id: "mock-carlos",
    name: "Carlos",
    avatarUrl: null,
    score: 13_980,
    bestTimeMs: 1_080
  },
  {
    id: "mock-ana",
    name: "Ana",
    avatarUrl: null,
    score: 12_610,
    bestTimeMs: 1_120
  },
  {
    id: "mock-julia",
    name: "Júlia",
    avatarUrl: null,
    score: 11_740,
    bestTimeMs: 1_180
  },
  {
    id: "mock-bruno",
    name: "Bruno",
    avatarUrl: null,
    score: 10_580,
    bestTimeMs: 1_230
  },
  {
    id: "mock-bianca",
    name: "Bianca",
    avatarUrl: null,
    score: 9_620,
    bestTimeMs: 1_270
  },
  {
    id: "mock-diego",
    name: "Diego",
    avatarUrl: null,
    score: 8_910,
    bestTimeMs: 1_310
  },
  {
    id: "mock-nina",
    name: "Nina",
    avatarUrl: null,
    score: 7_830,
    bestTimeMs: 1_390
  },
  {
    id: "mock-vitor",
    name: "Vitor",
    avatarUrl: null,
    score: 6_740,
    bestTimeMs: 1_430
  }
];
