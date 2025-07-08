import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/authConfig"

interface PollAnalytics {
  id: string;
  question: string;
  duration: number;
  maxVotes: number | null;
  isActive: boolean;
  totalVotes: number;
  uniqueRespondents: number;
  options: {
    id: string;
    text: string;
    votes: number;
    percentage: number;
  }[];
  createdAt: Date;
  ageInHours: number;
}

interface ProjectResponse {
  id: string;
  name: string;
  owner: string;
  description: string;
  createdAt: Date;
  ageInHours: number;
  isActive: boolean;
  totalPolls: number;
  totalVotes: number;
  uniqueRespondents: number;
  activePolls: number;
  completedPolls: number;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectId = params.id;
    const userId = (session.user as any).id;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId 
      },
      include: {
        polls: {
          include: {
            options: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found or access denied" },
        { status: 404 }
      );
    }
    if (project.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - You are not the project owner" },
        { status: 403 }
      );
    }

    const now = new Date();
    const createdAt = new Date(project.createdAt);
    const ageInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));

    const pollsWithAnalytics: PollAnalytics[] = project.polls.map(poll => {
      const pollCreatedAt = new Date(poll.createdAt);
      const pollAgeInHours = Math.floor((now.getTime() - pollCreatedAt.getTime()) / (1000 * 60 * 60));
      const isPollActive = pollAgeInHours < poll.duration;

      const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

      const optionsWithStats = poll.options.map(option => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
        percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
      }));

      return {
        id: poll.id,
        question: poll.question,
        duration: poll.duration,
        maxVotes: poll.maxVotes,
        isActive: isPollActive,
        totalVotes,
        uniqueRespondents: poll.respondents,
        options: optionsWithStats,
        createdAt: poll.createdAt,
        ageInHours: pollAgeInHours
      };
    });

    const totalVotes = project.polls.reduce((sum, poll) => 
      sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 
    0);
    
    const uniqueRespondents = project.polls.reduce((sum, poll) => sum + poll.respondents, 0);

    const responseData = {
      project: {
        id: project.id,
        name: project.name,
        owner: project.owner,
        description: project.description,
        createdAt: project.createdAt,
        ageInHours,
        isActive: pollsWithAnalytics.some(poll => poll.isActive),
        totalPolls: project.polls.length,
        totalVotes,
        uniqueRespondents,
        activePolls: pollsWithAnalytics.filter(poll => poll.isActive).length,
        completedPolls: pollsWithAnalytics.filter(poll => !poll.isActive).length
      } as ProjectResponse,
      polls: pollsWithAnalytics
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Error fetching project analytics:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}