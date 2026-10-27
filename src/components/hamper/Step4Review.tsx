import React from "react";
import Link from "next/link";
import {
  FileCheck,
  Edit2,
  Trash2,
  Sparkles,
  ShoppingBag,
  Gift,
  Heart,
  ShieldCheck,
  Check,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import {
  HamperBox,
  CustomHamperProductItem,
  CustomHamperPersonalisation,
} from "@/lib/types";

interface Step4ReviewProps {
  box: HamperBox;
  selectedItems: CustomHamperProductItem[];
  personalisation: CustomHamperPersonalisation;
  boxPrice: number;
  itemsPrice: number;
  customisationPrice: number;
  totalPrice: number;
  onEditStep: (step: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: () => void;
  isAdding: boolean;
}

export default function Step4Review({
  box,
  selectedItems,
  personalisation,
  boxPrice,
  itemsPrice,
  customisationPrice,
  totalPrice,
  onEditStep,
  onRemoveItem,
  onAddToCart,
  isAdding,
}: Step4ReviewProps) {
  const totalItemCount = selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#263B2D]/10 text-[#263B2D] text-xs font-semibold uppercase tracking-wider">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Step 4 of 4</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#191C18]">
          Review Your Hamper
        </h2>
        <p className="text-xs sm:text-sm text-[#191C18]/70 max-w-2xl font-light">
          Your bespoke creation is ready. Take a moment to inspect your box, items,
          and personalisation before adding it to your shopping bag.
        </p>
      </div>

      {/* 1. Selected Hamper Box Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#B8A28A]/25 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#B8A28A]/15 mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#191C18]">
              Hamper Box Foundation
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="text-xs text-[#263B2D] hover:underline font-semibold flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Change Box</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF5EE] border border-[#B8A28A]/20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-lg font-medium text-[#191C18]">{box.name}</h4>
            <p className="text-xs text-[#191C18]/65 font-light mt-0.5">{box.description}</p>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#B8A28A] font-medium mt-1.5">
              {box.dimensions && <span>• {box.dimensions}</span>}
              {box.capacity && <span>• {box.capacity}</span>}
            </div>
          </div>
          <div className="text-right sm:self-center">
            <span className="text-sm sm:text-base font-bold text-[#263B2D]">₹{boxPrice}</span>
          </div>
        </div>
      </div>

      {/* 2. Selected Items List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#B8A28A]/25 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#B8A28A]/15 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#191C18]">
              Included Products ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="text-xs text-[#263B2D] hover:underline font-semibold flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit Products</span>
          </button>
        </div>

        <div className="divide-y divide-[#B8A28A]/15">
          {selectedItems.map((item) => {
            const primaryImg =
              item.product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80";

            return (
              <div key={item.product.id} className="py-3 flex items-center gap-3.5 justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF5EE] border border-[#B8A28A]/15 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryImg}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif text-xs sm:text-sm font-medium text-[#191C18] truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-[11px] text-[#191C18]/60">
                      ₹{item.product.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-[#191C18]">
                    ₹{item.product.price * item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1 text-[#B8A28A] hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#B8A28A]/15 flex justify-between text-xs font-semibold text-[#191C18]">
          <span>Products Subtotal</span>
          <span>₹{itemsPrice}</span>
        </div>
      </div>

      {/* 3. Personalisation Details Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#B8A28A]/25 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#B8A28A]/15 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#263B2D]" />
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#191C18]">
              Personalisation &amp; Aesthetics
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="text-xs text-[#263B2D] hover:underline font-semibold flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#B8A28A]/20 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8A28A]">
              Occasion &amp; Theme
            </span>
            <p className="font-medium text-[#191C18]">
              <strong>Occasion:</strong> {personalisation.occasion || "Just Because"}
            </p>
            <p className="text-[#191C18]/80">
              <strong>Wrapping:</strong> {personalisation.giftWrap || "Classic"}
            </p>
            <p className="text-[#191C18]/80">
              <strong>Ribbon:</strong> {personalisation.ribbonColor || "Warm Champagne"}
            </p>
          </div>

          <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#B8A28A]/20 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8A28A]">
              Gift Message
            </span>
            <p className="text-[#191C18]/80">
              <strong>From:</strong> {personalisation.senderName || "An Admirer"}
            </p>
            <p className="text-[#191C18]/80">
              <strong>To:</strong> {personalisation.recipientName || "Someone Special"}
            </p>
            {personalisation.cardMessage ? (
              <p className="italic text-[#191C18]/70 pt-1 line-clamp-2">
                &ldquo;{personalisation.cardMessage}&rdquo;
              </p>
            ) : (
              <p className="text-[11px] text-[#191C18]/50 italic">No custom card note added</p>
            )}
          </div>
        </div>

        {/* Selected Extras */}
        {personalisation.extras && personalisation.extras.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#B8A28A]/15">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8A28A] block mb-1.5">
              Add-On Extras
            </span>
            <div className="flex flex-wrap gap-2">
              {personalisation.extras.map((ext) => (
                <span
                  key={ext.id}
                  className="bg-[#FAF5EE] text-[#263B2D] border border-[#B8A28A]/20 px-3 py-1 rounded-full text-[11px] font-medium"
                >
                  ✓ {ext.name} (+₹{ext.price})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Complete Final Price Breakdown */}
      <div className="bg-gradient-to-br from-[#FAF5EE] to-[#FFF9F0] rounded-3xl p-6 sm:p-7 border border-[#B8A28A]/30 shadow-sm space-y-3">
        <h4 className="font-serif text-lg font-medium text-[#191C18] pb-2 border-b border-[#B8A28A]/20">
          Price Breakdown
        </h4>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-[#191C18]/80">
            <span>Hamper Box ({box.name})</span>
            <span className="font-medium text-[#191C18]">₹{boxPrice}</span>
          </div>

          <div className="flex justify-between text-[#191C18]/80">
            <span>Included Products ({totalItemCount} items)</span>
            <span className="font-medium text-[#191C18]">₹{itemsPrice}</span>
          </div>

          <div className="flex justify-between text-[#191C18]/80">
            <span>Customisation &amp; Extras</span>
            <span className="font-medium text-[#191C18]">₹{customisationPrice}</span>
          </div>

          <div className="pt-3 border-t border-[#B8A28A]/20 flex justify-between items-baseline">
            <div>
              <span className="font-serif text-base sm:text-lg font-bold text-[#191C18]">
                Estimated Hamper Total
              </span>
              <p className="text-[11px] text-[#263B2D] font-medium">
                {totalPrice >= 1499
                  ? "🎉 Qualifies for Complimentary Pan-India Shipping!"
                  : "All taxes included. Shipping computed at checkout."}
              </p>
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#263B2D]">
              ₹{totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="bg-white rounded-2xl p-4 border border-[#B8A28A]/20 flex items-center gap-3 text-xs text-[#191C18]/70">
        <ShieldCheck className="w-5 h-5 text-[#263B2D] shrink-0" />
        <span>
          Every hamper is assembled by hand by our gifting artisans, beautifully cushioned, and inspected prior to dispatch.
        </span>
      </div>

      {/* Final Action Controls */}
      <div className="pt-6 border-t border-[#B8A28A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onEditStep(3)}
          className="text-xs text-[#191C18] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Personalise</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/shop"
            className="flex-1 sm:flex-initial text-center px-6 py-3.5 border border-[#B8A28A]/40 text-[#191C18] hover:bg-white text-xs font-semibold rounded-full transition-colors"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={isAdding || selectedItems.length === 0}
            className="flex-1 sm:flex-initial px-8 py-4 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-[#B8A28A]/50 text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#58111A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer border border-[#7A1B28]/40"
          >
            {isAdding ? (
              <span>Adding Hamper to Bag...</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#F4EBDD]" />
                <span>Add Hamper to Cart — ₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
