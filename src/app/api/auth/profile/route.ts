import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address } = await req.json();

    const updateData: { name?: string; phone?: string } = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: session.userId },
        data: updateData,
      });
    }

    // If an address was submitted
    if (address && address.house && address.city && address.pinCode) {
      if (address.isDefault) {
        await prisma.userAddress.updateMany({
          where: { userId: session.userId },
          data: { isDefault: false },
        });
      }

      if (address.id) {
        // Update existing address
        await prisma.userAddress.update({
          where: { id: address.id },
          data: {
            fullName: address.fullName || session.name,
            house: address.house,
            street: address.street || "",
            city: address.city,
            state: address.state || "",
            pinCode: address.pinCode,
            phone: address.phone || phone || "",
            isDefault: Boolean(address.isDefault),
            instructions: address.instructions || null,
          },
        });
      } else {
        // Create new address
        await prisma.userAddress.create({
          data: {
            userId: session.userId,
            fullName: address.fullName || session.name,
            house: address.house,
            street: address.street || "",
            city: address.city,
            state: address.state || "",
            pinCode: address.pinCode,
            phone: address.phone || phone || "",
            isDefault: Boolean(address.isDefault),
            instructions: address.instructions || null,
          },
        });
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        addresses: { orderBy: { isDefault: "desc" } },
        wishlist: { select: { productId: true } },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        phone: updatedUser?.phone,
        role: updatedUser?.role,
        addresses: updatedUser?.addresses || [],
        wishlistIds: updatedUser?.wishlist.map((w) => w.productId) || [],
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
