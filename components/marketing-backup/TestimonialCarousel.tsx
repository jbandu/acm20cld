"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  institution: string;
  avatar: string;
  rating: 5;
  verified: boolean;
  field: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Found a crucial paper on CAR-T exhaustion that I had completely missed in my manual searches. This platform's multi-source search is a game-changer for comprehensive literature reviews.",
    author: "Dr. Sarah Martinez",
    title: "Associate Professor",
    institution: "Stanford Cancer Institute",
    avatar: "SM",
    rating: 5,
    verified: true,
    field: "Immunotherapy",
  },
  {
    id: "2",
    quote: "Saved 15 hours last week preparing for my lab meeting. The AI analysis identified connections between seemingly unrelated studies that sparked our next research direction.",
    author: "Dr. James Chen",
    title: "Postdoctoral Fellow",
    institution: "Johns Hopkins Medicine",
    avatar: "JC",
    rating: 5,
    verified: true,
    field: "Cancer Biology",
  },
  {
    id: "3",
    quote: "The intelligent question suggestions are incredible. They helped me identify knowledge gaps I hadn't considered and led to a successful R01 grant application.",
    author: "Dr. Emily Rodriguez",
    title: "Principal Investigator",
    institution: "MD Anderson Cancer Center",
    avatar: "ER",
    rating: 5,
    verified: true,
    field: "Precision Oncology",
  },
  {
    id: "4",
    quote: "Prepared my ASCO abstract in 2 hours instead of 2 days. The multi-LLM analysis caught nuances in the data that I missed on first reading. Absolutely essential tool now.",
    author: "Dr. Michael Thompson",
    title: "Senior Researcher",
    institution: "Memorial Sloan Kettering",
    avatar: "MT",
    rating: 5,
    verified: true,
    field: "Clinical Trials",
  },
  {
    id: "5",
    quote: "As a PhD student, this platform leveled the playing field. I can now conduct literature reviews as thoroughly as senior researchers, and the cost is very reasonable for academic use.",
    author: "Dr. Lisa Wang",
    title: "PhD Candidate",
    institution: "Harvard Medical School",
    avatar: "LW",
    rating: 5,
    verified: true,
    field: "Molecular Oncology",
  },
  {
    id: "6",
    quote: "The nightly research agent keeps me updated on the latest breakthroughs without spending hours on PubMed. It's like having a personal research assistant working 24/7.",
    author: "Dr. David Kumar",
    title: "Lab Director",
    institution: "Dana-Farber Cancer Institute",
    avatar: "DK",
    rating: 5,
    verified: true,
    field: "Translational Research",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-teal-100 border border-green-200 rounded-full text-green-700 text-sm font-semibold mb-6">
            Trusted by Researchers
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Scientists Are Saying
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from real researchers accelerating their work
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial cards */}
          <div className="relative h-96 lg:h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 lg:p-12 shadow-xl h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl text-gray-900 leading-relaxed mb-6 flex-1">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonials[currentIndex].avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-gray-900">
                          {testimonials[currentIndex].author}
                        </div>
                        {testimonials[currentIndex].verified && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonials[currentIndex].title}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {testimonials[currentIndex].institution}
                      </div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {testimonials[currentIndex].field}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-purple-300 hover:shadow-lg transition-all active:scale-95"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-purple-300 hover:shadow-lg transition-all active:scale-95"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-purple-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
