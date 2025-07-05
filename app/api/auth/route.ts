import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  
  return NextResponse.json({
    message: "Success",
    requestDetails: {
      body,
    }
  })
}
export async function GET() {
    const user = await prisma.user.findMany()
    return NextResponse.json({
        user,
        message: "This route is for prisma test only!"
    })
}