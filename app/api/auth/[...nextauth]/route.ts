import NextAuth from "next-auth";
import { authConfig } from "@/config/authConfig";

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };

export const { auth, signIn, signOut } = NextAuth(authConfig);