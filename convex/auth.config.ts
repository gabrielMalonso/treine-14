import type { AuthConfig } from "convex/server";

const clientId = process.env.WORKOS_CLIENT_ID;
const issuer = process.env.WORKOS_AUTHKIT_ISSUER;

export default {
  providers:
    clientId && issuer
      ? [
          {
            domain: issuer,
            applicationID: clientId
          }
        ]
      : []
} satisfies AuthConfig;
