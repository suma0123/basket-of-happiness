"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

interface BestsellingSectionProps {
  initialProducts: Product[];
}

export default function BestsellingSection({ initialProducts }: BestsellingSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const filteredProducts = activeTab === "ALL"
    ? initialProducts
    : initialProducts.filter(
        (p) =>
          p.occasion?.toLowerCase() === activeTab.toLowerCase() ||
          p.category?.slug?.toLowerCase() === activeTab.toLowerCase()
      );

  const tabs = [
    { label: "All Bestsellers", value: "ALL" },
    { label: "Birthday", value: "birthday" },
    { label: "Anniversary", value: "anniversary" },
    { label: "Thank You", value: "thank-you" },
    { label: "For Him", value: "for-him" },
    { label: "For Her", value: "for-her" },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFF9F0] border-b border-[#B8A28A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B8A28A] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Most Adored Curations</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191C18] mb-3">
            Bestselling Gifts
          </h2>
          <p className="text-sm text-[#191C18]/70 font-light leading-relaxed">
            Our most cherished hampers and bespoke celebration boxes, loved by thousands of happy gift-givers.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-[#58111A] text-white shadow-sm"
                    : "bg-white text-[#191C18]/80 border border-[#B8A28A]/30 hover:border-[#58111A] hover:text-[#58111A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 products per row on large desktop screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-3.5">
          {filteredProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF5EE] hover:bg-[#58111A] text-[#191C18] hover:text-white border border-[#B8A28A] hover:border-[#58111A] font-medium text-xs tracking-widest uppercase rounded-full shadow-xs transition-all group"
          >
            <span>View All Curated Gifts</span>
            <ArrowRight className="w-4 h-4 text-[#263B2D] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
