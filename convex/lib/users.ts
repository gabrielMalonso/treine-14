import type { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import type { Doc } from "./dataModel";
import type { MutationCtx, QueryCtx } from "./server";

export async function requireIdentity(ctx: Pick<QueryCtx, "auth">): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "Entre para salvar seu progresso."
    });
  }

  return identity;
}

export async function findUserBySubject(
  ctx: Pick<QueryCtx, "db">,
  subject: string
): Promise<Doc<"users"> | null> {
  return ctx.db
    .query("users")
    .withIndex("by_auth_subject", (query) => query.eq("authSubject", subject))
    .unique();
}

function identityName(identity: UserIdentity): string {
  const name = identity.name?.trim();
  if (name) {
    return name.slice(0, 80);
  }

  const nickname = identity.nickname?.trim();
  if (nickname) {
    return nickname.slice(0, 80);
  }

  const emailName = identity.email?.split("@")[0]?.trim();
  return emailName ? emailName.slice(0, 80) : "Jogador";
}

export async function ensureUser(ctx: MutationCtx, identity: UserIdentity): Promise<Doc<"users">> {
  const existing = await findUserBySubject(ctx, identity.subject);
  const now = Date.now();
  const name = identityName(identity);
  const avatarUrl = identity.pictureUrl?.trim() || undefined;

  if (existing) {
    if (existing.name !== name || existing.avatarUrl !== avatarUrl) {
      await ctx.db.patch(existing._id, {
        name,
        avatarUrl,
        updatedAt: now
      });
      const updated = await ctx.db.get(existing._id);
      if (updated) {
        return updated;
      }
    }

    return existing;
  }

  const id = await ctx.db.insert("users", {
    authSubject: identity.subject,
    name,
    avatarUrl,
    score: 0,
    attempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    createdAt: now,
    updatedAt: now
  });

  const created = await ctx.db.get(id);
  if (!created) {
    throw new ConvexError({
      code: "USER_CREATION_FAILED",
      message: "Não foi possível criar o perfil."
    });
  }

  return created;
}
