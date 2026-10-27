import React from "react";
import prisma from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import OccasionSlider from "@/components/home/OccasionSlider";
import BestsellingSection from "@/components/home/BestsellingSection";
import HamperPromoBanner from "@/components/home/HamperPromoBanner";
import EditorialPromos from "@/components/home/EditorialPromos";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
    take: 12,
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
      personalisationOptions: true,
    },
  });

  // Serialize dates for client components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: Product[] = dbProducts.map((p: any) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <OccasionSlider />
      <BestsellingSection initialProducts={products} />
      <HamperPromoBanner />
      <EditorialPromos />
      <TestimonialsSection />
    </div>
  );
}
