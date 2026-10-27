import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [
      totalOrders,
      totalRevenueResult,
      pendingOrders,
      productsCount,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.order.count({
        where: {
          fulfilmentStatus: {
            in: ["ORDER_PLACED", "PAYMENT_CONFIRMED", "PROCESSING"],
          },
        },
      }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 25 } },
        select: { id: true, name: true, stock: true, price: true, slug: true },
        orderBy: { stock: "asc" },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenueResult._sum.totalAmount || 0,
        pendingOrders,
        productsCount,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
