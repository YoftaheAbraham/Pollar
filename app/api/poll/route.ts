import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface SubmissionRequest {
  optionId: string;
}

interface PollResponse {
  id: string;
  question: string;
  duration: number;
  maxVotes: number | null;
  respondents: number;
  isActive: boolean;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { success: false, message: "Request body is required" },
        { status: 400 }
      );
    }

    const { optionId }: SubmissionRequest = await request.json();

    if (!optionId) {
      return NextResponse.json(
        { success: false, message: "optionId is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const option = await tx.option.findUnique({
        where: { id: optionId },
        include: { poll: true }
      });

      if (!option) {
        throw new Error("Option not found");
      }

      const pollAgeInHours = (Date.now() - option.poll.createdAt.getTime()) / (1000 * 60 * 60);
      if (pollAgeInHours > option.poll.duration) {
        throw new Error("This poll has expired");
      }

      if (option.poll.maxVotes && option.poll.respondents >= option.poll.maxVotes) {
        throw new Error("This poll has reached maximum responses");
      }

      const updatedOption = await tx.option.update({
        where: { id: optionId },
        data: { votes: { increment: 1 } },
        select: { votes: true, pollId: true }
      });

      await tx.poll.update({
        where: { id: option.pollId },
        data: { respondents: { increment: 1 } }
      });

      return {
        pollId: option.pollId,
        optionId,
        newVoteCount: updatedOption.votes
      };
    });

    return NextResponse.json({
      success: true,
      message: "Vote submitted successfully",
      data: result
    });

  } catch (error: any) {
    console.error("Poll submission error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to submit vote",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json(
        { success: false, message: "pollId query parameter is required" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            votes: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!poll) {
      return NextResponse.json(
        { success: false, message: "Poll not found" },
        { status: 404 }
      );
    }

    // Check if poll is still active
    const pollAgeInHours = (Date.now() - poll.createdAt.getTime()) / (1000 * 60 * 60);
    const isActive = pollAgeInHours <= poll.duration && 
                    (poll.maxVotes === null || poll.respondents < poll.maxVotes);

    const responseData: PollResponse = {
      id: poll.id,
      question: poll.question,
      duration: poll.duration,
      maxVotes: poll.maxVotes,
      respondents: poll.respondents,
      isActive,
      options: poll.options
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error: any) {
    console.error("Poll fetch error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch poll data",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}