import Link from "next/link";
import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50/50 via-blue-50/30 to-purple-50/50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Branding Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-violet-100/80 shadow-md border border-violet-200/60">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">ACM Biolabs</span>
              <span className="text-xs text-gray-500 font-medium">Research Intelligence</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            AI-Powered Research Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-3xl mx-auto mb-10">
            Enterprise-grade platform combining multi-source search, AI insights, and knowledge graphs to accelerate biomedical research.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-violet-700 font-semibold rounded-full border-2 border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 shadow-md"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Card 1: Multi-Source Search */}
          <div className="group relative bg-gradient-to-br from-purple-50/80 to-blue-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-purple-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                Multi-Source Search
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Query OpenAlex, PubMed, Google Patents, and more in a single unified search. Save time and discover connections across databases.
              </p>
            </div>
          </div>

          {/* Card 2: AI-Powered Insights */}
          <div className="group relative bg-gradient-to-br from-cyan-50/80 to-blue-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-cyan-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get intelligent summaries and analysis from Claude, GPT-4, and other leading LLMs. Extract key findings instantly.
              </p>
            </div>
          </div>

          {/* Card 3: Knowledge Graphs */}
          <div className="group relative bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-pink-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 shadow-md">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                Knowledge Graphs
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Visualize relationships between research concepts, papers, and discoveries. Uncover hidden connections in your field.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex justify-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Trusted by leading biomedical research teams
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
