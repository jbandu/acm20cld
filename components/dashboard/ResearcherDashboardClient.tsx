"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { WelcomeFlow } from "@/components/onboarding/WelcomeFlow";
import { WelcomeWidget } from "@/components/dashboard/WelcomeWidget";

interface ResearcherDashboardClientProps {
  userName: string;
  hasQueries: boolean;
  createdDaysAgo: number;
}

export function ResearcherDashboardClient({ 
  userName, 
  hasQueries,
  createdDaysAgo 
}: ResearcherDashboardClientProps) {
  const { hasSeenWelcome, markOnboardingStep, shouldShowWelcome } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if we should show welcome flow
    if (shouldShowWelcome()) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    markOnboardingStep("hasSeenWelcome");
  };

  return (
    <>
      {/* Welcome Flow Modal */}
      <WelcomeFlow 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        userName={userName}
      />

      {/* Welcome Widget */}
      <WelcomeWidget 
        hasQueries={hasQueries}
        createdDaysAgo={createdDaysAgo}
      />
    </>
  );
}
