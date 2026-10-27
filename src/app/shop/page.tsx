"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get("occasion") || "");
  const [selectedGiftType, setSelectedGiftType] = useState(searchParams.get("giftType") || "");
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get("priceRange") || "");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const occasions = [
    { label: "All Occasions", value: "" },
    { label: "Birthday", value: "birthday" },
    { label: "Anniversary", value: "anniversary" },
    { label: "Thank You", value: "thank-you" },
    { label: "Baby Gifts", value: "baby-gifts" },
    { label: "Just Because", value: "just-because" },
    { label: "For Him", value: "for-him" },
    { label: "For Her", value: "for-her" },
    { label: "Festive Gifts", value: "festive-gifts" },
  ];

  const giftTypes = [
    { label: "All Types", value: "" },
    { label: "Luxury Hampers", value: "Hamper" },
    { label: "Magnetic Gift Boxes", value: "Box" },
    { label: "Personalised Keepsakes", value: "Keepsake" },
  ];

  const priceRanges = [
    { label: "All Prices", value: "" },
    { label: "Under ₹1,000", value: "0-1000" },
    { label: "₹1,000 to ₹1,800", value: "1000-1800" },
    { label: "Above ₹1,800", value: "1800-10000" },
  ];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedOccasion) params.set("occasion", selectedOccasion);
      if (selectedGiftType) params.set("giftType", selectedGiftType);
      if (availabilityOnly) params.set("availability", "in-stock");
      if (sort) params.set("sort", sort);

      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (e) {
      console.error("Failed to load products", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOccasion, selectedGiftType, selectedPriceRange, availabilityOnly, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedOccasion("");
    setSelectedGiftType("");
    setSelectedPriceRange("");
    setAvailabilityOnly(false);
    setSort("featured");
    router.push("/shop");
  };

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B8A28A]">
            Curated Gifting Boutique
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191C18] mt-1.5 mb-3">
            The Complete Collection
          </h1>
          <p className="text-sm text-[#191C18]/70 font-light">
            Discover {totalCount} handpicked gift hampers, celebration boxes, and bespoke creations.
          </p>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white p-3 sm:p-4 rounded-2xl border border-[#B8A28A]/25 shadow-xs">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, treats, occasions..."
              className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl pl-4 pr-10 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 text-[#191C18]/60 hover:text-[#263B2D]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Row */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl text-xs font-medium text-[#191C18]"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-[#191C18]/60 font-medium">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs font-medium text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-[#B8A28A]/25 h-fit shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#B8A28A]/20">
              <div className="flex items-center gap-2 text-[#191C18] font-serif text-lg font-medium">
                <SlidersHorizontal className="w-4 h-4 text-[#263B2D]" />
                <span>Filters</span>
              </div>
              {(selectedOccasion || selectedGiftType || selectedPriceRange || availabilityOnly || search) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Occasions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8A28A] mb-3">
                Occasion
              </h4>
              <div className="space-y-1.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.value}
                    onClick={() => setSelectedOccasion(occ.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedOccasion === occ.value
                        ? "bg-[#58111A] text-white"
                        : "text-[#191C18]/80 hover:bg-[#FAF0F2] hover:text-[#58111A]"
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Type */}
            <div className="pt-4 border-t border-[#B8A28A]/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8A28A] mb-3">
                Gift Type
              </h4>
              <div className="space-y-1.5">
                {giftTypes.map((gt) => (
                  <button
                    key={gt.value}
                    onClick={() => setSelectedGiftType(gt.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedGiftType === gt.value
                        ? "bg-[#58111A] text-white"
                        : "text-[#191C18]/80 hover:bg-[#FAF0F2] hover:text-[#58111A]"
                    }`}
                  >
                    {gt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="pt-4 border-t border-[#B8A28A]/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8A28A] mb-3">
                Price (INR)
              </h4>
              <div className="space-y-1.5">
                {priceRanges.map((pr) => (
                  <button
                    key={pr.value}
                    onClick={() => setSelectedPriceRange(pr.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedPriceRange === pr.value
                        ? "bg-[#58111A] text-white"
                        : "text-[#191C18]/80 hover:bg-[#FAF0F2] hover:text-[#58111A]"
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-[#B8A28A]/15">
              <label className="flex items-center gap-2.5 text-xs text-[#191C18] cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  className="rounded border-[#B8A28A] text-[#263B2D] focus:ring-[#263B2D]"
                />
                <span className="font-medium">In-Stock Gifts Only</span>
              </label>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-[#B8A28A]/20 animate-pulse space-y-3"
                  >
                    <div className="aspect-square bg-gray-200 rounded-xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty Search Results State */
              <div className="bg-white rounded-3xl p-12 text-center border border-[#B8A28A]/25 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FAF5EE] flex items-center justify-center mx-auto mb-4 text-[#B8A28A]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#191C18] mb-2">
                  No matching gifts found
                </h3>
                <p className="text-xs text-[#191C18]/60 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#58111A] hover:bg-[#3B0A11] text-white text-xs font-semibold rounded-full shadow-md transition-all"
                >
                  View All Curations
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(idx * 50, 450)}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FFF9F0] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#B8A28A]/20">
                <h3 className="font-serif text-lg font-medium text-[#191C18]">
                  Filter Collection
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#191C18]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Occasion */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#B8A28A] mb-2">
                  Occasion
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {occasions.map((occ) => (
                    <button
                      key={occ.value}
                      onClick={() => {
                        setSelectedOccasion(occ.value);
                        setMobileFilterOpen(false);
                      }}
                      className={`text-left p-2 rounded-lg text-xs font-medium ${
                        selectedOccasion === occ.value
                          ? "bg-[#263B2D] text-white"
                          : "bg-white text-[#191C18] border border-[#B8A28A]/20"
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold uppercase text-[#B8A28A] mb-2">
                  Price
                </h4>
                <div className="space-y-1.5">
                  {priceRanges.map((pr) => (
                    <button
                      key={pr.value}
                      onClick={() => {
                        setSelectedPriceRange(pr.value);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs font-medium ${
                        selectedPriceRange === pr.value
                          ? "bg-[#263B2D] text-white"
                          : "bg-white text-[#191C18] border border-[#B8A28A]/20"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#B8A28A]/20">
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 text-center text-xs font-semibold text-red-600 border border-red-200 rounded-xl mb-2"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold bg-[#58111A] hover:bg-[#3B0A11] text-white rounded-xl shadow-md"
              >
                Apply &amp; View ({products.length} Gifts)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
          <p className="text-sm font-serif text-[#191C18]">Loading Basket of Happiness collection...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
