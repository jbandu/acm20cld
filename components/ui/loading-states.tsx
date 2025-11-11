"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, FileText, TrendingUp } from "lucide-react";

/**
 * Beautiful loading state for intelligent question suggestions
 * Features animated sparkles and gradient pulses
 */
export function LoadingIntelligentSuggestions() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="p-3 rounded-xl gradient-primary"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">
            Generating Intelligent Suggestions
          </h3>
          <p className="text-sm text-neutral-600">
            Analyzing your research patterns...
          </p>
        </div>
      </motion.div>

      {/* Animated question cards */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="bg-white rounded-xl border-2 border-purple-200 p-6 hover-lift"
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-primary" />
            </motion.div>
            <div className="flex-1 space-y-3">
              {/* Title skeleton */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
                className="h-5 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-4/5"
              />
              {/* Description skeleton */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2 + 0.1,
                }}
                className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-full"
              />
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2 + 0.2,
                }}
                className="h-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-3/4"
              />
            </div>
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map((tagIndex) => (
              <motion.div
                key={tagIndex}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2 + tagIndex * 0.1,
                }}
                className="h-6 w-20 bg-purple-100 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Beautiful loading state for query results
 * Features skeleton cards with gradient animations
 */
export function LoadingQueryResults() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200"
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"
          >
            <Search className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1 space-y-3">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-3/4"
            />
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="h-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-1/2"
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <motion.p
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-sm text-center text-purple-600 font-medium mt-4"
        >
          Searching across multiple databases...
        </motion.p>
      </motion.div>

      {/* Result cards skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover-lift"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
                className="w-14 h-14 rounded-xl bg-gradient-card flex items-center justify-center"
              >
                <FileText className="w-7 h-7 text-purple-500" />
              </motion.div>
              <div className="flex-1 space-y-3">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  className="h-6 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-full"
                />
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2 + 0.1,
                  }}
                  className="h-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded w-2/3"
                />
              </div>
            </div>

            {/* Content lines */}
            <div className="space-y-2 mb-4">
              {[0, 1, 2, 3].map((lineIndex) => (
                <motion.div
                  key={lineIndex}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2 + lineIndex * 0.1,
                  }}
                  className="h-4 bg-gray-200 rounded"
                  style={{
                    width: lineIndex === 3 ? "60%" : "100%",
                  }}
                />
              ))}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              {[0, 1, 2].map((metaIndex) => (
                <motion.div
                  key={metaIndex}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2 + metaIndex * 0.15,
                  }}
                  className="h-5 w-24 bg-purple-100 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact loading spinner with gradient
 */
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`${sizeClasses[size]} rounded-full border-4 border-purple-200 border-t-purple-600`}
    />
  );
}

/**
 * Loading state for data analytics/stats
 */
export function LoadingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              className="w-12 h-12 rounded-xl bg-gradient-card"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            >
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </motion.div>
          </div>

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            className="h-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg w-2/3 mb-2"
          />

          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2 + 0.1,
            }}
            className="h-5 bg-gray-200 rounded w-1/2"
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Inline loading indicator with text
 */
export function LoadingInline({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-5 h-5 rounded-full border-2 border-purple-200 border-t-purple-600"
      />
      <motion.span
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-sm text-neutral-600 font-medium"
      >
        {text}
      </motion.span>
    </div>
  );
}
