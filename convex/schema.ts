import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authSubject: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    score: v.number(),
    attempts: v.number(),
    bestTimeMs: v.optional(v.number()),
    currentStreak: v.number(),
    bestStreak: v.number(),
    lastAttemptAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_auth_subject", ["authSubject"])
    .index("by_score", ["score", "updatedAt"]),

  attempts: defineTable({
    userId: v.id("users"),
    clientAttemptId: v.string(),
    durationMs: v.number(),
    score: v.number(),
    createdAt: v.number()
  })
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_client", ["userId", "clientAttemptId"])
    .index("by_created", ["createdAt"])
});
