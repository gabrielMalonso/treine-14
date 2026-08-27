import type { Doc } from "./lib/dataModel";
import { mutation, query, type QueryCtx } from "./lib/server";
import { ensureUser, findUserBySubject, requireIdentity } from "./lib/users";
import { presentAttempt, presentStats } from "./lib/presenters";
import { getUserPosition } from "./lib/ranking";

type ProfileCtx = Pick<QueryCtx, "db">;

async function buildProfile(ctx: ProfileCtx, user: Doc<"users">) {
  const recentAttempts = await ctx.db
    .query("attempts")
    .withIndex("by_user_created", (index) => index.eq("userId", user._id))
    .order("desc")
    .take(20);
  const rank = await getUserPosition(ctx, user._id);

  return {
    identity: {
      id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl ?? null
    },
    stats: presentStats(user),
    recentAttempts: recentAttempts.map(presentAttempt),
    rank: rank.position,
    rankLabel: rank.label
  };
}

export const ensureCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const user = await ensureUser(ctx, identity);
    return buildProfile(ctx, user);
  }
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await findUserBySubject(ctx, identity.subject);
    if (!user) {
      return null;
    }

    return buildProfile(ctx, user);
  }
});
