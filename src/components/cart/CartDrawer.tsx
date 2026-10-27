"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ArrowRight, Tag, Gift, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
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
  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const res = await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    if (res.success) {
      success(res.message);
      setCouponInput("");
    } else {
      toastError(res.message);
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const freeShippingThreshold = 1499;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#191C18]/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F0] shadow-2xl flex flex-col border-l border-[#B8A28A]/30 animate-fade-in">
          {/* Header */}
          <div className="p-5 border-b border-[#B8A28A]/20 flex items-center justify-between bg-[#FFF9F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#263B2D]" />
              <h2 className="font-serif text-xl font-medium text-[#191C18]">
                Your Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#191C18]/70 hover:text-[#191C18] rounded-full hover:bg-[#F4EBDD] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#FAF5EE] border-b border-[#B8A28A]/15 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-[#263B2D] font-medium flex items-center gap-1.5">
                <span>🎉</span>
                <span>You unlocked <strong>Free Pan-India Delivery!</strong></span>
              </p>
            ) : (
              <div>
                <p className="text-[#191C18]/80 mb-1.5">
                  Add <strong>₹{remainingForFreeShipping}</strong> more to get <strong>Free Delivery</strong>
                </p>
                <div className="w-full bg-[#E5DACD] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#263B2D] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F4EBDD] flex items-center justify-center mb-4 text-[#B8A28A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#191C18] mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#191C18]/60 max-w-xs mb-6">
                  Explore our handcrafted hampers and artisanal treasures to create moments of pure joy.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#263B2D] text-white text-xs font-semibold rounded-full hover:bg-[#1A281E] transition-all"
                >
                  Start Exploring Gifts
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white border border-[#B8A28A]/20 rounded-2xl flex gap-3.5 relative group hover:border-[#B8A28A]/40 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F4EBDD] shrink-0 border border-[#B8A28A]/15 relative">
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

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-semibold text-[#191C18] truncate">
                          {item.isCustomHamper && item.customHamper
                            ? `Custom Hamper — ${item.customHamper.box.name}`
                            : item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#B8A28A] hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#263B2D]">
                          ₹{item.unitPrice}
                        </span>
                        {!item.isCustomHamper && item.product.originalPrice && (
                          <span className="text-[11px] text-[#191C18]/40 line-through">
                            ₹{item.product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Custom Hamper breakdown preview */}
                      {item.isCustomHamper && item.customHamper ? (
                        <div className="mt-1.5 text-[11px] bg-[#FAF5EE] p-2 rounded-lg border border-[#B8A28A]/20 space-y-1">
                          <p className="text-[#191C18]/80 text-[10.5px]">
                            <strong>Contains {item.customHamper.items.length} items:</strong>{" "}
                            {item.customHamper.items
                              .map((ci) => `${ci.quantity}x ${ci.product.name}`)
                              .join(", ")}
                          </p>
                          <div className="flex flex-wrap gap-1 text-[10px] text-[#263B2D] font-medium pt-0.5">
                            <span className="bg-white/80 px-1.5 py-0.5 rounded border border-[#B8A28A]/20">
                              🎀 {item.customHamper.personalisation.ribbonColor}
                            </span>
                            <span className="bg-white/80 px-1.5 py-0.5 rounded border border-[#B8A28A]/20">
                              🎁 {item.customHamper.personalisation.giftWrap}
                            </span>
                            {item.customHamper.personalisation.recipientName && (
                              <span className="bg-white/80 px-1.5 py-0.5 rounded border border-[#B8A28A]/20">
                                💌 For {item.customHamper.personalisation.recipientName}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : item.personalisation ? (
                        <div className="mt-1.5 text-[11px] bg-[#FAF5EE] p-1.5 rounded-lg border border-[#B8A28A]/20 space-y-0.5">
                          {item.personalisation.recipientName && (
                            <p className="text-[#191C18]/80 truncate">
                              <strong>For:</strong> {item.personalisation.recipientName}
                            </p>
                          )}
                          {item.personalisation.chosenColor && (
                            <p className="text-[#191C18]/80">
                              <strong>Ribbon:</strong> {item.personalisation.chosenColor}
                            </p>
                          )}
                          {item.personalisation.giftWrap && (
                            <p className="text-[#263B2D] font-medium flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              Luxury Gift Wrap (+₹99)
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#B8A28A]/10">
                      <div className="flex items-center border border-[#B8A28A]/30 rounded-lg overflow-hidden bg-[#FAF5EE]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F4EBDD] text-[#191C18] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#191C18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F4EBDD] text-[#191C18] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#191C18]">
                        ₹{item.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#B8A28A]/20 bg-[#FFF9F0] space-y-3.5">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#263B2D]/10 border border-[#263B2D]/20 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-[#263B2D] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon (e.g. HAPPINESS10)"
                    className="flex-1 bg-white border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#263B2D]"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#191C18]/80 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#191C18]">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#263B2D] font-medium">
                    <span>Discount</span>
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
                <div className="border-t border-[#B8A28A]/20 pt-2 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#191C18]">Total Amount</span>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-[#263B2D]">
                      ₹{total}
                    </span>
                    <p className="text-[10px] text-[#191C18]/50">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#58111A]/25 flex items-center justify-center gap-2 group border border-[#7A1B28]/40"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex-1 py-2 text-center text-xs text-[#191C18]/80 hover:text-[#263B2D] border border-[#B8A28A]/30 rounded-xl transition-colors font-medium"
                  >
                    View Bag Page
                  </Link>
                  <button
                    onClick={closeCart}
                    className="flex-1 py-2 text-center text-xs text-[#191C18]/80 hover:text-[#263B2D] border border-[#B8A28A]/30 rounded-xl transition-colors font-medium"
                  >
                    Keep Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
