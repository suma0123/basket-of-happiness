"use client";

import React, { useState } from "react";
import { Sparkles, Gift, Image as ImageIcon, Heart, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/lib/types";

interface PersonalisationSectionProps {
  customizableProduct?: Product;
}

export default function PersonalisationSection({ customizableProduct }: PersonalisationSectionProps) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const [recipientName, setRecipientName] = useState("Rhea Kapoor");
  const [personalMessage, setPersonalMessage] = useState("Wishing you a year filled with laughter, boundless joy and sweet dreams!");
  const [giftCardMessage, setGiftCardMessage] = useState("Happy 25th Birthday Rhea! Love, Aanya");
  const [chosenColor, setChosenColor] = useState("Warm Champagne");
  const [giftWrap, setGiftWrap] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80"
  );

  const colors = [
    { name: "Deep Burgundy", hex: "#58111A", border: "#7A1B28" },
    { name: "Warm Champagne", hex: "#F4EBDD", border: "#B8A28A" },
    { name: "Forest Velvet", hex: "#263B2D", border: "#344F3D" },
    { name: "Muted Rose", hex: "#D7B3A8", border: "#C59B90" },
    { name: "Midnight Charcoal", hex: "#191C18", border: "#333333" },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomGift = () => {
    // If product provided, use it; otherwise create bespoke custom happiness hamper
    const targetProduct: Product = customizableProduct || {
      id: "custom-happiness-hamper",
      name: "Bespoke Personalised Keepsake Hamper",
      slug: "bespoke-personalised-hamper",
      description: "Custom hand-lettered luxury trunk with your choice of ribbon, photo keepsake, and artisanal goodies.",
      price: 1999,
      originalPrice: 2499,
      discountPercent: 20,
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      occasion: "Personalised",
      giftType: "Hamper",
      rating: 5.0,
      reviewCount: 48,
      images: [
        {
          id: "custom-img-1",
          url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80",
          alt: "Bespoke Personalised Keepsake Hamper",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    addToCart(targetProduct, 1, {
      recipientName,
      customMessage: personalMessage,
      giftCardMessage,
      chosenColor,
      giftWrap,
      customPhotoUrl: photoPreview || undefined,
    });

    success("Your bespoke personalised gift was added to your bag!");
  };

  return (
    <section id="personalise-section" className="py-20 md:py-28 bg-[#263B2D] text-[#FFF9F0] relative overflow-hidden">
      {/* Background Subtle Flourish */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-[#1A281E]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#B8A28A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#344F3D] border border-[#B8A28A]/30 text-[#F4EBDD] text-xs font-semibold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#B8A28A]" />
              <span>Bespoke Gifting Studio</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              Make It Personal.
            </h2>

            <p className="text-base text-[#F4EBDD]/80 font-light leading-relaxed max-w-lg">
              Add names, heartfelt messages, photos or special details to make your gift truly unique and cherished for a lifetime.
            </p>

            <div className="space-y-4 pt-2">
              {/* Recipient Name */}
              <div>
                <label className="block text-xs font-semibold text-[#F4EBDD] mb-1.5 uppercase tracking-wider">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Aanya Sharma"
                  className="w-full bg-[#1A281E] border border-[#B8A28A]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F4EBDD] transition-colors"
                />
              </div>

              {/* Hand-lettered Greeting Card Note */}
              <div>
                <label className="block text-xs font-semibold text-[#F4EBDD] mb-1.5 uppercase tracking-wider">
                  Card Message (Calligraphy Printed)
                </label>
                <textarea
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  rows={2}
                  placeholder="Write your heartfelt note..."
                  className="w-full bg-[#1A281E] border border-[#B8A28A]/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F4EBDD] transition-colors"
                />
              </div>

              {/* Ribbon Palette Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#F4EBDD] mb-2 uppercase tracking-wider">
                  Select Satin Ribbon Theme: <span className="text-[#B8A28A]">{chosenColor}</span>
                </label>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setChosenColor(color.name)}
                      className={`h-9 px-3 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all ${
                        chosenColor === color.name
                          ? "border-white bg-[#344F3D] ring-2 ring-white/30"
                          : "border-white/20 bg-[#1A281E] hover:border-white/50"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-white text-[11px]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload for Keepsake Frame */}
              <div>
                <label className="block text-xs font-semibold text-[#F4EBDD] mb-1.5 uppercase tracking-wider">
                  Upload Photo for Memory Keepsake (Optional)
                </label>
                <label className="flex items-center gap-3 bg-[#1A281E] border border-[#B8A28A]/40 rounded-xl px-4 py-2.5 cursor-pointer hover:border-[#F4EBDD] transition-colors">
                  <ImageIcon className="w-5 h-5 text-[#B8A28A]" />
                  <span className="text-xs text-white/80 truncate">
                    {photoPreview ? "Custom photo selected (Click to replace)" : "Choose a photo (PNG, JPG up to 5MB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Gift Wrap Toggle */}
              <label className="flex items-center gap-3 bg-[#1A281E]/60 border border-[#B8A28A]/30 p-3 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded text-[#263B2D] focus:ring-[#F4EBDD]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white">Signature Velvet Gift Wrap</span>
                  <span className="text-[#B8A28A] ml-1.5">(+₹99 • Handcrafted Wax Seal included)</span>
                </div>
              </label>

              {/* Add Custom Gift CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddCustomGift}
                  className="w-full py-4 bg-[#58111A] hover:bg-[#3B0A11] text-[#FAF0F2] border border-[#7A1B28]/50 font-semibold text-xs tracking-widest uppercase rounded-full shadow-2xl hover:shadow-[#58111A]/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FAF0F2]" />
                  <span>Create & Add Personalised Gift — ₹{1999 + (giftWrap ? 99 : 0)}</span>
                  <ArrowRight className="w-4 h-4 text-[#FAF0F2] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#FFF9F0] text-[#191C18] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#58111A]/25">
              <div className="flex items-center justify-between pb-4 border-b border-[#B8A28A]/20">
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#58111A]">
                  Live Preview
                </span>
                <span className="text-xs font-semibold text-[#58111A] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#58111A]" />
                  Bespoke Mockup
                </span>
              </div>

              {/* Trunk Mockup Card */}
              <div className="mt-5 rounded-2xl overflow-hidden bg-white border-2 border-[#58111A]/20 shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F4EBDD]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                    alt="Custom gift hamper preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Ribbon badge on the box */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#B8A28A]/30 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#191C18]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B8A28A]" />
                    <span>Ribbon: {chosenColor}</span>
                  </div>

                  {/* Attached photo preview thumbnail */}
                  {photoPreview && (
                    <div className="absolute bottom-4 right-4 w-16 h-20 rounded-lg overflow-hidden border-2 border-white shadow-xl rotate-3 bg-white p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview}
                        alt="Uploaded memory"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                {/* Live Card Mockup inside */}
                <div className="p-5 bg-[#FAF0F2]/50 border-t border-[#58111A]/15">
                  <div className="p-4 rounded-xl bg-white border-2 border-[#58111A]/20 shadow-xs relative">
                    <p className="text-[10px] uppercase tracking-widest text-[#58111A] font-bold mb-1">
                      Personalised Calligraphy Card
                    </p>
                    <p className="font-serif text-base font-semibold text-[#191C18]">
                      Dearest {recipientName || "Friend"},
                    </p>
                    <p className="font-handwriting text-lg text-[#58111A] leading-snug mt-1">
                      &ldquo;{giftCardMessage || "Wishing you infinite happiness and sweet moments."}&rdquo;
                    </p>
                    <div className="mt-2 pt-2 border-t border-[#58111A]/15 flex items-center justify-between text-[11px] text-[#191C18]/60">
                      <span>Wax Seal: Hand-stamped</span>
                      <span className="text-[#58111A] font-medium">Basket of Happiness</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
