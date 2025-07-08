// app/api/auth/validate/route.ts
import { authConfig } from "@/config/authConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authConfig);
  return NextResponse.json({ 
    valid: !!session,
    expires: session?.expires
  });
}