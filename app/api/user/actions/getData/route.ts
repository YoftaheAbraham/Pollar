import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/authConfig";

interface RecentProject {
  id: string;
  name: string;
  owner: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  pollCount: number;
  totalRespondents: number;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalPolls: number;
  totalVotes: number;
  recentProjects: RecentProject[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!(session?.user as any).id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session?.user as any).id;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [projects, allPolls, recentProjects] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        include: {
          polls: {
            select: {
              id: true,
              respondents: true,
              options: {
                select: {
                  votes: true
                }
              }
            }
          }
        }
      }),
      
      prisma.poll.findMany({
        where: {
          project: { userId }
        },
        include: {
          options: true
        }
      }),
      
      prisma.project.findMany({
        where: {
          userId,
          createdAt: { gte: oneWeekAgo }
        },
        include: {
          polls: {
            select: {
              respondents: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5 
      })
    ]);

    const now = new Date();
    const activeProjects = projects.filter(project => {
      return project.polls.some(poll => {
        const pollAgeInHours = (now.getTime() - new Date((poll as any).createdAt).getTime()) / (1000 * 60 * 60);
        return pollAgeInHours < 24;
      });
    }).length;

    const totalVotes = allPolls.reduce((sum, poll) => {
      return sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0);
    }, 0);

    const formattedRecentProjects = recentProjects.map(project => ({
      id: project.id,
      name: project.name,
      owner: project.owner,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      pollCount: project.polls.length,
      totalRespondents: project.polls.reduce((sum, poll) => sum + poll.respondents, 0)
    }));

    const responseData: DashboardStats = {
      totalProjects: projects.length,
      activeProjects,
      totalPolls: allPolls.length,
      totalVotes,
      recentProjects: formattedRecentProjects
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}