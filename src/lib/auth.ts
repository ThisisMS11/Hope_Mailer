import { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import { Adapter } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth", // Custom sign-in page if needed
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 30 days maxAge
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // When a new user logs in, add custom properties to the token
      if (account && profile) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token; // Ensure this is mapped
        token.expires_at = account.expires_at;
        token.id = account.userId || profile.id; // Explicitly map user ID
        token.username = profile.name;
        return token;
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        /* Refresh Token Logic */
        if (!token.refresh_token) throw new Error("Missing refresh token");

        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token,
            }),
            method: "POST",
          });

          const tokens = await response.json();

          if (!response.ok) throw tokens;

          return {
            ...token,
            access_token: tokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    async session({ session, token }: any) {
      /* configuring the session object before sending it to the client */
      if (token) {
        session.access_token = token.access_token;
        session.expires_at = token.expires_at;
        session.user = {
          ...session.user,
          id: token.id, // Use `token.id` explicitly
          username: token.username,
        };

        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (user) {
          session.user.admin = user.admin;
        }
      }
      return session;
    },
  },
};
