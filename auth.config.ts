import type { NextAuthConfig } from "next-auth";

// Edge-safe auth configuration (no Prisma, no bcrypt)
// This is used by middleware which runs on Edge runtime
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Public routes
      const publicRoutes = ["/", "/login", "/register"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (!isLoggedIn && !isPublicRoute) {
        return false; // Redirect to login page
      }

      // Role-based access control
      if (isLoggedIn && auth?.user) {
        const role = auth.user.role;

        // Manager routes
        if (pathname.startsWith("/manager") && role !== "MANAGER" && role !== "ADMIN") {
          return Response.redirect(new URL("/researcher", nextUrl));
        }

        // Admin routes (accessible by MANAGER and ADMIN)
        if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "MANAGER") {
          return Response.redirect(new URL("/researcher", nextUrl));
        }

        // CEO routes (Admin only)
        if (pathname.startsWith("/ceo") && role !== "ADMIN") {
          return Response.redirect(new URL("/researcher", nextUrl));
        }
      }

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Providers will be added in the main auth config
} satisfies NextAuthConfig;
