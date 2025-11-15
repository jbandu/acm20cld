"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: { text: string; href: string };
  highlighted: boolean;
  badge?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Academic",
    price: "Free",
    period: "",
    description: "Perfect for students and early-career researchers",
    features: [
      "25 queries per month",
      "1 AI model (Claude)",
      "PubMed access only",
      "Basic support",
      "Export to PDF",
      "Community forums",
    ],
    cta: { text: "Start Free", href: "/register?plan=academic" },
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For active researchers and lab groups",
    features: [
      "Unlimited queries",
      "3 AI models (Claude, GPT-4, Gemini)",
      "All 5 databases",
      "Priority support",
      "Export to all formats",
      "Team sharing (up to 5)",
      "Nightly research agent",
      "Knowledge graph access",
      "API access",
    ],
    cta: { text: "Start 14-Day Trial", href: "/register?plan=professional" },
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For institutions and large research teams",
    features: [
      "Everything in Professional",
      "Private deployment option",
      "SSO/SAML integration",
      "Custom AI model training",
      "Dedicated support team",
      "Volume discounts",
      "Unlimited team members",
      "Advanced analytics",
      "Custom integrations",
      "SLA guarantees",
    ],
    cta: { text: "Contact Sales", href: "/contact/sales" },
    highlighted: false,
  },
];

export function PricingCards() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-6">
            Research-Friendly Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Accelerate Your Research
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Without Breaking the Budget
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Choose the plan that fits your research needs
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            50% off for .edu email addresses
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    {tier.badge}
                  </div>
                </div>
              )}

              <div
                className={`bg-white rounded-2xl p-8 h-full flex flex-col transition-all duration-300 ${
                  tier.highlighted
                    ? "border-2 border-purple-500 shadow-2xl scale-105 lg:scale-110"
                    : "border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl"
                }`}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                    {tier.period && (
                      <span className="text-gray-600 font-medium">{tier.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 mb-8">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className={`flex-shrink-0 w-5 h-5 ${
                            tier.highlighted ? "text-purple-600" : "text-green-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href={tier.cta.href}
                  className={`block text-center px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                      : "bg-white border-2 border-gray-300 text-gray-900 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {tier.cta.text}
                </a>

                {tier.name === "Professional" && (
                  <div className="text-center text-sm text-gray-600 mt-3">
                    No credit card required • Cancel anytime
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            {showComparison ? "Hide" : "Show"} detailed comparison table
            <svg
              className={`w-4 h-4 transition-transform ${
                showComparison ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              14-day money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payment processing
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Volume discounts available
            </div>
          </div>

          <p className="text-gray-600">
            Questions about pricing?{" "}
            <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">
              Contact us
            </a>{" "}
            or{" "}
            <a href="/docs/pricing" className="text-purple-600 hover:text-purple-700 font-medium">
              view detailed pricing FAQ
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
