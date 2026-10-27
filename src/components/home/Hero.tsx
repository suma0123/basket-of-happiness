"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Palette,
  ChevronDown,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is muted for reliable autoplay policy compliance
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be blocked by user/power settings; handle gracefully
        setHasPlaybackError(true);
      });
    }
  }, []);

  const scrollToContent = () => {
    const nextSection = document.getElementById("trust-bar") || document.getElementById("occasion-slider");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        className="hero relative w-full h-[100svh] min-h-[600px] overflow-hidden bg-[#101411] flex items-center"
        aria-label="Basket of Happiness - Luxury Video Hero"
      >
        {/* Full-bleed Edge-to-Edge Background Video */}
        <video
          ref={videoRef}
          className={`hero-video absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-90"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasPlaybackError(true)}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/ecom.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        {/* Fallback poster background if video cannot play */}
        {hasPlaybackError && (
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/videos/hero-poster.jpg')" }}
            aria-hidden="true"
          />
        )}

        {/* Cinematic Gradient Overlays for High Legibility & Elegance */}
        {/* 1. Base Left-to-Right Scrim: Darkens left side for text while leaving right side open */}
        <div
          className="hero-overlay absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/85 via-black/45 to-black/20 md:to-transparent"
          aria-hidden="true"
        />

        {/* 2. Top-to-Bottom Scrim: Enhances contrast for transparent navigation bar */}
        <div
          className="absolute inset-x-0 top-0 h-44 z-10 pointer-events-none bg-gradient-to-b from-black/75 via-black/30 to-transparent"
          aria-hidden="true"
        />

        {/* 3. Bottom Scrim: Elegant visual grounding into page content */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden="true"
        />

        {/* Hero Content: Minimal, Elegant & Left-Aligned on Desktop */}
        <div className="hero-content relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col justify-center">
          <div className="max-w-2xl text-left space-y-6">
            {/* Tagline Badge */}
            <div className="animate-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-[#F4EBDD] text-xs font-semibold tracking-widest uppercase backdrop-blur-md shadow-sm transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-[#F4EBDD]" />
              <span>Basket of Happiness • Artisanal Gifting</span>
            </div>

            {/* Main Headline */}
            <h1 className="animate-hero-headline font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
              More Than Just Gifts,
              <br />
              <span className="italic font-normal text-[#F4EBDD]">
                It&apos;s a Feeling.
              </span>
            </h1>

            {/* Description */}
            <p className="animate-hero-desc text-base sm:text-lg md:text-xl text-[#FAF5EE]/90 max-w-xl font-light leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
              Thoughtfully curated gifts and hampers for every special moment.
            </p>

            {/* Call to Actions */}
            <div className="animate-hero-cta pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#58111A] hover:bg-[#3B0A11] text-[#FAF0F2] hover:text-white font-medium text-xs tracking-widest uppercase rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 border border-[#7A1B28]/50 group"
              >
                <span>Explore Gifts</span>
                <ArrowRight className="w-4 h-4 text-[#FAF0F2] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/build-your-hamper"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-[#FFF9F0] hover:text-white border border-white/35 hover:border-white font-medium text-xs tracking-widest uppercase rounded-full backdrop-blur-md shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <Palette className="w-4 h-4 text-[#F4EBDD]" />
                <span>Build Your Own Hamper</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Smooth Scroll Cue (Bottom-Center) */}
        <button
          type="button"
          onClick={scrollToContent}
          className="animate-hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll to discover gifts"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-light text-white/80 group-hover:text-white">
            Discover
          </span>
          <ChevronDown className="w-4 h-4 text-[#F4EBDD] animate-bounce" />
        </button>
      </section>

      {/* Trust & Craftsmanship Bar immediately following full-screen hero */}
      <div
        id="trust-bar"
        className="w-full bg-[#FAF5EE] border-b border-[#B8A28A]/20 py-5 px-4 sm:px-6 lg:px-8 transition-colors"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="flex items-center justify-center md:justify-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-[#263B2D]/10 flex items-center justify-center text-[#263B2D] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-[#191C18]">Artisanal Quality</h4>
              <p className="text-xs text-[#191C18]/65">Handpicked premium confections, decor & keepsakes</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-[#263B2D]/10 flex items-center justify-center text-[#263B2D] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-[#191C18]">Express Pan-India Transit</h4>
              <p className="text-xs text-[#191C18]/65">Safe courier packaging delivered with care</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-full bg-[#263B2D]/10 flex items-center justify-center text-[#263B2D] shrink-0">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide uppercase text-[#191C18]">Personal Touch</h4>
              <p className="text-xs text-[#191C18]/65">Custom names, photos & handwritten calligraphy notes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
