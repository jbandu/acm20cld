import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { HomePageClient } from "@/components/welcome/HomePageClient";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    // Redirect based on role
    if (session.user?.role === "MANAGER") {
      redirect("/manager");
    } else if (session.user?.role === "ADMIN") {
      redirect("/admin/users");
    } else {
      redirect("/researcher");
    }
  }

  return <HomePageClient />;
}
