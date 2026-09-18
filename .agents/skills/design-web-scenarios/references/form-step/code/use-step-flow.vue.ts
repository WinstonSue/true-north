import { ref } from "vue";

type ValidateStep = () => Promise<void> | void;

export function useStepFlow(maxStep: number, validateStep?: ValidateStep) {
  const currentStep = ref(0);

  async function next() {
    await validateStep?.();
    currentStep.value = Math.min(currentStep.value + 1, maxStep);
  }

  function prev() {
    currentStep.value = Math.max(currentStep.value - 1, 0);
  }

  function reset() {
    currentStep.value = 0;
  }

  function finish() {
    currentStep.value = maxStep;
  }

  return {
    currentStep,
    next,
    prev,
    reset,
    finish,
  };
}
