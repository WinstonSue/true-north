import { useState } from "react";

type ValidateStep = () => Promise<void> | void;

export function useStepFlow(maxStep: number, validateStep?: ValidateStep) {
  const [currentStep, setCurrentStep] = useState(0);

  async function next() {
    await validateStep?.();
    setCurrentStep((step) => Math.min(step + 1, maxStep));
  }

  function prev() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function reset() {
    setCurrentStep(0);
  }

  function finish() {
    setCurrentStep(maxStep);
  }

  return {
    currentStep,
    next,
    prev,
    reset,
    finish,
  };
}
