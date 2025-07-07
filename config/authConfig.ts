import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import prisma from "@/lib/prisma";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { providers: true } // Include related data if needed
        });

        const providerName = account?.provider || "unknown";

        if (existingUser) {
          // Update user if needed
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: user.name || existingUser.name,
              avatar_url: user.image || existingUser.avatar_url
            }
          });

          // Add provider if missing
          if (!existingUser.providers.some(p => p.name === providerName)) {
            await prisma.provider.create({
              data: { name: providerName, userId: existingUser.id },
            });
          }
        } else {
          // Create new user with additional fields
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || profile?.name || "",
              avatar_url: user.image || profile?.image || "",
              password: ''
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token.sub) {
        // Fetch fresh user data from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            password: false
          }
        });

        if (user) {
          session.user = {
            ...session.user,
            ...user,
            image: user.avatar_url
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;