import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import CEODashboardClient from "./CEODashboardClient";

export default async function CEODashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Fetch user with role check
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true },
  });

  // Check if user is admin/CEO
  if (user?.role !== "ADMIN") {
    redirect("/researcher");
  }

  return <CEODashboardClient user={user} />;
}
