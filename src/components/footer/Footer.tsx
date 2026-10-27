"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Heart, Sparkles, Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";

export default function Footer() {
  const { success } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    success("Thank you for joining our happiness circle! Look out for exclusive gifting previews.");
    setEmail("");
  };

  return (
    <footer className="bg-[#191C18] text-[#FFF9F0] border-t border-[#263B2D]/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#F4EBDD]">
                Basket of Happiness
              </span>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#B8A28A] -mt-1 font-sans">
                Artisanal Luxury Gifting
              </p>
            </Link>

            <p className="font-handwriting text-2xl text-[#D7B3A8] leading-tight">
              &ldquo;Spreading happiness, one gift at a time.&rdquo;
            </p>

            <p className="text-xs text-white/70 font-light leading-relaxed max-w-sm">
              Thoughtfully curated hampers, bespoke keepsakes, and personalised gifts crafted to celebrate the deepest human connections across India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/basket_of_happi_nesss/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#263B2D] text-[#F4EBDD] flex items-center justify-center transition-colors"
                aria-label="Instagram @basket_of_happi_nesss"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#263B2D] text-white text-xs font-medium flex items-center gap-1.5 hover:bg-[#344F3D] transition-colors"
              >
                <Phone className="w-3 h-3 text-[#F4EBDD]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8A28A]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-[#F4EBDD] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#F4EBDD] transition-colors">
                  Shop All Gifts
                </Link>
              </li>
              <li>
                <Link href="/shop?occasion=birthday" className="hover:text-[#F4EBDD] transition-colors">
                  Birthday Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?occasion=anniversary" className="hover:text-[#F4EBDD] transition-colors">
                  Anniversary Curations
                </Link>
              </li>
              <li>
                <Link href="/shop?occasion=personalised" className="hover:text-[#F4EBDD] transition-colors text-[#D7B3A8]">
                  Personalised Gifts
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F4EBDD] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F4EBDD] transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8A28A]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/track-order" className="hover:text-[#F4EBDD] transition-colors flex items-center gap-1">
                  <span>Track Your Order</span>
                  <span className="text-[9px] bg-[#263B2D] text-[#F4EBDD] px-1.5 py-0.2 rounded">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/contact#faqs" className="hover:text-[#F4EBDD] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-[#F4EBDD] transition-colors">
                  Pan-India Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/about#returns" className="hover:text-[#F4EBDD] transition-colors">
                  Returns &amp; Replacement Policy
                </Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-[#F4EBDD] transition-colors">
                  Privacy Policy &amp; Security
                </Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-[#F4EBDD] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8A28A]">
              The Happiness Circle
            </h4>
            <p className="text-xs text-white/70 font-light leading-relaxed">
              Subscribe for exclusive member privileges, seasonal gift previews, and private discounts.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F4EBDD] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#58111A] hover:bg-[#3B0A11] text-[#FAF0F2] rounded-lg text-xs font-medium transition-colors flex items-center justify-center shadow-xs"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-white/40">
                🔒 We respect your privacy. No spam, ever.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Basket of Happiness. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>for magical moments across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
