"use client";

import { motion } from "framer-motion";

export function TrustBar() {
  const metrics = [
    { label: "Publications Facilitated", value: "247", icon: "📄" },
    { label: "Active Researchers", value: "2,847", icon: "👨‍🔬" },
    { label: "Breakthroughs This Year", value: "89", icon: "💡" },
    { label: "Hours Saved Collectively", value: "127K", icon: "⏱️" },
  ];

  const badges = [
    { name: "HIPAA Compliant", icon: "🔒", tooltip: "Health data protection certified" },
    { name: "SOC 2 Type II", icon: "✓", tooltip: "Security & compliance audited" },
    { name: "256-bit Encryption", icon: "🛡️", tooltip: "Enterprise-grade security" },
    { name: "ISO 27001", icon: "⭐", tooltip: "Information security certified" },
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Research Impact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{badge.name}</span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                {badge.tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner logos section (optional - can add actual logos) */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-sm font-semibold text-gray-500 mb-4">
            Trusted by Leading Cancer Research Institutions
          </div>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-60 hover:opacity-100 transition-opacity">
            <div className="text-gray-600 font-bold text-lg">ACM Biolabs</div>
            {/* Add more partner logos/names here */}
          </div>
        </div>
      </div>
    </section>
  );
}
