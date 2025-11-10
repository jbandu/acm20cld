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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          ACM Biolabs Research Intelligence Platform
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Enterprise-grade research intelligence powered by AI.
          Search across multiple sources, extract insights, and build knowledge graphs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Multi-Source Search</h3>
            <p className="text-gray-600">
              Query OpenAlex, PubMed, Google Patents, and more in one search
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Get summaries and analysis from multiple LLMs including Claude and GPT-4
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Knowledge Graphs</h3>
            <p className="text-gray-600">
              Visualize connections between research concepts and discoveries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
