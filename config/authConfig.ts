import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import prisma from "@/lib/prisma";

export const authConfig: NextAuthOptions = {
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
      if (!user.email) return false;

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name || undefined,
            avatarUrl: user.image || profile?.image || undefined,
          },
          create: {
            email: user.email,
            name: user.name || profile?.name || "",
            avatarUrl: user.image || profile?.image || "",
            password: ""
          }
        });
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        });
        
        if (dbUser) {
          token = {
            ...token,
            ...dbUser,
            picture: dbUser.avatarUrl
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Token:", token);
      
      (session.user as any) = {
        ...session.user,
        id: token.id,
        name: token.name as string,
        email: token.email as string,
        image: token.picture as string
      };
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  }
};