"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Gift,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { success, error: toastError } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    const res = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    if (res.success) {
      success(res.message);
      setCouponCode("");
    } else {
      toastError(res.message);
    }
  };

  const freeShippingThreshold = 1499;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF5EE] border border-[#B8A28A]/30 flex items-center justify-center text-[#B8A28A] mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#191C18] mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-[#191C18]/60 max-w-sm mb-6">
          You haven&apos;t added any luxury hampers or gifts to your bag yet.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-md transition-all border border-[#7A1B28]/40"
        >
          Explore Gift Hampers
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#B8A28A] font-semibold">
            Boutique Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18]">
            Shopping Bag ({items.length} {items.length === 1 ? "Item" : "Items"})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Alert banner */}
            <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#B8A28A]/25 text-xs text-[#191C18]">
              {subtotal >= freeShippingThreshold ? (
                <p className="text-[#263B2D] font-semibold flex items-center gap-2">
                  <span>🎉</span>
                  <span>Your order qualifies for <strong>Complimentary Pan-India Shipping!</strong></span>
                </p>
              ) : (
                <p>
                  Add items worth <strong>₹{remainingForFree}</strong> more to enjoy <strong>Free Delivery</strong> across India.
                </p>
              )}
            </div>

            {/* Items */}
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border-2 border-[#58111A]/20 hover:border-[#58111A]/40 shadow-xs transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF0F2]/40 shrink-0 border border-[#58111A]/20 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.isCustomHamper && item.customHamper
                          ? item.customHamper.box.image
                          : item.product.images?.[0]?.url ||
                            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.isCustomHamper && item.customHamper ? item.customHamper.box.name : item.product.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isCustomHamper && (
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold bg-[#263B2D]/90 text-white text-center py-0.5 rounded-md backdrop-blur-xs">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8A28A] font-semibold">
                      {item.isCustomHamper ? "Bespoke Hamper" : item.product.occasion}
                    </span>
                    {item.isCustomHamper && item.customHamper ? (
                      <h3 className="font-serif text-base sm:text-lg font-medium text-[#191C18]">
                        Custom Hamper — {item.customHamper.box.name}
                      </h3>
                    ) : (
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block font-serif text-base sm:text-lg font-medium text-[#191C18] hover:text-[#263B2D] transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>
                    )}
                    <div className="text-xs font-bold text-[#58111A]">
                      ₹{item.unitPrice} each
                    </div>

                    {/* Custom Hamper breakdown */}
                    {item.isCustomHamper && item.customHamper ? (
                      <div className="text-[11px] text-[#191C18]/80 bg-[#FAF5EE] p-2.5 rounded-xl border border-[#B8A28A]/20 space-y-1 mt-1 max-w-md">
                        <p className="text-[11px]">
                          <strong>Contains {item.customHamper.items.length} items:</strong>{" "}
                          {item.customHamper.items
                            .map((ci) => `${ci.quantity}x ${ci.product.name}`)
                            .join(", ")}
                        </p>
                        <div className="flex flex-wrap gap-1.5 text-[10.5px] text-[#263B2D] font-medium pt-0.5">
                          <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#B8A28A]/20">
                            🎀 {item.customHamper.personalisation.ribbonColor}
                          </span>
                          <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#B8A28A]/20">
                            🎁 {item.customHamper.personalisation.giftWrap}
                          </span>
                          {item.customHamper.personalisation.recipientName && (
                            <span className="bg-white/80 px-2 py-0.5 rounded-md border border-[#B8A28A]/20">
                              💌 For {item.customHamper.personalisation.recipientName}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : item.personalisation ? (
                      <div className="text-[11px] text-[#191C18]/80 bg-[#FAF5EE] p-2 rounded-xl border border-[#B8A28A]/20 space-y-0.5 mt-1">
                        {item.personalisation.recipientName && (
                          <p><strong>For:</strong> {item.personalisation.recipientName}</p>
                        )}
                        {item.personalisation.chosenColor && (
                          <p><strong>Ribbon:</strong> {item.personalisation.chosenColor}</p>
                        )}
                        {item.personalisation.giftWrap && (
                          <p className="text-[#263B2D] font-medium flex items-center gap-1">
                            <Gift className="w-3 h-3" /> Velvet Gift Wrap (+₹99)
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#B8A28A]/15">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#263B2D]">
                    ₹{item.totalPrice}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#B8A28A]/40 rounded-xl overflow-hidden bg-[#FAF5EE]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-sm hover:bg-[#F4EBDD]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#191C18]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-sm hover:bg-[#F4EBDD]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-[#B8A28A] hover:text-red-600 transition-colors"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#263B2D] hover:underline uppercase tracking-wider"
              >
                ← Continue Browsing Hampers
              </Link>
            </div>
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-medium text-[#191C18] pb-3 border-b border-[#B8A28A]/20">
                Order Summary
              </h3>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#263B2D]/10 border border-[#263B2D]/20 p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-[#263B2D] font-medium">
                    <Tag className="w-4 h-4" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#263B2D]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[#58111A] text-white rounded-xl text-xs font-semibold hover:bg-[#3B0A11] disabled:opacity-50 transition-colors shadow-xs"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price rows */}
              <div className="space-y-2.5 text-xs text-[#191C18]/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#191C18]">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#263B2D] font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#263B2D]">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="border-t border-[#B8A28A]/20 pt-3 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#191C18]">Estimated Total</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#263B2D]">
                      ₹{total}
                    </span>
                    <p className="text-[10px] text-[#191C18]/40">Includes all applicable taxes</p>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-[#58111A] hover:bg-[#3B0A11] text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#58111A]/25 transition-all flex items-center justify-center gap-2 group border border-[#7A1B28]/40"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#F4EBDD] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="space-y-2 pt-2 border-t border-[#B8A28A]/15 text-[11px] text-[#191C18]/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#263B2D]" />
                  <span>Safe &amp; Encrypted SSL Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#263B2D]" />
                  <span>Guaranteed safe delivery across India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
