import React, { useState } from "react";
import { AlertCircle, CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react";

export type BudgetTier = "all" | "under-500" | "500-1000" | "1000-2000" | "2000-plus" | "custom";

interface BudgetSelectorProps {
  currentTotal: number;
  selectedTier: BudgetTier;
  customBudget: number;
  onSelectTier: (tier: BudgetTier) => void;
  onSetCustomBudget: (amount: number) => void;
}

export default function BudgetSelector({
  currentTotal,
  selectedTier,
  customBudget,
  onSelectTier,
  onSetCustomBudget,
}: BudgetSelectorProps) {
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customInput, setCustomInput] = useState(customBudget > 0 ? String(customBudget) : "2500");

  const getTargetMax = (): number | null => {
    switch (selectedTier) {
      case "under-500":
        return 500;
      case "500-1000":
        return 1000;
      case "1000-2000":
        return 2000;
      case "2000-plus":
        return null; // open-ended luxury
      case "custom":
        return customBudget > 0 ? customBudget : null;
      default:
        return null;
    }
  };

  const targetMax = getTargetMax();
  const isExceeded = targetMax !== null && currentTotal > targetMax;
  const progressPercent = targetMax !== null ? Math.min(100, (currentTotal / targetMax) * 100) : 0;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      onSetCustomBudget(val);
      setIsEditingCustom(false);
      onSelectTier("custom");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#B8A28A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Gifting Assistant</span>
          </div>
          <h3 className="font-serif text-lg font-medium text-[#191C18]">
            What&apos;s Your Gifting Budget?
          </h3>
        </div>

        {targetMax !== null && (
          <div className="text-right">
            <span className="text-xs text-[#191C18]/60">Target:</span>{" "}
            <span className="text-xs font-bold text-[#263B2D]">₹{targetMax}</span>
          </div>
        )}
      </div>

      {/* Budget Tier Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectTier("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedTier === "all"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          No Limit
        </button>
        <button
          type="button"
          onClick={() => onSelectTier("under-500")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedTier === "under-500"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          Under ₹500
        </button>
        <button
          type="button"
          onClick={() => onSelectTier("500-1000")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedTier === "500-1000"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          ₹500–₹1,000
        </button>
        <button
          type="button"
          onClick={() => onSelectTier("1000-2000")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedTier === "1000-2000"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          ₹1,000–₹2,000
        </button>
        <button
          type="button"
          onClick={() => onSelectTier("2000-plus")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedTier === "2000-plus"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          ₹2,000+ (Luxury)
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectTier("custom");
            setIsEditingCustom(true);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
            selectedTier === "custom"
              ? "bg-[#263B2D] text-white shadow-xs"
              : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] border border-[#B8A28A]/20"
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{customBudget > 0 ? `Custom: ₹${customBudget}` : "Custom Budget"}</span>
        </button>
      </div>

      {/* Custom Budget Inline Input */}
      {isEditingCustom && (
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#191C18]/50">
              ₹
            </span>
            <input
              type="number"
              min={100}
              step={50}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-[#263B2D] focus:outline-hidden focus:ring-1 focus:ring-[#263B2D] bg-[#FFF9F0]"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#263B2D] text-white text-xs font-semibold rounded-xl hover:bg-[#1A281E]"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => setIsEditingCustom(false)}
            className="text-xs text-[#191C18]/60 hover:text-[#191C18]"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Progress Bar (if budget cap exists) */}
      {targetMax !== null && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#191C18]/70">
              Current Hamper: <strong>₹{currentTotal}</strong>
            </span>
            <span className={isExceeded ? "text-amber-700 font-bold" : "text-[#263B2D] font-medium"}>
              {progressPercent.toFixed(0)}% of target
            </span>
          </div>

          <div className="w-full bg-[#E5DACD] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isExceeded ? "bg-amber-600" : "bg-[#263B2D]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Friendly Budget Warning if exceeded */}
      {isExceeded && targetMax !== null && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Hamper exceeds your selected budget of ₹{targetMax} by ₹{currentTotal - targetMax}.
            </p>
            <p className="text-[11px] text-amber-800/90">
              You can still proceed! Or adjust quantities, choose another box size, or raise your budget preference above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
