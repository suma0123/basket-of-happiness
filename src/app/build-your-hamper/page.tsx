import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import HamperBuilder from "@/components/hamper/HamperBuilder";
import { Sparkles } from "lucide-react";
import { Product, HamperBox } from "@/lib/types";

export const metadata: Metadata = {
  title: "Build Your Own Hamper — Basket of Happiness",
  description:
    "Curate a personalized luxury gift hamper. Choose artisanal keepsake boxes, chocolates, candles, flowers, and handwritten notes.",
};

export const dynamic = "force-dynamic";

export default async function BuildYourHamperPage() {
  // 1. Fetch available hamper boxes ordered by display order and price
  const dbBoxes = await prisma.hamperBox.findMany({
    where: { isAvailable: true },
    orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
  });

  // 2. Fetch products eligible for custom hampers with category & images
  const dbProducts = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  // 3. Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  // Serialize dates for client components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: Product[] = dbProducts.map((p: any) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boxes: HamperBox[] = dbBoxes.map((b: any) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return (
    <main className="bg-[#FAF5EE] min-h-screen">
      {/* Studio Page Header */}
      <div className="bg-[#FFF9F0] border-b border-[#B8A28A]/20 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#263B2D]/10 text-[#263B2D] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#B8A28A]" />
            <span>Interactive Gifting Studio</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#191C18]">
            Build Your Own Hamper
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#B8A28A]">
            Every little detail, chosen by you.
          </p>

          <p className="text-xs sm:text-sm text-[#191C18]/70 max-w-xl mx-auto font-light leading-relaxed">
            Start with an empty hamper, explore our collection, and choose the little
            things that will make someone&apos;s day unforgettable.
          </p>
        </div>
      </div>

      {/* Main Client Builder */}
      <HamperBuilder
        initialBoxes={boxes}
        initialProducts={products}
        categories={categories}
      />
    </main>
  );
}
