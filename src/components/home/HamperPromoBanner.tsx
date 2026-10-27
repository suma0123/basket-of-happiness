import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Gift, Heart, Box, Check } from "lucide-react";

export default function HamperPromoBanner() {
  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF5EE] overflow-hidden border-y border-[#B8A28A]/20">
      {/* Decorative luxury background accents */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E5DACD]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#D7B3A8]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#263B2D] via-[#1E3024] to-[#142219] rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 lg:p-16 text-white shadow-2xl overflow-hidden relative border border-[#B8A28A]/20">
          {/* Deep Burgundy ambient velvet glow accent */}
          <div
            className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#58111A]/40 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Subtle gold ribbon decorative SVG in background */}
          <div
            className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none select-none text-[#F4EBDD]"
            aria-hidden="true"
          >
            <Gift className="w-96 h-96" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left relative z-10">
              {/* Small Label with Royal Burgundy highlight */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#58111A]/85 to-[#263B2D]/80 border border-[#7A1B28]/40 backdrop-blur-md text-[#FAF0F2] text-[11px] font-semibold tracking-widest uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F4EBDD]" />
                <span>YOUR GIFT, YOUR WAY</span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#FFF9F0] leading-[1.15]">
                Create a Hamper That{" "}
                <span className="italic font-normal text-[#F4EBDD]">
                  Feels Like You.
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-[#FAF5EE]/85 max-w-xl font-light leading-relaxed">
                Choose your favourite treats, flowers, chocolates, candles, and
                little surprises to create a gift that&apos;s truly personal.
              </p>

              {/* Feature highlight pills */}
              <div className="pt-2 flex flex-wrap gap-3 text-xs text-[#FAF5EE]/90">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
                  <Check className="w-3.5 h-3.5 text-[#F4EBDD]" />
                  <span>Curate Every Item</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
                  <Check className="w-3.5 h-3.5 text-[#F4EBDD]" />
                  <span>Artisanal Keepsake Boxes</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
                  <Check className="w-3.5 h-3.5 text-[#F4EBDD]" />
                  <span>Handwritten Card Included</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/build-your-hamper"
                  className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 bg-[#58111A] hover:bg-[#3B0A11] text-[#FAF0F2] font-medium text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#58111A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-[#7A1B28]/50 group"
                >
                  <span className="font-semibold">BUILD YOUR OWN HAMPER</span>
                  <ArrowRight className="w-4 h-4 text-[#FAF0F2] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Visual Column — Interactive Studio Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-[#F4EBDD]" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-[#F4EBDD]">
                      Interactive Studio
                    </span>
                  </div>
                  <span className="text-[11px] text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                    4 Easy Steps
                  </span>
                </div>

                {/* Steps Visual Preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 border border-white/15">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF9F0] text-[#263B2D] flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#FFF9F0]">Choose Your Box</p>
                      <p className="text-[11px] text-[#FAF5EE]/70">From Little Joy to Luxury Celebration</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 border border-white/15">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF9F0] text-[#263B2D] flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#FFF9F0]">Add Your Favourites</p>
                      <p className="text-[11px] text-[#FAF5EE]/70">Chocolates, candles, flowers &amp; plush toys</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 border border-white/15">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF9F0] text-[#263B2D] flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#FFF9F0]">Personalise It</p>
                      <p className="text-[11px] text-[#FAF5EE]/70">Velvet ribbons, wax seals &amp; gift note</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/10 border border-white/15">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF9F0] text-[#263B2D] flex items-center justify-center font-bold text-xs shrink-0">
                      4
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#FFF9F0]">Review &amp; Deliver</p>
                      <p className="text-[11px] text-[#FAF5EE]/70">Live 3D-styled preview and instant checkout</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-[#FAF5EE]/75 italic font-light">
                    &ldquo;Curated with love, delivered with pure joy.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
