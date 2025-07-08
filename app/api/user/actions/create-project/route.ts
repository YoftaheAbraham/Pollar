import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/authConfig";

type PollData = {
  question: string;
  options: string[];
  duration?: number;
  maxVotes?: number | null;
};

type ProjectData = {
  name: string;
  owner: string;
  description?: string;
  polls: PollData[];
};

const PollSchema: z.ZodType<PollData> = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(200),
  options: z.array(
    z.string().min(1, "Option cannot be empty").max(100)
  ).min(2, "At least 2 options required").max(6, "Maximum 6 options allowed"),
  duration: z.number().min(1).max(168).default(24), 
  maxVotes: z.number().min(1).optional().nullable()
});

const ProjectSchema: z.ZodType<ProjectData> = z.object({
  name: z.string().min(3).max(50),
  owner: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
  polls: z.array(PollSchema).min(1, "At least one poll required")
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const validation = ProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed",
          errors: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, owner, description, polls } = validation.data;
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const existingProject = await prisma.project.findFirst({
      where: {
        userId,
        name
      }
    });

    if (existingProject) {
      return NextResponse.json(
        { success: false, message: "Project name already exists" },
        { status: 400 }
      );
    }
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name,
          owner,
          description: description as string,
          userId
        }
      });

      for (const poll of polls) {
        await tx.poll.create({
          data: {
            question: poll.question,
            duration: poll.duration,
            maxVotes: poll.maxVotes || null,
            projectId: newProject.id,
            options: {
              create: poll.options.map((text: string) => ({ text }))
            }
          }
        });
      }

      return newProject;
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: { projectId: project.id }
    });

  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export function isNextResponse(response: any): response is NextResponse {
  return response instanceof NextResponse;
}