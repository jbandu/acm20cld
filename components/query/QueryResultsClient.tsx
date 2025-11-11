"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { FirstQuerySuccess } from "@/components/celebrations/FirstQuerySuccess";

interface QueryResultsClientProps {
  isCompleted: boolean;
  resultsCount: number;
  startedAt: Date;
  completedAt: Date | null;
  queryCount: number;
}

export function QueryResultsClient({ 
  isCompleted,
  resultsCount,
  startedAt,
  completedAt,
  queryCount
}: QueryResultsClientProps) {
  const { hasCompletedFirstQuery, markOnboardingStep } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Show celebration if this is first query AND it's completed
    if (isCompleted && queryCount === 1 && !hasCompletedFirstQuery) {
      setShowCelebration(true);
      markOnboardingStep("hasCompletedFirstQuery");
    }
  }, [isCompleted, queryCount, hasCompletedFirstQuery, markOnboardingStep]);

  const timeTaken = completedAt && startedAt 
    ? Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000)
    : 20;

  return (
    <FirstQuerySuccess
      isOpen={showCelebration}
      onClose={() => setShowCelebration(false)}
      resultsCount={resultsCount}
      timeTaken={timeTaken}
    />
  );
}
