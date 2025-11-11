"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step1Welcome } from "@/components/onboarding/Step1Welcome";
import { Step2Education } from "@/components/onboarding/Step2Education";
import { Step3Research } from "@/components/onboarding/Step3Research";
import { Step5Projects } from "@/components/onboarding/Step5Projects";
import { Step6Preferences } from "@/components/onboarding/Step6Preferences";

const TOTAL_STEPS = 5; // Skipping Step 4 (LinkedIn) for now

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepData, setStepData] = useState<Record<number, any>>({
    1: {},
    2: {},
    3: {},
    5: {},
    6: {},
  });

  // Load existing progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        const response = await fetch("/api/onboarding/status");
        if (response.ok) {
          const data = await response.json();
          if (data.onboardingComplete) {
            // Already completed, redirect to dashboard
            router.push("/researcher/query/new");
          } else if (data.currentStep > 0) {
            // Resume from last step
            setCurrentStep(Math.min(data.currentStep + 1, TOTAL_STEPS));
          }
        }
      } catch (err) {
        console.error("Failed to load onboarding progress:", err);
      }
    }
    loadProgress();
  }, [router]);

  const handleStepUpdate = (step: number, data: any) => {
    setStepData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const saveStep = async (step: number, data: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding/step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step,
          data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save step");
      }

      const result = await response.json();

      // If onboarding is complete, redirect
      if (result.complete) {
        router.push("/researcher/query/new");
      }

      return true;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Map display steps to actual API steps (since we're skipping step 4)
    const apiStep = currentStep >= 4 ? currentStep + 1 : currentStep;
    const data = stepData[apiStep];

    const saved = await saveStep(apiStep, data);
    if (saved) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    // Map display steps to actual API steps
    const apiStep = currentStep >= 4 ? currentStep + 1 : currentStep;

    const props = {
      data: stepData[apiStep],
      onUpdate: (data: any) => handleStepUpdate(apiStep, data),
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <Step1Welcome {...props} />;
      case 2:
        return <Step2Education {...props} />;
      case 3:
        return <Step3Research {...props} />;
      case 4:
        return <Step5Projects {...props} />;
      case 5:
        return <Step6Preferences {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[
            { num: 1, label: "Welcome" },
            { num: 2, label: "Education" },
            { num: 3, label: "Research" },
            { num: 4, label: "Projects" },
            { num: 5, label: "Preferences" },
          ].map((step) => (
            <div
              key={step.num}
              className={`flex flex-col items-center ${
                step.num === currentStep
                  ? "text-blue-600"
                  : step.num < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step.num === currentStep
                    ? "border-blue-600 bg-blue-50"
                    : step.num < currentStep
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {step.num < currentStep ? (
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{step.num}</span>
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderStep()
          )}
        </div>

        {/* Skip Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/researcher/query/new")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip onboarding for now
          </button>
        </div>
      </div>
    </div>
  );
}
