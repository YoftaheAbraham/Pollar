import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/authConfig";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, question, options, duration, maxVotes } = body;

    if (!projectId || !question || !options) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { success: false, message: "You must provide at least 2 options" },
        { status: 400 }
      );
    }

    const uniqueOptions = new Set(options.map(option => option.trim().toLowerCase()));
    if (uniqueOptions.size !== options.length) {
      return NextResponse.json(
        { success: false, message: "Options must be unique" },
        { status: 400 }
      );
    }

    if (duration && (typeof duration !== 'number' || duration <= 0)) {
      return NextResponse.json(
        { success: false, message: "Duration must be a positive number" },
        { status: 400 }
      );
    }

    if (maxVotes && (typeof maxVotes !== 'number' || maxVotes <= 0)) {
      return NextResponse.json(
        { success: false, message: "Max votes must be a positive number" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: (session.user as any).id
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found or you don't have permission" },
        { status: 404 }
      );
    }
    const poll = await prisma.$transaction(async (prisma) => {
      const newPoll = await prisma.poll.create({
        data: {
          question,
          projectId,
          duration: duration || 24, 
          maxVotes: maxVotes || null,
        }
      });

      await prisma.option.createMany({
        data: options.map(option => ({
          text: option,
          pollId: newPoll.id
        }))
      });

      return newPoll;
    });

    const createdPoll = await prisma.poll.findUnique({
      where: { id: poll.id },
      include: { options: true }
    });

    return NextResponse.json({
      success: true,
      poll: createdPoll
    });

  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}