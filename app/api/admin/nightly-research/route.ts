import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth-config";
import { getResearchQueue, scheduleNightlyResearch } from "@/lib/agents/nightly-agent";

export async function POST(req: NextRequest) {
  try {
    await requireRole(["ADMIN"]);

    const { action } = await req.json();
    const researchQueue = getResearchQueue();

    if (action === "schedule") {
      await scheduleNightlyResearch();
      return NextResponse.json({
        success: true,
        message: "Nightly research agent scheduled",
      });
    } else if (action === "trigger") {
      // Manually trigger a run
      const job = await researchQueue.add("manual-trigger", {
        date: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Nightly research triggered manually",
        jobId: job.id,
      });
    } else if (action === "status") {
      const jobCounts = await researchQueue.getJobCounts();
      const jobs = await researchQueue.getJobs(["completed", "failed"], 0, 10);

      return NextResponse.json({
        success: true,
        counts: jobCounts,
        recentJobs: jobs.map((job) => ({
          id: job.id,
          name: job.name,
          data: job.data,
          returnvalue: job.returnvalue,
          failedReason: job.failedReason,
          finishedOn: job.finishedOn,
        })),
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Nightly research API error:", error);

    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireRole(["ADMIN", "MANAGER"]);

    const researchQueue = getResearchQueue();
    const jobCounts = await researchQueue.getJobCounts();
    const completedJobs = await researchQueue.getCompleted(0, 10);
    const failedJobs = await researchQueue.getFailed(0, 10);

    return NextResponse.json({
      success: true,
      counts: jobCounts,
      completedJobs: completedJobs.map((job) => ({
        id: job.id,
        data: job.data,
        returnvalue: job.returnvalue,
        finishedOn: job.finishedOn,
      })),
      failedJobs: failedJobs.map((job) => ({
        id: job.id,
        data: job.data,
        failedReason: job.failedReason,
        finishedOn: job.finishedOn,
      })),
    });
  } catch (error: any) {
    console.error("Nightly research GET error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
