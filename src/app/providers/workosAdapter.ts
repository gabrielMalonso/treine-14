import { useCallback } from "react";
import { useAuth } from "@workos-inc/authkit-react";
import type { PlayerIdentity } from "@/types";

export type WorkOSUserLike = {
  id?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  name?: unknown;
  profilePictureUrl?: unknown;
  avatarUrl?: unknown;
};

export type WorkOSAuthLike = {
  user?: WorkOSUserLike | null;
  isLoading?: boolean;
  getAccessToken?: () => Promise<string | null | undefined>;
  signIn?: () => Promise<void> | void;
  signOut?: () => Promise<void> | void;
};

export function useWorkOSAuthLike(): WorkOSAuthLike {
  return useAuth();
}

export function useWorkOSConvexAuth() {
  const auth = useWorkOSAuthLike();
  const { getAccessToken, isLoading, user } = auth;

  const fetchAccessToken = useCallback(async () => {
    if (!getAccessToken) {
      return null;
    }

    return (await getAccessToken()) ?? null;
  }, [getAccessToken]);

  return {
    isLoading: Boolean(isLoading),
    isAuthenticated: Boolean(user),
    fetchAccessToken
  };
}

function asText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function normalizeWorkOSUser(
  user: WorkOSUserLike | null | undefined
): PlayerIdentity | null {
  if (!user) {
    return null;
  }

  const firstName = asText(user.firstName);
  const lastName = asText(user.lastName);
  const explicitName = asText(user.name);
  const email = asText(user.email);
  const composedName = [firstName, lastName].filter(Boolean).join(" ");
  const fallbackName = email?.split("@")[0] ?? "Jogador";

  return {
    id: asText(user.id) ?? "workos-user",
    name: explicitName ?? (composedName || fallbackName),
    avatarUrl: asText(user.profilePictureUrl) ?? asText(user.avatarUrl)
  };
}
