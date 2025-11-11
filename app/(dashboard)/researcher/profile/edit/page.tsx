import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import Link from "next/link";

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      researchProfile: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/researcher/profile"
                className="text-sm text-gray-500 hover:text-gray-700 mb-1 block"
              >
                ← Back to Profile
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ProfileEditForm user={user} />
      </main>
    </div>
  );
}
