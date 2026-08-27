import { v } from "convex/values";
import { query } from "./lib/server";
import { findUserBySubject } from "./lib/users";
import { presentRankingEntry } from "./lib/presenters";
import { getUserPosition } from "./lib/ranking";

export const get = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const requestedLimit =
      args.limit !== undefined && Number.isFinite(args.limit) ? Math.floor(args.limit) : 10;
    const limit = Math.min(50, Math.max(1, requestedLimit));
    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity ? await findUserBySubject(ctx, identity.subject) : null;

    const topUsers = await ctx.db.query("users").withIndex("by_score").order("desc").take(limit);

    const entries = topUsers.map((user, index) =>
      presentRankingEntry(user, index + 1, currentUser?._id ?? null)
    );

    if (!currentUser) {
      return {
        entries,
        currentPlayer: null
      };
    }

    const rank = await getUserPosition(ctx, currentUser._id);

    return {
      entries,
      currentPlayer: presentRankingEntry(currentUser, rank.position ?? 1_001, currentUser._id)
    };
  }
});
