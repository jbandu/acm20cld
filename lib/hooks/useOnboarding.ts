import { useState, useEffect } from "react";

interface OnboardingState {
  hasSeenWelcome: boolean;
  hasCompletedFirstQuery: boolean;
  hasSetupProfile: boolean;
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    hasSeenWelcome: false,
    hasCompletedFirstQuery: false,
    hasSetupProfile: false,
  });

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem("onboarding");
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse onboarding state", e);
      }
    }
  }, []);

  const markOnboardingStep = (step: keyof OnboardingState) => {
    const newState = { ...state, [step]: true };
    setState(newState);
    localStorage.setItem("onboarding", JSON.stringify(newState));
  };

  const shouldShowWelcome = () => {
    return !state.hasSeenWelcome;
  };

  const resetOnboarding = () => {
    const initialState: OnboardingState = {
      hasSeenWelcome: false,
      hasCompletedFirstQuery: false,
      hasSetupProfile: false,
    };
    setState(initialState);
    localStorage.removeItem("onboarding");
  };

  return {
    ...state,
    markOnboardingStep,
    shouldShowWelcome,
    resetOnboarding,
  };
}
