import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Check if user is admin/manager
  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    redirect("/researcher");
  }

  return <AdminUsersClient />;
}
