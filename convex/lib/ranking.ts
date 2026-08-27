import type { Id } from "./dataModel";
import type { QueryCtx } from "./server";

const MAX_EXACT_RANK = 1_000;

export async function getUserPosition(
  ctx: Pick<QueryCtx, "db">,
  userId: Id<"users">
): Promise<{ position: number | null; label: string }> {
  const ranked = await ctx.db
    .query("users")
    .withIndex("by_score")
    .order("desc")
    .take(MAX_EXACT_RANK);

  const index = ranked.findIndex((user) => user._id === userId);
  if (index === -1) {
    return {
      position: null,
      label: `${MAX_EXACT_RANK}+`
    };
  }

  return {
    position: index + 1,
    label: String(index + 1)
  };
}
