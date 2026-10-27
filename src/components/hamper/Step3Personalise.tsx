import React from "react";
import {
  Sparkles,
  Gift,
  ArrowRight,
  ArrowLeft,
  Heart,
  Calendar,
  Check,
  FileText,
  Camera,
  Tag,
  PenTool,
} from "lucide-react";
import { CustomHamperPersonalisation, CustomHamperExtra } from "@/lib/types";

interface Step3PersonaliseProps {
  personalisation: CustomHamperPersonalisation;
  onChange: (updated: Partial<CustomHamperPersonalisation>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const WRAPPING_OPTIONS = [
  {
    id: "Classic",
    name: "Classic Wrapping",
    price: 0,
    desc: "Crisp natural parchment paper with gold foil stamp",
    badge: "Included",
  },
  {
    id: "Premium",
    name: "Premium Velvet Wrapping",
    price: 99,
    desc: "Soft-touch luxury paper with hand-finished embossed edges",
    badge: "+₹99",
  },
  {
    id: "Occasion",
    name: "Occasion-Themed Wrapping",
    price: 149,
    desc: "Festive or floral illustrated wrap tailored to your celebration",
    badge: "+₹149",
  },
];

export const RIBBON_COLORS = [
  {
    name: "Champagne",
    hex: "#E8D8C3",
    border: "#C8B499",
    tag: "Warm Gold",
  },
  {
    name: "Forest Green",
    hex: "#263B2D",
    border: "#1E3024",
    tag: "Signature Luxe",
  },
  {
    name: "Deep Burgundy",
    hex: "#58111A",
    border: "#3B0A11",
    tag: "Royal Velvet Luxe",
  },
  {
    name: "Muted Rose",
    hex: "#D7B3A8",
    border: "#B88E81",
    tag: "Gentle Romance",
  },
];

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Thank You",
  "Graduation",
  "Wedding",
  "Baby Celebration",
  "Just Because",
  "Festival",
  "Other",
];

export const AVAILABLE_EXTRAS: CustomHamperExtra[] = [
  {
    id: "calligraphy-card",
    name: "Handwritten Calligraphy Card",
    price: 49,
    description: "Inked by hand on deckled-edge cotton paper",
  },
  {
    id: "wax-seal",
    name: "Luxury Wax Seal Stamp",
    price: 79,
    description: "Botanical gold leaf wax emblem on greeting envelope",
  },
  {
    id: "photo-card",
    name: "Polaroid Photo Card",
    price: 99,
    description: "High-gloss vintage print with custom border",
  },
  {
    id: "gift-tag",
    name: "Handmade Botanical Gift Tag",
    price: 29,
    description: "Tied onto the satin ribbon with dry florals",
  },
];

export default function Step3Personalise({
  personalisation,
  onChange,
  onBack,
  onContinue,
}: Step3PersonaliseProps) {
  const toggleExtra = (extra: CustomHamperExtra) => {
    const current = personalisation.extras || [];
    const exists = current.some((e) => e.id === extra.id);
    if (exists) {
      onChange({ extras: current.filter((e) => e.id !== extra.id) });
    } else {
      onChange({ extras: [...current, extra] });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#263B2D]/10 text-[#263B2D] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 3 of 4</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#191C18]">
          Personalise It
        </h2>
        <p className="text-xs sm:text-sm text-[#191C18]/70 max-w-2xl font-light">
          Infuse your gift with warmth and individuality. Choose signature ribbons,
          gifting wraps, handwritten notes, and bespoke extras.
        </p>
      </div>

      {/* A. Occasion Selector */}
      <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#B8A28A]/15">
          <Calendar className="w-4 h-4 text-[#263B2D]" />
          <h3 className="font-serif text-lg font-medium text-[#191C18]">
            1. Select Occasion
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => {
            const isSelected = personalisation.occasion === occ;
            return (
              <button
                key={occ}
                type="button"
                onClick={() => onChange({ occasion: occ })}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#58111A] text-white shadow-xs"
                    : "bg-[#FAF5EE] text-[#191C18]/80 hover:bg-[#F4EBDD] hover:text-[#58111A] border border-[#B8A28A]/20"
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* B. Ribbon Colors */}
      <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/15">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-lg font-medium text-[#191C18]">
              2. Ribbon Colours
            </h3>
          </div>
          <span className="text-xs text-[#B8A28A] font-medium">Included Complimentary</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {RIBBON_COLORS.map((ribbon) => {
            const isSelected = personalisation.ribbonColor === ribbon.name;
            return (
              <div
                key={ribbon.name}
                onClick={() => onChange({ ribbonColor: ribbon.name })}
                className={`cursor-pointer rounded-2xl p-4 border transition-all text-center flex flex-col items-center gap-2.5 ${
                  isSelected
                    ? "bg-[#FAF5EE] border-[#263B2D] ring-2 ring-[#263B2D]/20 shadow-xs"
                    : "bg-white hover:bg-[#FAF5EE]/50 border-[#B8A28A]/25"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center border"
                  style={{ backgroundColor: ribbon.hex, borderColor: ribbon.border }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-xs" />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#191C18]">{ribbon.name}</h4>
                  <p className="text-[10px] text-[#191C18]/50">{ribbon.tag}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. Gift Wrapping Options */}
      <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/15">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-lg font-medium text-[#191C18]">
              3. Gift Wrapping
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {WRAPPING_OPTIONS.map((wrap) => {
            const isSelected = personalisation.giftWrap === wrap.id;
            return (
              <div
                key={wrap.id}
                onClick={() => onChange({ giftWrap: wrap.id })}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#FAF5EE] border-[#263B2D] ring-2 ring-[#263B2D]/20 shadow-xs"
                    : "bg-white hover:bg-[#FAF5EE]/50 border-[#B8A28A]/25"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-xs font-semibold text-[#191C18]">{wrap.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        wrap.price === 0
                          ? "bg-[#263B2D]/10 text-[#263B2D]"
                          : "bg-[#B8A28A]/20 text-[#191C18]"
                      }`}
                    >
                      {wrap.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#191C18]/65 font-light">{wrap.desc}</p>
                </div>

                <div className="pt-3 mt-2 flex items-center justify-between border-t border-[#B8A28A]/15 text-[11px]">
                  <span className={isSelected ? "text-[#263B2D] font-bold" : "text-[#191C18]/50"}>
                    {isSelected ? "Selected" : "Select Option"}
                  </span>
                  <span className="font-bold text-[#191C18]">
                    {wrap.price === 0 ? "Free" : `₹${wrap.price}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* D. Gift Message Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#B8A28A]/15">
          <FileText className="w-4 h-4 text-[#263B2D]" />
          <h3 className="font-serif text-lg font-medium text-[#191C18]">
            4. Personal Message Card
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1.5">
              From (Sender Name)
            </label>
            <input
              type="text"
              value={personalisation.senderName || ""}
              onChange={(e) => onChange({ senderName: e.target.value })}
              placeholder="Your name or family"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF5EE] rounded-xl border border-[#B8A28A]/30 focus:border-[#263B2D] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1.5">
              To (Recipient Name)
            </label>
            <input
              type="text"
              value={personalisation.recipientName || ""}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder="e.g. Ananya, Mom, or Alex"
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF5EE] rounded-xl border border-[#B8A28A]/30 focus:border-[#263B2D] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#191C18]">
              Card Message
            </label>
            <span className="text-[11px] text-[#191C18]/50">
              {(personalisation.cardMessage || "").length} / 300 characters
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={300}
            value={personalisation.cardMessage || ""}
            onChange={(e) => onChange({ cardMessage: e.target.value })}
            placeholder="Write words that make them smile... e.g. Wishing you a day as brilliant, bright, and heartwarming as you are!"
            className="w-full p-3.5 text-xs bg-[#FAF5EE] rounded-xl border border-[#B8A28A]/30 focus:border-[#263B2D] focus:outline-hidden font-light leading-relaxed"
          />
        </div>
      </div>

      {/* E. Optional Extras */}
      <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/15">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-lg font-medium text-[#191C18]">
              5. Optional Luxury Extras
            </h3>
          </div>
          <span className="text-xs text-[#B8A28A]">Hand-Finished</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {AVAILABLE_EXTRAS.map((extra) => {
            const isChecked = (personalisation.extras || []).some((e) => e.id === extra.id);
            return (
              <label
                key={extra.id}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isChecked
                    ? "bg-[#FAF5EE] border-[#263B2D] shadow-2xs"
                    : "bg-white hover:bg-[#FAF5EE]/40 border-[#B8A28A]/25"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleExtra(extra)}
                    className="mt-1 rounded text-[#263B2D] focus:ring-[#263B2D]"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#191C18]">{extra.name}</h4>
                    <p className="text-[11px] text-[#191C18]/60 font-light">{extra.description}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#263B2D] shrink-0 pl-2">
                  +₹{extra.price}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-[#B8A28A]/20 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#191C18] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-8 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#58111A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group cursor-pointer border border-[#7A1B28]/40"
        >
          <span>Review Your Hamper</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
