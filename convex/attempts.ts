import { SERVER_SUBMISSION_COOLDOWN_MS, nextStreak } from "../shared/game";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./lib/server";
import { ensureUser, findUserBySubject, requireIdentity } from "./lib/users";
import { presentAttempt, presentStats } from "./lib/presenters";
import { calculateScoreServerSide } from "./lib/scoring";

function validateClientAttemptId(clientAttemptId: string): void {
  if (
    clientAttemptId.length < 8 ||
    clientAttemptId.length > 120 ||
    !/^[a-zA-Z0-9_-]+$/.test(clientAttemptId)
  ) {
    throw new ConvexError({
      code: "INVALID_ATTEMPT_ID",
      message: "Identificador de tentativa inválido."
    });
  }
}

export const record = mutation({
  args: {
    durationMs: v.number(),
    clientAttemptId: v.string()
  },
  handler: async (ctx, args) => {
    validateClientAttemptId(args.clientAttemptId);
    const identity = await requireIdentity(ctx);
    const user = await ensureUser(ctx, identity);

    const duplicate = await ctx.db
      .query("attempts")
      .withIndex("by_user_client", (index) =>
        index.eq("userId", user._id).eq("clientAttemptId", args.clientAttemptId)
      )
      .unique();

    if (duplicate) {
      return {
        attempt: presentAttempt(duplicate),
        stats: presentStats(user),
        isNewBest: user.bestTimeMs === duplicate.durationMs
      };
    }

    const now = Date.now();
    if (
      user.lastAttemptAt !== undefined &&
      now - user.lastAttemptAt < SERVER_SUBMISSION_COOLDOWN_MS
    ) {
      throw new ConvexError({
        code: "RATE_LIMITED",
        message: "Tentativas enviadas rápido demais."
      });
    }

    const currentStreak = nextStreak(user.currentStreak, user.lastAttemptAt ?? null, now);
    const score = calculateScoreServerSide(args.durationMs, currentStreak);
    const isNewBest = user.bestTimeMs === undefined || args.durationMs < user.bestTimeMs;

    const attemptId = await ctx.db.insert("attempts", {
      userId: user._id,
      clientAttemptId: args.clientAttemptId,
      durationMs: args.durationMs,
      score,
      createdAt: now
    });

    await ctx.db.patch(user._id, {
      score: user.score + score,
      attempts: user.attempts + 1,
      bestTimeMs: isNewBest ? args.durationMs : user.bestTimeMs,
      currentStreak,
      bestStreak: Math.max(user.bestStreak, currentStreak),
      lastAttemptAt: now,
      updatedAt: now
    });

    const [attempt, updatedUser] = await Promise.all([ctx.db.get(attemptId), ctx.db.get(user._id)]);

    if (!attempt || !updatedUser) {
      throw new ConvexError({
        code: "PERSISTENCE_FAILED",
        message: "Não foi possível concluir o registro."
      });
    }

    return {
      attempt: presentAttempt(attempt),
      stats: presentStats(updatedUser),
      isNewBest
    };
  }
});

export const recent = query({
  args: {
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        page: [],
        isDone: true,
        continueCursor: ""
      };
    }

    const user = await findUserBySubject(ctx, identity.subject);
    if (!user) {
      return {
        page: [],
        isDone: true,
        continueCursor: ""
      };
    }

    const result = await ctx.db
      .query("attempts")
      .withIndex("by_user_created", (index) => index.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map(presentAttempt)
    };
  }
});
