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
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #f8f9fa 0%, #e9ecef 100%)' }}>
      <header className="bg-white border-b-2 border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/researcher"
                className="text-sm text-purple-600 hover:text-purple-800 mb-2 block transition-colors inline-flex items-center gap-1 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold" style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>My Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/researcher/profile/edit"
                className="px-5 py-2.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
              >
                Edit Profile
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6 border border-neutral-200 animate-fade-in">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-500">Name</label>
              <p className="text-neutral-900 mt-1 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Email</label>
              <p className="text-neutral-900 mt-1 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Title</label>
              <p className="text-neutral-900 mt-1">{user.title || <span className="text-neutral-400">Not specified</span>}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Department</label>
              <p className="text-neutral-900 mt-1">{user.department || <span className="text-neutral-400">Not specified</span>}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Institution</label>
              <p className="text-neutral-900 mt-1">{user.institution || <span className="text-neutral-400">Not specified</span>}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Location</label>
              <p className="text-neutral-900 mt-1">{user.location || <span className="text-neutral-400">Not specified</span>}</p>
            </div>
          </div>
          {user.bio && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <label className="text-sm font-medium text-neutral-500">Bio</label>
              <p className="text-neutral-700 mt-2 whitespace-pre-wrap leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>

        {/* Research Profile */}
        {user.researchProfile && (
          <div className="bg-white rounded-lg shadow-card p-6 mb-6 border border-neutral-200 animate-fade-in" style={{ animationDelay: '75ms' }}>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Research Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-500">
                  Highest Degree
                </label>
                <p className="text-neutral-900 mt-1">
                  {user.researchProfile.highestDegree || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">
                  Expertise Level
                </label>
                <p className="text-neutral-900 mt-1">
                  {user.researchProfile.expertiseLevel}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">
                  Years in Field
                </label>
                <p className="text-neutral-900 mt-1">
                  {user.researchProfile.yearsInField || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">ORCID ID</label>
                <p className="text-neutral-900 mt-1">
                  {user.researchProfile.orcidId || "Not specified"}
                </p>
              </div>
            </div>

            {user.researchProfile.primaryInterests.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-500">
                  Primary Research Interests
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.primaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.secondaryInterests.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-500">
                  Secondary Research Interests
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.secondaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-gray-100 text-neutral-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.techniques.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-500">
                  Laboratory Techniques
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.researchProfile.techniques.map((technique) => (
                    <span
                      key={technique}
                      className="px-3 py-1 bg-accent-emerald-100 text-accent-emerald-800 rounded-full text-sm"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.researchProfile.phdFocus && (
              <div className="mt-4">
                <label className="text-sm font-medium text-neutral-500">
                  PhD Research Focus
                </label>
                <p className="text-neutral-900 mt-1 whitespace-pre-wrap">
                  {user.researchProfile.phdFocus}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.emailNotifications ? "bg-accent-emerald-500" : "bg-neutral-300"
                }`}
              ></span>
              <span className="text-neutral-700">Email Notifications</span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.notifyOnQueryComplete ? "bg-accent-emerald-500" : "bg-neutral-300"
                }`}
              ></span>
              <span className="text-neutral-700">Query Completion Notifications</span>
            </div>
            <div className="flex items-center">
              <span
                className={`w-4 h-4 rounded mr-2 ${
                  user.notifyWeeklyDigest ? "bg-accent-emerald-500" : "bg-neutral-300"
                }`}
              ></span>
              <span className="text-neutral-700">Weekly Digest</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
