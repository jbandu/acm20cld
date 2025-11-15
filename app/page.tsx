import { auth } from "@/lib/auth/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  const features = [
    {
      icon: "🔍",
      title: "Multi-Source Search",
      description: "Search across PubMed, OpenAlex, arXiv, Patents, and Clinical Trials simultaneously",
    },
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Get insights from multiple AI models analyzing your research queries",
    },
    {
      icon: "💡",
      title: "Intelligent Suggestions",
      description: "Receive personalized research questions based on your interests and recent work",
    },
    {
      icon: "📊",
      title: "Query Refinement",
      description: "AI optimizes your queries for better, more relevant search results",
    },
    {
      icon: "🔗",
      title: "Knowledge Graph",
      description: "Explore connections between concepts, papers, and research areas",
    },
    {
      icon: "📈",
      title: "Cost Tracking",
      description: "Monitor query costs and research spending for your team",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ACM Biolabs
              </h1>
              <p className="text-gray-600 text-sm mt-1">Research Intelligence Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 text-gray-700 font-semibold hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Research Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Accelerate your cancer research with multi-source search, AI analysis, and intelligent query suggestions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold text-lg rounded-xl hover:border-purple-300 hover:bg-gray-50 transition-all"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Research?
          </h3>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join ACM Biolabs researchers using AI-powered intelligence for faster, more comprehensive research.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-lg"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/50 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} ACM Biolabs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
