import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  Check,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Product, CustomHamperProductItem } from "@/lib/types";

interface Step2ChooseProductsProps {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  selectedItems: CustomHamperProductItem[];
  onAddItem: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

// 14 Standard Builder Categories as defined in requirements
export const HAMPER_CATEGORIES = [
  "All Items",
  "Chocolates & Sweets",
  "Snacks & Treats",
  "Flowers",
  "Teddy Bears & Soft Toys",
  "Candles & Fragrances",
  "Mugs & Drinkware",
  "Skincare & Self-Care",
  "Jewellery & Accessories",
  "Personalised Gifts",
  "Photo Frames",
  "Stationery",
  "Cute Accessories",
  "Premium Gifts",
  "Other Available Products",
];

export default function Step2ChooseProducts({
  products,
  selectedItems,
  onAddItem,
  onUpdateQuantity,
  onBack,
  onContinue,
}: Step2ChooseProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Map product quantities for quick O(1) lookup
  const quantityMap = useMemo(() => {
    const map = new Map<string, number>();
    selectedItems.forEach((item) => {
      map.set(item.product.id, item.quantity);
    });
    return map;
  }, [selectedItems]);

  const totalItemCount = useMemo(() => {
    return selectedItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [selectedItems]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All Items") {
      result = result.filter((p) => {
        const catName = p.category?.name?.toLowerCase() || "";
        const target = selectedCategory.toLowerCase();
        if (target.includes("chocolate") && catName.includes("chocolate")) return true;
        if (target.includes("snack") && catName.includes("snack")) return true;
        if (target.includes("flower") && catName.includes("flower")) return true;
        if ((target.includes("teddy") || target.includes("toy")) && (catName.includes("teddy") || catName.includes("toy") || catName.includes("plush"))) return true;
        if (target.includes("candle") && (catName.includes("candle") || catName.includes("fragrance"))) return true;
        if (target.includes("mug") && (catName.includes("mug") || catName.includes("drinkware"))) return true;
        if (target.includes("skin") && (catName.includes("skin") || catName.includes("self-care") || catName.includes("care"))) return true;
        if (target.includes("jewel") && catName.includes("jewel")) return true;
        if (target.includes("stationery") && catName.includes("stationery")) return true;
        if (target.includes("photo") && catName.includes("photo")) return true;
        if (target.includes("accessory") && catName.includes("accessor")) return true;
        if (target.includes("premium") && (catName.includes("premium") || catName.includes("luxury"))) return true;
        if (target.includes("personal") && (catName.includes("personal") || (p.personalisationOptions && p.personalisationOptions.length > 0))) return true;
        if (target.includes("other")) return true;
        return catName === target;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#263B2D]/10 text-[#263B2D] text-xs font-semibold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Step 2 of 4</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191C18]">
            Add Your Favourites
          </h2>
          <p className="text-xs sm:text-sm text-[#191C18]/70 font-light">
            Select authentic goodies to tuck inside your chosen box.
          </p>
        </div>

        {/* Selected count pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs bg-[#FAF5EE] border border-[#B8A28A]/30 px-3.5 py-1.5 rounded-full text-[#191C18] font-medium">
            Items Chosen: <strong className="text-[#263B2D] font-bold">{totalItemCount}</strong>
          </span>
        </div>
      </div>

      {/* Category Navigation Bar (14 Categories) */}
      <div className="border-b border-[#B8A28A]/20 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#B8A28A]/40">
          {HAMPER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#58111A] text-white shadow-xs"
                  : "bg-[#FFF9F0] text-[#191C18]/70 hover:bg-[#FAF5EE] hover:text-[#58111A] border border-[#B8A28A]/25"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-[#191C18]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search treats, candles, toys..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-[#B8A28A]/30 focus:border-[#263B2D] focus:outline-hidden focus:ring-1 focus:ring-[#263B2D] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#191C18]/50 hover:text-[#191C18]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8A28A]" />
          <span className="text-xs text-[#191C18]/60">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
            className="text-xs bg-white border border-[#B8A28A]/30 rounded-xl px-3 py-1.5 text-[#191C18] focus:outline-hidden focus:border-[#263B2D]"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#B8A28A]/20 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF5EE] text-[#B8A28A] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#191C18]">No products found</h3>
          <p className="text-xs text-[#191C18]/60 max-w-sm mx-auto">
            We couldn&apos;t find matching items in this category or search term. Try selecting another category above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All Items");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-[#263B2D] text-white text-xs rounded-full hover:bg-[#1A281E]"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
          {filteredProducts.map((product) => {
            const currentQty = quantityMap.get(product.id) || 0;
            const isSelected = currentQty > 0;
            const isOutOfStock = product.stock <= 0;
            const isMaxStockReached = currentQty >= product.stock;
            const primaryImg =
              product.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80";

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-3 sm:p-3.5 border-2 transition-all duration-300 flex flex-col justify-between group ${
                  isSelected
                    ? "border-[#58111A] ring-2 ring-[#58111A]/20 shadow-md shadow-[#58111A]/10"
                    : "border-[#58111A]/20 hover:border-[#58111A] hover:shadow-md hover:shadow-[#58111A]/10"
                }`}
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF5EE] mb-2.5 relative border border-[#B8A28A]/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Stock pill */}
                    {isOutOfStock ? (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Out of Stock
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Only {product.stock} left
                      </span>
                    ) : null}

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#58111A] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <span className="text-[10px] text-[#B8A28A] uppercase tracking-wider font-semibold block truncate">
                    {product.category?.name || "Artisanal"}
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-medium text-[#191C18] line-clamp-1 mt-0.5 group-hover:text-[#58111A] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-[#191C18]/60 line-clamp-1 mt-0.5 font-light">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#58111A]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[10px] text-[#191C18]/40 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-2.5 mt-2 border-t border-[#B8A28A]/10">
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="w-full py-1.5 text-center text-xs text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  ) : isSelected ? (
                    <div className="flex items-center justify-between bg-[#FAF5EE] border border-[#263B2D]/30 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, currentQty - 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-[#F4EBDD] text-[#191C18] flex items-center justify-center transition-colors shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#191C18] px-2">
                        {currentQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, currentQty + 1)}
                        disabled={isMaxStockReached}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-[#F4EBDD] text-[#191C18] disabled:opacity-40 flex items-center justify-center transition-colors shadow-2xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddItem(product)}
                      className="w-full py-2 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md group/btn"
                    >
                      <Plus className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      <span>Add to Hamper</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-[#B8A28A]/20 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#191C18] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Box Selection</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={selectedItems.length === 0}
          className="px-8 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-[#B8A28A]/50 text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-xl hover:shadow-[#58111A]/30 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-all flex items-center gap-2 group cursor-pointer disabled:cursor-not-allowed border border-[#7A1B28]/40"
        >
          <span>Personalise It</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
