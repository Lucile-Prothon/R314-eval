import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAuthRoute =
    pathname === "/api/auth" || pathname.startsWith("/api/auth/");

  if (isAuthRoute) {
    return next();
  }

  const session = await auth.api.getSession({
    headers: context.request.headers,
    query: { disableCookieCache: true },
  });

  if (pathname === "/login") {
    return session ? context.redirect("/") : next();
  }

  if (!session) {
    return context.redirect("/login");
  }

  context.locals.user = session.user;
  return next();
});
