import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/tokenGenerator";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          throw new Error("No email provided");
        }
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });

        let userId: string;
        let providerName = account?.provider || "unknown";

        if (existingUser) {
          userId = existingUser.id;
          const existingProvider = await prisma.provider.findFirst({
            where: {
              userId: existingUser.id,
              name: providerName,
            },
          });

          if (!existingProvider) {
            await prisma.provider.create({
              data: {
                name: providerName,
                userId: existingUser.id,
              },
            });
          }
        } else {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || profile?.name || "",
              password: "",
              avatar_url: user.image || profile?.image || "",
            },
          });
          userId = newUser.id;
        }
        const token = createToken({ userId });
        (user as any).token = token;

        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token.token) {
        (session as any).token = token.token;
      }
      return session;
    },
    async jwt({ token, user }) {
      if ((user as any)?.token) {
        token.token = (user as any).token;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };