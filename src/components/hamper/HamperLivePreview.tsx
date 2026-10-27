import React, { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Gift,
  ArrowRight,
  Box,
  Heart,
  Check,
  X,
} from "lucide-react";
import {
  HamperBox,
  CustomHamperProductItem,
  CustomHamperPersonalisation,
} from "@/lib/types";

interface HamperLivePreviewProps {
  box: HamperBox | null;
  selectedItems: CustomHamperProductItem[];
  personalisation: CustomHamperPersonalisation;
  boxPrice: number;
  itemsPrice: number;
  customisationPrice: number;
  totalPrice: number;
  onReviewClick: () => void;
  isReviewStep: boolean;
  onRemoveItem: (productId: string) => void;
}

export default function HamperLivePreview({
  box,
  selectedItems,
  personalisation,
  boxPrice,
  itemsPrice,
  customisationPrice,
  totalPrice,
  onReviewClick,
  isReviewStep,
  onRemoveItem,
}: HamperLivePreviewProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const totalItemCount = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Ribbon color styling
  const ribbonColorHex =
    personalisation.ribbonColor === "Forest Green"
      ? "#263B2D"
      : personalisation.ribbonColor === "Muted Rose"
      ? "#D7B3A8"
      : personalisation.ribbonColor === "Burgundy" || personalisation.ribbonColor === "Deep Burgundy"
      ? "#58111A"
      : "#E8D8C3"; // Champagne

  return (
    <>
      {/* DESKTOP STICKY SIDEBAR (Visible on lg screens) */}
      <div className="hidden lg:block sticky top-24 space-y-4">
        <div className="bg-white rounded-3xl p-6 border border-[#B8A28A]/30 shadow-xl space-y-5 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#B8A28A]/20">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B8A28A]">
                Studio Live View
              </span>
              <h3 className="font-serif text-lg font-medium text-[#191C18]">
                YOUR HAMPER
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#B8A28A]/25 text-xs font-semibold text-[#263B2D]">
              <Sparkles className="w-3 h-3" />
              <span>{totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}</span>
            </div>
          </div>

          {/* Hamper Composition Studio Card */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF5EE] to-[#F4EBDD] p-4 border border-[#B8A28A]/25 shadow-inner min-h-[220px] flex flex-col justify-between">
            {/* Ribbon Accent Bar along the top */}
            <div
              className="absolute top-0 inset-x-0 h-2 shadow-xs transition-colors duration-500"
              style={{ backgroundColor: ribbonColorHex }}
              title={`Ribbon: ${personalisation.ribbonColor}`}
            />

            {/* Box Foundation info */}
            {box ? (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#B8A28A]/20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#B8A28A] uppercase tracking-wider font-semibold">
                    Keepsake Box
                  </span>
                  <h4 className="font-serif text-xs font-medium text-[#191C18] truncate">
                    {box.name}
                  </h4>
                  <span className="text-[11px] font-bold text-[#263B2D]">₹{box.price}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#191C18]/50 italic">
                Step 1: Choose a box to begin your hamper
              </div>
            )}

            {/* Dynamic Layered Product Thumbnail Composition */}
            <div className="my-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8A28A] block mb-1.5">
                Curated Inside ({selectedItems.length} types)
              </span>

              {selectedItems.length === 0 ? (
                <div className="border border-dashed border-[#B8A28A]/40 rounded-xl p-4 text-center text-xs text-[#191C18]/50 bg-white/40">
                  Hamper is currently empty. Add treats, candles &amp; gifts from Step 2!
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="relative group rounded-lg overflow-hidden aspect-square bg-white border border-[#B8A28A]/20 shadow-2xs transition-all hover:scale-105"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0.5 right-0.5 bg-[#263B2D] text-white text-[9px] font-bold px-1 rounded-sm">
                        ×{item.quantity}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ribbon & Personalisation Tags */}
            <div className="pt-2 border-t border-[#B8A28A]/20 flex flex-wrap gap-1 text-[10px]">
              <span
                className="px-2 py-0.5 rounded-full text-white font-medium shadow-2xs"
                style={{ backgroundColor: ribbonColorHex }}
              >
                Ribbon: {personalisation.ribbonColor}
              </span>
              <span className="bg-white/80 px-2 py-0.5 rounded-full text-[#191C18] border border-[#B8A28A]/20">
                Wrap: {personalisation.giftWrap}
              </span>
              {personalisation.recipientName && (
                <span className="bg-white/80 px-2 py-0.5 rounded-full text-[#263B2D] border border-[#B8A28A]/20 font-medium">
                  For: {personalisation.recipientName}
                </span>
              )}
            </div>
          </div>

          {/* Running Live Total Breakdown */}
          <div className="space-y-2 text-xs text-[#191C18]/80 pt-1">
            <div className="flex justify-between">
              <span>Selected items:</span>
              <span className="font-semibold text-[#191C18]">{totalItemCount}</span>
            </div>

            <div className="flex justify-between">
              <span>Products subtotal:</span>
              <span className="font-semibold text-[#191C18]">₹{itemsPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Box price:</span>
              <span className="font-semibold text-[#191C18]">₹{boxPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Customisation:</span>
              <span className="font-semibold text-[#191C18]">₹{customisationPrice}</span>
            </div>

            <div className="pt-3 border-t border-[#B8A28A]/20 flex justify-between items-baseline">
              <span className="font-serif text-sm font-bold text-[#191C18]">Estimated total:</span>
              <span className="font-serif text-xl font-bold text-[#263B2D]">
                ₹{totalPrice}
              </span>
            </div>
          </div>

          {/* Bottom Action Button */}
          {!isReviewStep && (
            <button
              type="button"
              onClick={onReviewClick}
              disabled={!box || selectedItems.length === 0}
              className="w-full py-3.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-[#B8A28A]/50 text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#58111A]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed border border-[#7A1B28]/40"
            >
              <span>REVIEW YOUR HAMPER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR & SLIDE-UP DRAWER (Visible on mobile/tablet) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFF9F0] border-t border-[#B8A28A]/30 shadow-2xl safe-area-inset-bottom">
        {/* Slide-Up Drawer Content */}
        {mobileDrawerOpen && (
          <div className="p-4 bg-white border-b border-[#B8A28A]/20 max-h-72 overflow-y-auto space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/15">
              <h4 className="font-serif text-sm font-medium text-[#191C18]">
                Hamper Selections ({totalItemCount} items)
              </h4>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="text-xs text-[#B8A28A] hover:text-[#191C18]"
              >
                Close ✕
              </button>
            </div>

            {box && (
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-semibold text-[#263B2D]">Box:</span>
                <span>{box.name}</span>
                <span className="font-bold text-[#191C18] ml-auto">₹{box.price}</span>
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              {selectedItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs text-[#191C18]/80">
                  <span className="truncate pr-2">
                    {item.quantity}× {item.product.name}
                  </span>
                  <span className="font-semibold text-[#191C18]">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#B8A28A]/15 text-xs space-y-1 text-[#191C18]/70">
              <div className="flex justify-between">
                <span>Customisation &amp; Extras:</span>
                <span className="font-semibold text-[#191C18]">₹{customisationPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Compact Bar Always Visible at Bottom */}
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#263B2D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {totalItemCount}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-[#191C18]/60 font-medium">
                <span>View Hamper</span>
                {mobileDrawerOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="font-serif text-base font-bold text-[#263B2D] leading-none">
                ₹{totalPrice}
              </div>
            </div>
          </button>

          {!isReviewStep ? (
            <button
              type="button"
              onClick={onReviewClick}
              disabled={!box || selectedItems.length === 0}
              className="px-6 py-2.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-[#B8A28A]/50 text-white font-semibold text-xs rounded-full shadow-md transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed border border-[#7A1B28]/40"
            >
              Review Hamper →
            </button>
          ) : (
            <span className="text-xs font-semibold text-[#263B2D]">
              Final Review Step
            </span>
          )}
        </div>
      </div>
    </>
  );
}
