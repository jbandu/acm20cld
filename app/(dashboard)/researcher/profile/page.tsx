import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function ProfilePage() {
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
                href="/researcher"
                className="text-sm text-gray-500 hover:text-gray-700 mb-1 block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <Link
              href="/researcher/profile/edit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 mt-1">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-gray-900 mt-1">{user.title || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-gray-900 mt-1">{user.department || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Institution</label>
              <p className="text-gray-900 mt-1">{user.institution || "Not specified"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="text-gray-900 mt-1">{user.location || "Not specified"}</p>
            </div>
          </div>
          {user.bio && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Bio</label>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Research Profile */}
        {user.researchProfile && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Research Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Highest Degree
                </label>
                <p className="text-gray-900 mt-1">
                  {user.researchProfile.highestDegree || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Expertise Level
                </label>
                <p className="text-gray-900 mt-1">
                  {user.researchProfile.expertiseLevel}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Years in Field
                </label>
                <p className="text-gray-900 mt-1">
                  {user.researchProfile.yearsInField || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ORCID ID</label>
                <p className="text-gray-900 mt-1">
                  {user.researchProfile.orcidId || "Not specified"}
                </p>
              </div>
            </div>

            {user.researchProfile.primaryInterests.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Primary Research Interests
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.primaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.secondaryInterests.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Secondary Research Interests
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.secondaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.techniques.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  Laboratory Techniques
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.techniques.map((technique) => (
                    <span
                      key={technique}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.phdFocus && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">
                  PhD Research Focus
                </label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {user.researchProfile.phdFocus}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.emailNotifications ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              <span className="text-gray-700">Email Notifications</span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.notifyOnQueryComplete ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              <span className="text-gray-700">Query Completion Notifications</span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.notifyWeeklyDigest ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              <span className="text-gray-700">Weekly Digest</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
