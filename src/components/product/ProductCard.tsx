"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();
  const { success } = useToast();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "fallback", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", alt: product.name, isPrimary: true, displayOrder: 0 }];

  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const secondaryImage = images.length > 1 ? images[1] : primaryImage;

  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = await toggleWishlist(product.id);
    success(added ? `Saved "${product.name}" to wishlist` : "Removed from wishlist");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    success(`Added "${product.name}" to bag`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl bg-white border-2 border-[#58111A]/25 hover:border-[#58111A] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#58111A]/15 transition-all duration-300 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
          {product.discountPercent && (
            <span className="bg-[#58111A] text-[#FAF0F2] text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider shadow-sm border border-[#7A1B28]/40">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#FAF5EE] text-[#191C18] border border-[#B8A28A]/40 text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#B8A28A]" />
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? "bg-[#58111A] text-white shadow-md scale-110"
              : "bg-white/85 backdrop-blur-xs text-[#191C18] hover:bg-white hover:text-[#58111A] shadow-sm"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform group-active:scale-125 ${
              inWishlist ? "fill-current text-white" : ""
            }`}
          />
        </button>

        {/* Product Image Area with Hover Reveal */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[#FAF0F2]/40 border-b border-[#58111A]/15">
          {/* Primary Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage?.url}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              images.length > 1 && isHovered ? "opacity-0 scale-105" : "opacity-100 group-hover:scale-105"
            }`}
          />

          {/* Secondary Hover Image */}
          {images.length > 1 && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={secondaryImage?.url}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Overlay Quick View button on hover */}
          <div className="absolute inset-x-2 bottom-2 z-20 hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="flex-1 py-2 bg-white/95 backdrop-blur-sm text-[#58111A] hover:bg-[#58111A] hover:text-white rounded-xl text-[11px] font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all border border-[#58111A]/30"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className="p-2 bg-[#58111A] text-white hover:bg-[#3B0A11] rounded-xl shadow-md flex items-center justify-center transition-all disabled:opacity-50 border border-[#7A1B28]/50"
              title="Add to bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-white">
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#B8A28A] font-semibold mb-1">
              <span>{product.occasion}</span>
              <div className="flex items-center gap-1 text-[#58111A] font-bold">
                <Star className="w-3 h-3 fill-[#58111A] text-[#58111A]" />
                <span>{product.rating}</span>
                <span className="text-[#191C18]/40 font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#58111A] transition-colors">
              <h3 className="font-serif text-sm sm:text-base font-medium text-[#191C18] line-clamp-1 mb-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-[11px] text-[#191C18]/60 line-clamp-1 mb-2">
              {product.description}
            </p>
          </div>

          <div className="pt-2 border-t border-[#58111A]/15 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-sm sm:text-base text-[#58111A]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-[#191C18]/40 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Mobile inline add button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={product.stock <= 0}
              className="sm:hidden p-2 bg-[#58111A] text-white hover:bg-[#3B0A11] rounded-lg text-xs shadow-xs"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>

            <span className="hidden sm:inline-block text-[10px] text-[#58111A] font-medium bg-[#58111A]/10 px-2 py-0.5 rounded-full">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
