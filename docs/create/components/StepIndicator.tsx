"use client";
import { Check } from "lucide-react";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";

export default function StepIndicator() {
  const { activeStep, setActiveStep } = useWizard();
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-between">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setActiveStep(n)}
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
              activeStep === n
                ? "bg-emerald-600 text-white"
                : activeStep > n
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            )}
          >
            {activeStep > n ? <Check className="h-4 w-4" /> : n}
          </button>
        ))}
      </div>
    </div>
  );
}