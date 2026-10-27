"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Package, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export default function AboutPage() {
  return (
    <div className="bg-[#FFF9F0] min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-[#B8A28A] font-semibold">
            Our Story &amp; Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#191C18] leading-tight">
            Crafting Moments of Pure Joy, One Hamper at a Time.
          </h1>
          <p className="font-handwriting text-2xl sm:text-3xl text-[#58111A]">
            &ldquo;More Than Just Gifts, It&apos;s a Feeling.&rdquo;
          </p>
          <p className="text-sm text-[#191C18]/70 font-light leading-relaxed max-w-xl mx-auto pt-2">
            Basket of Happiness was born from a simple yet profound belief: that the most unforgettable gifts are not merely objects, but heartfelt emotions carefully packaged and gently delivered.
          </p>
        </div>

        {/* Editorial Photo Spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#FAF5EE] border border-[#B8A28A]/30 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
              alt="Artisanal hamper craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#191C18]/80 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191C18]">
              The Art of Mindful Curation
            </h2>
            <p>
              Every hamper we create starts with a story. Whether it&apos;s celebrating a milestone birthday, honoring decades of love on an anniversary, or sending a gentle &lsquo;thinking of you&rsquo;, we handpick each treasure with discerning care.
            </p>
            <p>
              We partner with local Indian artisans, small-batch chocolatiers, organic tea growers, and ethical candle makers to ensure every sensory element—from the scent of fresh vanilla bean soy wax to the crunch of artisanal almond brittle—evokes pure delight.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/basket_of_happi_nesss/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 shadow-md hover:shadow-lg rounded-full text-xs font-semibold transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow on Instagram</span>
              </a>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58111A] hover:underline"
              >
                <span>Browse Hampers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#58111A]/20 shadow-xl shadow-[#58111A]/5 space-y-8 animate-fade-in-up">
          <div className="text-center max-w-lg mx-auto">
            <h2 className="font-serif text-3xl font-medium text-[#191C18] mb-2">
              Our Core Promises
            </h2>
            <p className="text-xs text-[#191C18]/60">
              The foundational pillars that guide every unboxing experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#191C18]/80">
            <div className="p-5 rounded-2xl bg-[#FAF0F2]/50 border-2 border-[#58111A]/15 hover:border-[#58111A] transition-all space-y-2 hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-[#58111A] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#191C18]">
                Authentic Craftsmanship
              </h3>
              <p className="leading-relaxed">
                Zero cheap fillers or generic plastics. Every trunk is made from real reusable pine wood, hand-sewn velvet, or luxury rigid boards with brass clasps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF0F2]/50 border-2 border-[#58111A]/15 hover:border-[#58111A] transition-all space-y-2 hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-[#58111A] text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#191C18]">
                The Personal Touch
              </h3>
              <p className="leading-relaxed">
                We hand-stamp signature wax seals, calligraphy-print your heartfelt words on textured paper, and custom-emboss monograms for that authentic bespoke charm.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF0F2]/50 border-2 border-[#58111A]/15 hover:border-[#58111A] transition-all space-y-2 hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-[#58111A] text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#191C18]">
                Punctual Safe Transit
              </h3>
              <p className="leading-relaxed">
                Delivering to 26,000+ pin codes across India with premium courier partners, live SMS tracking, and delicate fragility safeguards.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Policies Section */}
        <div id="policies" className="space-y-6 pt-4">
          <h2 className="font-serif text-2xl font-medium text-[#191C18]">
            Customer Policies &amp; Assurance
          </h2>

          <div className="space-y-4 text-xs text-[#191C18]/80">
            <div id="shipping" className="bg-white p-6 rounded-2xl border border-[#B8A28A]/20">
              <h3 className="font-bold text-sm text-[#191C18] mb-1">
                Pan-India Shipping Policy
              </h3>
              <p className="leading-relaxed">
                All ready-to-ship hampers are dispatched within 24 hours of order placement. Standard delivery reaches metro cities in 2-3 business days and rest of India in 3-5 business days. We provide end-to-end tracking links via SMS and email.
              </p>
            </div>

            <div id="returns" className="bg-white p-6 rounded-2xl border border-[#B8A28A]/20">
              <h3 className="font-bold text-sm text-[#191C18] mb-1">
                Returns &amp; Replacement Assurance
              </h3>
              <p className="leading-relaxed">
                Because our hampers contain perishable gourmet treats and customized engraved keepsakes, standard returns are not accepted. However, if any item arrives damaged in transit, we provide a 100% free prompt replacement with zero hassle. Simply message our concierge within 48 hours of delivery.
              </p>
            </div>

            <div id="privacy" className="bg-white p-6 rounded-2xl border border-[#B8A28A]/20">
              <h3 className="font-bold text-sm text-[#191C18] mb-1">
                Privacy &amp; Data Protection
              </h3>
              <p className="leading-relaxed">
                Your personal details, recipient addresses, and private card messages are held in strict confidence and are never sold or shared with third-party advertisers. All payments are encrypted through PCI-DSS Level 1 compliant gateways.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
