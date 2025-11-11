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
      {/* Hero Header with Gradient */}
      <header className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-animated opacity-10" />

        <div className="relative bg-white border-b-2 border-purple-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/researcher"
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Link
                  href="/researcher/profile/edit"
                  className="px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'}}
                >
                  Edit Profile
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-all"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>

            {/* Profile Hero */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl gradient-primary flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green-500 border-4 border-white shadow-lg" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-neutral-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-3">
                  {user.title && (
                    <div className="badge-primary">
                      {user.title}
                    </div>
                  )}
                  {user.institution && (
                    <div className="badge-secondary">
                      {user.institution}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-1 badge-success">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-6 sm:px-8 lg:px-10">
        {/* About Section */}
        {user.bio && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100 animate-fade-in hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">About</h2>
            </div>
            <p className="text-neutral-700 text-lg leading-relaxed whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}

        {/* Basic Information Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100 animate-fade-in hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Contact & Affiliation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gradient-card border border-purple-100">
              <label className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Email</label>
              <p className="text-neutral-900 mt-2 font-medium text-lg">{user.email}</p>
            </div>
            {user.department && (
              <div className="p-4 rounded-xl bg-gradient-card border border-blue-100">
                <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Department</label>
                <p className="text-neutral-900 mt-2 font-medium text-lg">{user.department}</p>
              </div>
            )}
          </div>
        </div>

        {/* Research Profile */}
        {user.researchProfile && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100 animate-fade-in hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Research Profile</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-gradient-card border border-purple-100 text-center">
                <p className="text-sm font-semibold text-purple-600 mb-1">Degree</p>
                <p className="text-2xl font-bold gradient-text">
                  {user.researchProfile.highestDegree || "—"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-card border border-blue-100 text-center">
                <p className="text-sm font-semibold text-blue-600 mb-1">Experience</p>
                <p className="text-2xl font-bold text-blue-600">
                  {user.researchProfile.yearsInField || "—"}
                  <span className="text-sm ml-1">yrs</span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-card border border-pink-100 text-center">
                <p className="text-sm font-semibold text-pink-600 mb-1">Expertise</p>
                <p className="text-lg font-bold text-pink-600">
                  {user.researchProfile.expertiseLevel}
                </p>
              </div>
              {user.researchProfile.orcidId && (
                <div className="p-4 rounded-xl bg-gradient-card border border-green-100 text-center">
                  <p className="text-sm font-semibold text-green-600 mb-1">ORCID</p>
                  <p className="text-xs font-mono text-green-700 truncate">
                    {user.researchProfile.orcidId}
                  </p>
                </div>
              )}
            </div>

            {/* PhD Focus */}
            {user.researchProfile.phdFocus && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
                <label className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-3 block">
                  PhD Research Focus
                </label>
                <p className="text-neutral-900 text-lg leading-relaxed whitespace-pre-wrap">
                  {user.researchProfile.phdFocus}
                </p>
              </div>
            )}

            {/* Primary Interests */}
            {user.researchProfile.primaryInterests.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full gradient-primary" />
                  <label className="text-lg font-bold text-neutral-900">
                    Primary Research Interests
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.researchProfile.primaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="badge-gradient px-4 py-2 text-sm font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Interests */}
            {user.researchProfile.secondaryInterests.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <label className="text-lg font-bold text-neutral-900">
                    Secondary Research Interests
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.researchProfile.secondaryInterests.map((interest) => (
                    <span
                      key={interest}
                      className="badge-secondary px-4 py-2 text-sm font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Laboratory Techniques */}
            {user.researchProfile.techniques.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <label className="text-lg font-bold text-neutral-900">
                    Laboratory Techniques
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.researchProfile.techniques.map((technique) => (
                    <span
                      key={technique}
                      className="badge-success px-4 py-2 text-sm font-semibold"
                    >
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Computational Skills */}
            {user.researchProfile.computationalSkills && user.researchProfile.computationalSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <label className="text-lg font-bold text-neutral-900">
                    Computational Skills
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.researchProfile.computationalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover-lift">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
              user.emailNotifications
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user.emailNotifications
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Email Notifications</p>
                  <p className="text-sm text-neutral-600">Receive updates via email</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                user.emailNotifications ? "bg-green-500" : "bg-gray-300"
              }`}>
                {user.emailNotifications && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
              user.notifyOnQueryComplete
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user.notifyOnQueryComplete
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Query Completion</p>
                  <p className="text-sm text-neutral-600">Get notified when queries finish</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                user.notifyOnQueryComplete ? "bg-blue-500" : "bg-gray-300"
              }`}>
                {user.notifyOnQueryComplete && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>

            <div className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
              user.notifyWeeklyDigest
                ? "bg-purple-50 border-purple-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  user.notifyWeeklyDigest
                    ? "bg-purple-500"
                    : "bg-gray-300"
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Weekly Digest</p>
                  <p className="text-sm text-neutral-600">Receive weekly research summaries</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                user.notifyWeeklyDigest ? "bg-purple-500" : "bg-gray-300"
              }`}>
                {user.notifyWeeklyDigest && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
