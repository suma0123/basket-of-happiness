import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// GET /api/hamper-boxes - Fetch all available boxes for the builder
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";

    const boxes = await prisma.hamperBox.findMany({
      where: includeAll ? {} : { isAvailable: true },
      orderBy: [{ displayOrder: "asc" }, { price: "asc" }],
    });

    return NextResponse.json({ success: true, boxes });
  } catch (error) {
    console.error("Error fetching hamper boxes:", error);
    return NextResponse.json(
      { error: "Failed to fetch hamper boxes" },
      { status: 500 }
    );
  }
}

// POST /api/hamper-boxes - Admin create box
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, dimensions, capacity, image, isAvailable, displayOrder } = body;

    if (!name || !price || !image) {
      return NextResponse.json(
        { error: "Name, price, and image are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const newBox = await prisma.hamperBox.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || "",
        price: Number(price),
        dimensions: dimensions?.trim() || null,
        capacity: capacity?.trim() || null,
        image: image.trim(),
        isAvailable: isAvailable ?? true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, box: newBox });
  } catch (error) {
    console.error("Error creating hamper box:", error);
    return NextResponse.json(
      { error: "Failed to create hamper box" },
      { status: 500 }
    );
  }
}

// PATCH /api/hamper-boxes - Admin update box
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, description, price, dimensions, capacity, image, isAvailable, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: "Box ID is required" }, { status: 400 });
    }

    const updatedBox = await prisma.hamperBox.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(dimensions !== undefined && { dimensions: dimensions.trim() }),
        ...(capacity !== undefined && { capacity: capacity.trim() }),
        ...(image !== undefined && { image: image.trim() }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    return NextResponse.json({ success: true, box: updatedBox });
  } catch (error) {
    console.error("Error updating hamper box:", error);
    return NextResponse.json(
      { error: "Failed to update hamper box" },
      { status: 500 }
    );
  }
}
