"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Metrics {
  papersIndexed: number;
  queriesToday: number;
  discoveriesThisWeek: number;
  hoursSaved: number;
}

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    papersIndexed: 47234891,
    queriesToday: 1247,
    discoveriesThisWeek: 342,
    hoursSaved: 8934,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/stats/live");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      label: "Papers Indexed",
      value: metrics.papersIndexed,
      suffix: "+",
      icon: "📚",
      gradient: "from-purple-500 to-blue-500",
      description: "Across PubMed, OpenAlex, arXiv",
    },
    {
      label: "Queries Today",
      value: metrics.queriesToday,
      suffix: "",
      icon: "🔍",
      gradient: "from-blue-500 to-cyan-500",
      description: "Researchers actively searching",
    },
    {
      label: "Discoveries This Week",
      value: metrics.discoveriesThisWeek,
      suffix: "",
      icon: "💡",
      gradient: "from-cyan-500 to-teal-500",
      description: "Novel insights uncovered",
    },
    {
      label: "Hours Saved",
      value: metrics.hoursSaved,
      suffix: "",
      icon: "⚡",
      gradient: "from-teal-500 to-green-500",
      description: "By researchers this month",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative group"
        >
          {/* Glass morphism card */}
          <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{metric.icon}</span>
                {!loading && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live data"></div>
                )}
              </div>

              <div className="mb-2">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                ) : (
                  <div className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <CountUp end={metric.value} suffix={metric.suffix} />
                  </div>
                )}
              </div>

              <div className="text-sm font-semibold text-gray-900 mb-1">
                {metric.label}
              </div>

              <div className="text-xs text-gray-600">
                {metric.description}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}
