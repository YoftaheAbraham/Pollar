import { authConfig } from "@/config/authConfig";
import { PLANS } from "@/config/plans";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const currentPlan = (session.user as any).plan as 'FREE' | 'PRO' | 'ENTERPRISE';

  try {
    // Fetch actual usage stats from Prisma
    const userProjects = await prisma.project.findMany({
      where: { userId },
      include: { polls: true },
    });

    const totalProjects = userProjects.length;
    const totalPolls = userProjects.reduce((sum, project) => sum + project.polls.length, 0);
    const totalResponses = userProjects.reduce(
      (sum, project) => sum + project.polls.reduce((pollSum, poll) => pollSum + poll.respondents, 0),
      0
    );

    // Get plan limits from your hardcoded PLANS
    const planLimits = PLANS[currentPlan].features;
    const isUnlimitedPlan = currentPlan === 'ENTERPRISE';

    // Calculate remaining quotas (null for unlimited)
    const calculateRemaining = (used: number, limit: number | null) => {
      if (limit === null || isUnlimitedPlan) return null;
      return Math.max(0, limit - used);
    };

    // Check if limits are exceeded (always false for unlimited)
    const checkExceeded = (used: number, limit: number | null) => {
      if (limit === null || isUnlimitedPlan) return false;
      return used > limit;
    };

    return NextResponse.json({
      currentPlan,
      limits: {
        maxProjects: isUnlimitedPlan ? null : planLimits.totalProjects,
        maxPollsPerProject: isUnlimitedPlan ? null : planLimits.pollsPerProject,
        maxTotalPolls: isUnlimitedPlan ? null : planLimits.totalPolls,
        maxResponses: isUnlimitedPlan ? null : planLimits.totalResponses,
        prioritySupport: planLimits.prioritySupport,
      },
      usage: {
        totalProjects,
        totalPolls,
        totalResponses,
        remainingProjects: calculateRemaining(totalProjects, planLimits.totalProjects),
        remainingPolls: calculateRemaining(totalPolls, planLimits.totalPolls),
        remainingResponses: calculateRemaining(totalResponses, planLimits.totalResponses),
      },
      exceeded: {
        projects: checkExceeded(totalProjects, planLimits.totalProjects),
        polls: checkExceeded(totalPolls, planLimits.totalPolls),
        responses: checkExceeded(totalResponses, planLimits.totalResponses),
      },
      isUnlimited: isUnlimitedPlan,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}