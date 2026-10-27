import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionUser(req);

    // Find by either id or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order belongs to a user, make sure only the owner or an admin can access full details
    if (order.userId && (!session || (session.userId !== order.userId && session.role !== "ADMIN"))) {
      // For anonymous tracking, allow public view if matching customer email was supplied via query
      const emailQuery = new URL(req.url).searchParams.get("email");
      if (!emailQuery || emailQuery.toLowerCase().trim() !== order.customerEmail.toLowerCase().trim()) {
        return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Get order details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
