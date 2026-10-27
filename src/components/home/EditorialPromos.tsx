"use client";

import React from "react";
import Link from "next/link";
import { Gift, HeartHandshake, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function EditorialPromos() {
  const pillars = [
    {
      title: "Custom Hampers",
      subtitle: "For Every Occasion",
      description: "From intimate anniversaries to opulent grand celebrations, curate bespoke treasures tailored to your story.",
      icon: Gift,
      image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80",
      link: "/shop?personalised=true",
    },
    {
      title: "Free Gift Wrap",
      subtitle: "With Pure Love",
      description: "Every hamper is dressed in our signature velvet ribbons, botanical wax seals, and embossed greeting stationery.",
      icon: HeartHandshake,
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      link: "/about",
    },
    {
      title: "On-Time Delivery",
      subtitle: "Across India",
      description: "Delivering nationwide with temperature-controlled transit, real-time live tracking, and guaranteed delivery dates.",
      icon: Clock,
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
      link: "/track-order",
    },
  ];

  return (
    <section className="py-20 bg-[#FFF9F0] border-b border-[#B8A28A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Three Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative rounded-3xl overflow-hidden bg-white border-2 border-[#58111A]/15 p-6 sm:p-8 flex flex-col justify-between hover:border-[#58111A] hover:shadow-2xl hover:shadow-[#58111A]/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Decorative image background top */}
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-[#FAF0F2] relative border border-[#58111A]/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-[#58111A] shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] tracking-widest uppercase font-semibold text-[#B8A28A] mb-1">
                    {pillar.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl font-medium text-[#191C18] mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#191C18]/70 leading-relaxed font-light mb-6">
                    {pillar.description}
                  </p>
                </div>

                <Link
                  href={pillar.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#58111A] group-hover:text-[#3B0A11] transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Seasonal Festive Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#191C18] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border-2 border-[#58111A]/40">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-25 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1400&q=80"
              alt="Festive gifts"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#58111A]/40 border border-[#7A1B28]/60 text-[#FAF0F2] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A08A]" />
              <span>Limited Festive Edition</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-tight">
              Celebrate the Season of Joy &amp; Wonder
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Order handcrafted royal hampers with artisanal sweets, pure brass lotus diyas, and personalised greetings. Use coupon code <strong className="text-[#FAF0F2] underline decoration-[#58111A]">FESTIVE20</strong> for 20% off.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?occasion=festive-gifts"
                className="px-8 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-[#FAF0F2] font-semibold text-xs tracking-widest uppercase rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#58111A]/40 border border-[#7A1B28]/50 transition-all flex items-center gap-2 group"
              >
                <span>Explore Festive Collection</span>
                <ArrowRight className="w-4 h-4 text-[#FAF0F2] group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-xs text-white/70">
                ✨ Complimentary Gift Box on Orders &gt; ₹1,999
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
