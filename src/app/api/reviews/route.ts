import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "10");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isApproved: true };
    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const { productId, rating, comment, authorName } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: "Product, rating, and review comment are required" },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating)));

    // Check if user previously ordered this product
    let isVerified = false;
    if (session) {
      const pastOrder = await prisma.order.findFirst({
        where: {
          userId: session.userId,
          items: {
            some: { productId },
          },
        },
      });
      if (pastOrder) {
        isVerified = true;
      }
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session?.userId || null,
        authorName: authorName ? authorName.trim() : session?.name || "Verified Customer",
        rating: numericRating,
        comment: comment.trim(),
        isVerifiedPurchase: isVerified,
        isApproved: true, // Approved by default for interactive demo
      },
    });

    // Update product rating aggregate
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
