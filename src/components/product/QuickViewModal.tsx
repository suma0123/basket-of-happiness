"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();
  const { success } = useToast();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "fallback", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", alt: product.name, isPrimary: true, displayOrder: 0 }];

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      recipientName: recipientName.trim() || undefined,
      customMessage: customMessage.trim() || undefined,
      giftWrap,
    });
    success(`Added "${product.name}" to your bag!`);
    onClose();
  };

  const handleWishlist = async () => {
    const added = await toggleWishlist(product.id);
    success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#191C18]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#FFF9F0] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#B8A28A]/30 animate-fade-in">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#191C18] shadow-sm transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="p-6 bg-[#F4EBDD]/40 flex flex-col justify-between">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#B8A28A]/20 relative shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[selectedImageIdx]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discountPercent && (
                  <span className="absolute top-3 left-3 bg-[#263B2D] text-[#F4EBDD] text-xs font-bold px-2.5 py-1 rounded-full tracking-wider">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail row */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIdx === idx
                          ? "border-[#263B2D] ring-2 ring-[#263B2D]/20 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#B8A28A]">
                    {product.occasion} • {product.giftType || "Hamper"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#263B2D] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#263B2D] text-[#263B2D]" />
                    <span>{product.rating}</span>
                    <span className="text-[#191C18]/40">({product.reviewCount})</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-medium text-[#191C18] mb-2">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-serif font-bold text-[#263B2D]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#191C18]/40 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#263B2D]/10 text-[#263B2D] font-medium">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="text-xs text-[#191C18]/70 leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>

                {/* Quick Personalisation Fields */}
                <div className="bg-[#FAF5EE] p-3.5 rounded-xl border border-[#B8A28A]/25 mb-4 space-y-2">
                  <p className="text-xs font-semibold text-[#191C18] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8A28A]" />
                    <span>Quick Personalisation</span>
                  </p>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's Name (e.g. Aanya)"
                    className="w-full bg-white border border-[#B8A28A]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  />
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Handwritten Card Note (optional)"
                    className="w-full bg-white border border-[#B8A28A]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  />
                  <label className="flex items-center gap-2 text-xs text-[#191C18] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="rounded border-[#B8A28A] text-[#263B2D] focus:ring-[#263B2D]"
                    />
                    <span>Add Signature Velvet Gift Wrap (+₹99)</span>
                  </label>
                </div>
              </div>

              {/* CTA row */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex items-center border border-[#B8A28A]/40 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-sm hover:bg-[#F4EBDD]"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-sm hover:bg-[#F4EBDD]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-2.5 px-4 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-300 text-white rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all border border-[#7A1B28]/40"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FAF0F2]" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleWishlist}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      inWishlist
                        ? "bg-[#58111A] border-[#58111A] text-white"
                        : "border-[#B8A28A]/40 text-[#191C18] hover:bg-[#F4EBDD]"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#B8A28A]/15 text-[11px] text-[#191C18]/60">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#58111A]" />
                    Dispatch in 24 hrs
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="font-semibold text-[#58111A] hover:underline"
                  >
                    Full Details & Reviews →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
