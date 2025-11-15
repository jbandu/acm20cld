"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  const trustElements = [
    "14-day free trial",
    "No credit card required",
    "Full platform access",
    "Cancel anytime",
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Start Finding Breakthroughs
            <br />
            Faster Today
          </h2>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-white/90 mb-4">
            Join 2,847 researchers accelerating their work
          </p>

          {/* Trust elements */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-10">
            {trustElements.map((element, index) => (
              <motion.div
                key={element}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                className="flex items-center gap-2 text-cyan-300 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {element}
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-5 bg-white text-purple-600 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Create Free Account
            </motion.a>

            <motion.a
              href="/contact/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/50 text-white text-lg font-bold rounded-xl hover:bg-white/20 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Schedule Demo
            </motion.a>
          </div>

          {/* Subtext */}
          <p className="text-white/70 text-sm mb-8">
            No credit card required • Full access for 14 days • Cancel anytime
          </p>

          {/* Support links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <span>Questions?</span>
            <a
              href="/contact"
              className="inline-flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat with us
            </a>
            <span className="text-white/40">or</span>
            <a
              href="/docs"
              className="inline-flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Read documentation
            </a>
          </div>
        </motion.div>

        {/* Stats bar at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 pt-12 border-t border-white/20"
        >
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">60x</div>
              <div className="text-white/70 text-sm">Faster Research</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">127K</div>
              <div className="text-white/70 text-sm">Hours Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">247</div>
              <div className="text-white/70 text-sm">Publications</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
