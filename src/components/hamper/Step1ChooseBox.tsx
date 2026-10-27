import React from "react";
import { Check, ArrowRight, Sparkles, Box, Info } from "lucide-react";
import { HamperBox } from "@/lib/types";

interface Step1ChooseBoxProps {
  boxes: HamperBox[];
  selectedBox: HamperBox | null;
  onSelectBox: (box: HamperBox) => void;
  onContinue: () => void;
}

export default function Step1ChooseBox({
  boxes,
  selectedBox,
  onSelectBox,
  onContinue,
}: Step1ChooseBoxProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#263B2D]/10 text-[#263B2D] text-xs font-semibold uppercase tracking-wider">
          <Box className="w-3.5 h-3.5" />
          <span>Step 1 of 4</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#191C18]">
          Choose Your Hamper Box
        </h2>
        <p className="text-sm text-[#191C18]/70 max-w-2xl font-light">
          Every great gift starts with a handcrafted foundation. Select a keepsake box
          that matches the size and spirit of your celebration.
        </p>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {boxes.map((box) => {
          const isSelected = selectedBox?.id === box.id;

          return (
            <div
              key={box.id}
              onClick={() => onSelectBox(box)}
              className={`group cursor-pointer rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-[#58111A] shadow-xl shadow-[#58111A]/10 ring-2 ring-[#58111A]/30 scale-[1.01]"
                  : "bg-white/80 hover:bg-white border-[#58111A]/20 hover:border-[#58111A] hover:shadow-lg hover:shadow-[#58111A]/10"
              }`}
            >
              {/* Selection Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#58111A] text-white scale-110 shadow-sm"
                      : "bg-[#FAF5EE] text-transparent border border-[#58111A]/30 group-hover:border-[#58111A]"
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Box Image */}
              <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF5EE] mb-4 border border-[#B8A28A]/15 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {box.capacity && (
                  <span className="absolute bottom-3 left-3 bg-[#191C18]/80 text-[#FFF9F0] text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {box.capacity}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#191C18]">
                      {box.name}
                    </h3>
                    <span className="text-base font-bold text-[#263B2D] shrink-0">
                      ₹{box.price}
                    </span>
                  </div>

                  {box.dimensions && (
                    <p className="text-[11px] font-medium text-[#B8A28A] tracking-wider uppercase mt-0.5">
                      {box.dimensions}
                    </p>
                  )}

                  <p className="text-xs text-[#191C18]/70 mt-2 line-clamp-2 font-light">
                    {box.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#B8A28A]/15 mt-3 flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold transition-colors ${
                      isSelected ? "text-[#263B2D]" : "text-[#191C18]/60 group-hover:text-[#191C18]"
                    }`}
                  >
                    {isSelected ? "Selected Box" : "Select this Box"}
                  </span>
                  <span className="text-[11px] text-[#B8A28A]">
                    Artisanal Finish
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#B8A28A]/25 flex items-center gap-3 text-xs text-[#191C18]/80">
        <Info className="w-5 h-5 text-[#263B2D] shrink-0" />
        <span>
          All hamper boxes include crinkled paper cushioning, protective tissue wrapping, and our signature gold embossed logo.
        </span>
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedBox}
          className="px-8 py-4 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-[#B8A28A]/50 text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#58111A]/30 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-all flex items-center gap-2 group cursor-pointer disabled:cursor-not-allowed border border-[#7A1B28]/40"
        >
          <span>Continue to Add Favourites</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
