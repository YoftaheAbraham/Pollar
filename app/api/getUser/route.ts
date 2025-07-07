import { authConfig } from "@/config/authConfig";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    const user = await getServerSession(authConfig)
    return NextResponse.json({
        success: true,
        message: "This is current user!",
        user
    })
}