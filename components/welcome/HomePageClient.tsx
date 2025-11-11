"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/LoginModal";

export function HomePageClient() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50/50 via-blue-50/30 to-purple-50/50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Branding Pill */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center gap-4 px-6 py-3.5 rounded-full bg-violet-100/80 shadow-md border border-violet-200/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">A</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-base">ACM Biolabs</span>
                <span className="text-sm text-gray-500 font-medium">Research Intelligence</span>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
              AI-Powered Research Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto mb-12">
              Enterprise-grade platform combining multi-source search, AI insights, and knowledge graphs to accelerate biomedical research.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-12 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Sign In
              </button>
              <Link
                href="/register"
                className="px-12 py-5 bg-white text-violet-800 text-lg font-semibold rounded-full border-2 border-violet-400 hover:border-violet-500 hover:bg-violet-50 transition-all duration-200 shadow-lg"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
            {/* Card 1: Multi-Source Search */}
            <div className="group relative bg-gradient-to-br from-purple-50/80 to-blue-50/80 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-purple-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-8 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors">
                  Multi-Source Search
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Query OpenAlex, PubMed, Google Patents, and more in a single unified search. Save time and discover connections across databases.
                </p>
              </div>
            </div>

            {/* Card 2: AI-Powered Insights */}
            <div className="group relative bg-gradient-to-br from-cyan-50/80 to-blue-50/80 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-cyan-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-8 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-700 transition-colors">
                  AI-Powered Insights
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Get intelligent summaries and analysis from Claude, GPT-4, and other leading LLMs. Extract key findings instantly.
                </p>
              </div>
            </div>

            {/* Card 3: Knowledge Graphs */}
            <div className="group relative bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden border border-pink-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -mr-12 -mt-12" />

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-8 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-700 transition-colors">
                  Knowledge Graphs
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Visualize relationships between research concepts, papers, and discoveries. Uncover hidden connections in your field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
