const convexUrl = import.meta.env.VITE_CONVEX_URL?.trim() ?? "";
const workosClientId = import.meta.env.VITE_WORKOS_CLIENT_ID?.trim() ?? "";
const workosRedirectUri = import.meta.env.VITE_WORKOS_REDIRECT_URI?.trim() ?? "";
const workosApiHostname = import.meta.env.VITE_WORKOS_API_HOSTNAME?.trim() ?? "";

const connected = Boolean(convexUrl && workosClientId && workosRedirectUri);

export const appConfig = {
  connected,
  convexUrl,
  workosClientId,
  workosRedirectUri,
  workosApiHostname: workosApiHostname || undefined
} as const;
