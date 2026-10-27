"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface OccasionCard {
  name: string;
  slug: string;
  image: string;
  subtitle: string;
}

const OCCASIONS: OccasionCard[] = [
  {
    name: "Birthday",
    slug: "birthday",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    subtitle: "Cakes, treats & surprises",
  },
  {
    name: "Anniversary",
    slug: "anniversary",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
    subtitle: "Roses, candles & romance",
  },
  {
    name: "Thank You",
    slug: "thank-you",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    subtitle: "Heartfelt gratitude tokens",
  },
  {
    name: "Baby Gifts",
    slug: "baby-gifts",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    subtitle: "Gentle newborn joy",
  },
  {
    name: "Just Because",
    slug: "just-because",
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
    subtitle: "Spontaneous smiles",
  },
  {
    name: "For Him",
    slug: "for-him",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    subtitle: "Grooming & refined trunks",
  },
  {
    name: "For Her",
    slug: "for-her",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    subtitle: "Botanical self-care sets",
  },
  {
    name: "Festive Gifts",
    slug: "festive-gifts",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
    subtitle: "Brass diyas & confections",
  },
];

export default function OccasionSlider() {
  return (
    <section className="py-16 md:py-20 bg-[#FFF9F0] border-b border-[#B8A28A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B8A28A] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thoughtfully Categorised</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18]">
              Shop by Occasion
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold tracking-wider uppercase text-[#263B2D] hover:text-[#191C18] flex items-center gap-2 group transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.slug}
              href={`/shop?occasion=${occ.slug}`}
              className="group relative flex flex-col items-center rounded-2xl bg-white border-2 border-[#58111A]/15 p-3 hover:border-[#58111A] hover:shadow-xl hover:shadow-[#58111A]/10 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              {/* Category Circle Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-[#FAF0F2] border-2 border-[#58111A]/25 group-hover:border-[#58111A] shadow-sm relative group-hover:scale-105 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Arrow */}
              <h3 className="font-serif text-sm font-medium text-[#191C18] group-hover:text-[#58111A] transition-colors">
                {occ.name}
              </h3>
              <p className="text-[10px] text-[#191C18]/50 line-clamp-1 mt-0.5 mb-2 hidden sm:block">
                {occ.subtitle}
              </p>

              <div className="w-6 h-6 rounded-full bg-[#FAF0F2] group-hover:bg-[#58111A] group-hover:text-white text-[#58111A] flex items-center justify-center transition-all mt-auto">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
