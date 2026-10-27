import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const occasion = searchParams.get("occasion");
    const giftType = searchParams.get("giftType");
    const minPrice = searchParams.get("minPrice") ? parseInt(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : undefined;
    const availability = searchParams.get("availability"); // "in-stock"
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "24")));

    // Build Prisma query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (featured) {
      where.isFeatured = true;
    }

    if (availability === "in-stock") {
      where.stock = { gt: 0 };
      where.isAvailable = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (occasion) {
      // Allow slug or title matching
      where.occasion = {
        contains: occasion.replace(/-/g, " "),
      };
    }

    if (giftType) {
      where.giftType = giftType;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { occasion: { contains: search } },
      ];
    }

    // Build orderBy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "rating") {
      orderBy = { rating: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "popularity") {
      orderBy = { reviewCount: "desc" };
    } else if (sort === "featured") {
      orderBy = [{ isFeatured: "desc" }, { rating: "desc" }];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: "asc" },
          },
          personalisationOptions: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Products query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      specifications,
      price,
      originalPrice,
      discountPercent,
      stock,
      isAvailable,
      isFeatured,
      occasion,
      giftType,
      categoryId,
      images,
      tags,
    } = body;

    if (!name || !description || !price || !occasion) {
      return NextResponse.json(
        { error: "Name, description, price, and occasion are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        specifications,
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        stock: stock !== undefined ? parseInt(stock) : 30,
        isAvailable: isAvailable !== false,
        isFeatured: Boolean(isFeatured),
        occasion,
        giftType: giftType || "Hamper",
        categoryId: categoryId || null,
        tags: tags || "",
        images: {
          create: (images || []).map((img: { url: string; alt?: string; isPrimary?: boolean }, idx: number) => ({
            url: img.url,
            alt: img.alt || name,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            displayOrder: idx,
          })),
        },
        personalisationOptions: {
          create: [
            {
              title: "Personalise Your Gift",
              allowRecipientName: true,
              allowCustomMessage: true,
              allowGiftCard: true,
              allowPhotoUpload: true,
              allowGiftWrap: true,
              giftWrapPrice: 99,
              availableColors: JSON.stringify(["Warm Champagne", "Forest Velvet", "Muted Rose"]),
            },
          ],
        },
      },
      include: {
        images: true,
        category: true,
        personalisationOptions: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
