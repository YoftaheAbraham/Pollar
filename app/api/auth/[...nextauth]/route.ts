import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("Provider:", account?.provider);
            console.log("User:", user);
            console.log("Profile:", profile);
            return true;
        },
        async jwt({ token }) {
            // Return minimal token to prevent NextAuth from generating full JWT
            return {
                sub: token.sub // Only include user ID
            };
        },
    },
    session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };