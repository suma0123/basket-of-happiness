import React from "react";
import { Check, Box, ShoppingBag, Sparkles, FileCheck } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
}

const steps = [
  { id: 1, title: "Choose Your Box", short: "Box", icon: Box },
  { id: 2, title: "Add Your Favourites", short: "Products", icon: ShoppingBag },
  { id: 3, title: "Personalise It", short: "Personalise", icon: Sparkles },
  { id: 4, title: "Review Your Hamper", short: "Review", icon: FileCheck },
];

export default function StepProgress({
  currentStep,
  onStepClick,
  canNavigateToStep,
}: StepProgressProps) {
  return (
    <div className="w-full bg-[#FFF9F0] border-y border-[#B8A28A]/20 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Desktop & Tablet Progress Bar */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5DACD] -translate-y-1/2 z-0" />
          {/* Active Fill Line */}
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-[#263B2D] -translate-y-1/2 transition-all duration-500 z-0"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = canNavigateToStep(step.id);
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`relative z-10 flex flex-col items-center group transition-all ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-medium text-xs shadow-sm ${
                    isCompleted
                      ? "bg-[#263B2D] text-white"
                      : isCurrent
                      ? "bg-[#263B2D] text-white ring-4 ring-[#58111A]/30 scale-110 shadow-sm"
                      : "bg-[#FFF9F0] text-[#191C18]/60 border-2 border-[#B8A28A]/40 group-hover:border-[#263B2D]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <span
                    className={`block text-xs font-semibold tracking-wider uppercase transition-colors ${
                      isCurrent
                        ? "text-[#263B2D]"
                        : isCompleted
                        ? "text-[#191C18]"
                        : "text-[#191C18]/50"
                    }`}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={`block text-xs font-medium font-serif transition-colors ${
                      isCurrent
                        ? "text-[#191C18]"
                        : isCompleted
                        ? "text-[#191C18]/80"
                        : "text-[#191C18]/40"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Compact Progress Bar */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#263B2D] text-white flex items-center justify-center font-bold text-xs">
              {currentStep}
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8A28A]">
                Step {currentStep} of 4
              </p>
              <h3 className="font-serif text-sm font-semibold text-[#191C18]">
                {steps[currentStep - 1]?.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => canNavigateToStep(step.id) && onStepClick(step.id)}
                disabled={!canNavigateToStep(step.id)}
                aria-label={`Go to step ${step.id}`}
                className={`h-2 rounded-full transition-all ${
                  step.id === currentStep
                    ? "w-6 bg-[#263B2D]"
                    : step.id < currentStep
                    ? "w-2.5 bg-[#263B2D]/70"
                    : "w-2.5 bg-[#E5DACD]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
