import { betterAuth } from "better-auth";
import database from "./db.js";

const baseURL =
  process.env.BETTER_AUTH_URL ?? import.meta.env.BETTER_AUTH_URL;
const baseOrigin = baseURL ? new URL(baseURL).origin : undefined;
const extraTrustedOrigins = (
  process.env.BETTER_AUTH_TRUSTED_ORIGINS ??
  import.meta.env.BETTER_AUTH_TRUSTED_ORIGINS ??
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const trustedOrigins = [
  baseOrigin,
  ...(baseOrigin
    ? [
        baseOrigin.startsWith("https://")
          ? `http://${baseOrigin.slice("https://".length)}`
          : `https://${baseOrigin.slice("http://".length)}`,
      ]
    : []),
  "http://localhost:4321",
  "http://127.0.0.1:4321",
  ...extraTrustedOrigins,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database,
  secret: import.meta.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins,
  socialProviders: {
    github: {
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    },
  },
});
