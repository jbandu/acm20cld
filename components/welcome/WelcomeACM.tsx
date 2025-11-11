"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function WelcomeACM() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-blue-50/30 to-purple-50/50 flex items-center justify-center px-6 py-12">
      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Branding Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-violet-100/80 shadow-md border border-violet-200/60">
            {/* Circular Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {/* Text */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">ACM Biolabs</span>
              <span className="text-xs text-gray-500 font-medium">Research Intelligence</span>
            </div>
          </div>

          {/* Welcome Text - Hero Section */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to ACM 2.0
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Your AI Research Intelligence Platform
            </p>
          </div>

          {/* CEO Message Card */}
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">MN</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Dear Research Team,</h2>

                <div className="space-y-3 text-gray-600 leading-relaxed">
                  <p>
                    Welcome to ACM 2.0, your next-generation research intelligence platform. We've built this tool to empower you with AI-driven insights, enabling faster discoveries and smarter research decisions.
                  </p>

                  <p>
                    Our platform combines cutting-edge natural language processing with comprehensive database access, giving you the ability to explore research landscapes like never before. Whether you're tracking the latest publications, analyzing trends, or discovering connections, ACM 2.0 is here to accelerate your work.
                  </p>

                  <p>
                    I'm excited to see how this platform will transform the way we conduct research. Your feedback and insights will be invaluable as we continue to evolve and improve.
                  </p>

                  <p>Let's push the boundaries of what's possible in biomedical research together.</p>
                </div>

                {/* Signature */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">Madhavan Nallani</p>
                  <p className="text-sm text-gray-500">CEO, ACM Biolabs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/researcher/query/new"
              className="px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-full border-2 border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 shadow-md"
            >
              Try Demo Query
            </Link>
          </div>

          {/* Mini Benefit Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Get your first insights in under 60 seconds
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
