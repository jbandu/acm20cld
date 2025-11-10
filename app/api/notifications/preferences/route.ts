import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-config";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        notifyOnQueryComplete: true,
        notifyWeeklyDigest: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { emailNotifications, notifyOnQueryComplete, notifyWeeklyDigest } =
      body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications:
          emailNotifications !== undefined
            ? emailNotifications
            : undefined,
        notifyOnQueryComplete:
          notifyOnQueryComplete !== undefined
            ? notifyOnQueryComplete
            : undefined,
        notifyWeeklyDigest:
          notifyWeeklyDigest !== undefined ? notifyWeeklyDigest : undefined,
      },
      select: {
        emailNotifications: true,
        notifyOnQueryComplete: true,
        notifyWeeklyDigest: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
