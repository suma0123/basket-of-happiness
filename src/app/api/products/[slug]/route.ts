import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: "asc" },
        },
        personalisationOptions: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch related products from same category or occasion
    const relatedProducts = await prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [
          { categoryId: product.categoryId },
          { occasion: product.occasion },
        ],
      },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        category: true,
      },
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: body.name ?? product.name,
        description: body.description ?? product.description,
        specifications: body.specifications ?? product.specifications,
        price: body.price !== undefined ? parseInt(body.price) : product.price,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? parseInt(body.originalPrice) : null) : product.originalPrice,
        discountPercent: body.discountPercent !== undefined ? (body.discountPercent ? parseInt(body.discountPercent) : null) : product.discountPercent,
        stock: body.stock !== undefined ? parseInt(body.stock) : product.stock,
        isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : product.isAvailable,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : product.isFeatured,
        occasion: body.occasion ?? product.occasion,
        giftType: body.giftType ?? product.giftType,
        categoryId: body.categoryId !== undefined ? body.categoryId : product.categoryId,
        tags: body.tags ?? product.tags,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: product.id } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
