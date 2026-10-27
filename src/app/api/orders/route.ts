import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      house,
      street,
      city,
      state,
      pinCode,
      deliveryInstructions,
      deliveryMethod,
      giftMessage,
      giftWrap,
      giftWrapTheme,
      couponCode,
      paymentMethod,
      items,
    } = body;

    // Basic validation
    if (!customerName || !customerEmail || !customerPhone || !house || !city || !pinCode) {
      return NextResponse.json(
        { error: "Customer details and delivery address are required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping bag is empty" },
        { status: 400 }
      );
    }

    // GATHER ALL PRODUCT & BOX IDS FOR SERVER-SIDE VALIDATION
    const standardProductIds: string[] = [];
    const hamperBoxIds: string[] = [];
    const hamperProductIds: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.forEach((item: any) => {
      if (item.isCustomHamper && item.customHamper) {
        if (item.customHamper.box?.id) {
          hamperBoxIds.push(item.customHamper.box.id);
        }
        if (Array.isArray(item.customHamper.items)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          item.customHamper.items.forEach((ci: any) => {
            const pId = ci.product?.id || ci.productId;
            if (pId) hamperProductIds.push(pId);
          });
        }
      } else if (item.productId) {
        standardProductIds.push(item.productId);
      }
    });

    const allProductIds = Array.from(new Set([...standardProductIds, ...hamperProductIds]));
    const [dbProducts, dbBoxes] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: allProductIds } },
        include: { images: true },
      }),
      hamperBoxIds.length > 0
        ? prisma.hamperBox.findMany({
            where: { id: { in: hamperBoxIds } },
          })
        : [],
    ]);

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    const boxMap = new Map(dbBoxes.map((b) => [b.id, b]));

    let calculatedSubtotal = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItemsData: any[] = [];
    const inventoryDecrements: { productId: string; quantity: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customConfigsToCreate: any[] = [];

    for (const item of items) {
      if (item.isCustomHamper && item.customHamper) {
        // --- CUSTOM HAMPER VALIDATION & PRICING ---
        const ch = item.customHamper;
        const dbBox = boxMap.get(ch.box?.id);
        if (!dbBox) {
          return NextResponse.json(
            { error: `Selected hamper box "${ch.box?.name || "Box"}" is no longer available.` },
            { status: 400 }
          );
        }

        if (!Array.isArray(ch.items) || ch.items.length === 0) {
          return NextResponse.json(
            { error: "A custom hamper must include at least one product." },
            { status: 400 }
          );
        }

        let hamperProductsTotal = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const verifiedHamperItems: any[] = [];

        for (const ci of ch.items) {
          const pId = ci.product?.id || ci.productId;
          const dbProduct = productMap.get(pId);
          if (!dbProduct) {
            return NextResponse.json(
              { error: `Product in hamper not found: ${pId}` },
              { status: 400 }
            );
          }

          const itemTotalRequiredQty = (ci.quantity || 1) * item.quantity;
          if (dbProduct.stock < itemTotalRequiredQty) {
            return NextResponse.json(
              {
                error: `Insufficient stock for "${dbProduct.name}" in your hamper. Only ${dbProduct.stock} available.`,
              },
              { status: 400 }
            );
          }

          hamperProductsTotal += dbProduct.price * (ci.quantity || 1);
          inventoryDecrements.push({
            productId: dbProduct.id,
            quantity: itemTotalRequiredQty,
          });

          verifiedHamperItems.push({
            productId: dbProduct.id,
            productName: dbProduct.name,
            quantity: ci.quantity || 1,
            unitPrice: dbProduct.price,
            selectedVariant: ci.selectedVariant || null,
          });
        }

        // Wrapping price
        let wrappingFee = 0;
        const wrapTheme = ch.personalisation?.giftWrap || "Classic";
        if (wrapTheme === "Premium" || wrapTheme === "Premium Velvet") wrappingFee = 99;
        else if (wrapTheme === "Occasion" || wrapTheme === "Occasion Themed") wrappingFee = 149;

        // Extras price
        let extrasFee = 0;
        if (Array.isArray(ch.personalisation?.extras)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ch.personalisation.extras.forEach((ext: any) => {
            if (ext.price) extrasFee += Number(ext.price);
          });
        }

        const customisationTotal = wrappingFee + extrasFee;
        const hamperUnitPrice = dbBox.price + hamperProductsTotal + customisationTotal;
        const rowTotal = hamperUnitPrice * item.quantity;
        calculatedSubtotal += rowTotal;

        const customDetailsSnapshot = {
          isCustomHamper: true,
          box: {
            id: dbBox.id,
            name: dbBox.name,
            price: dbBox.price,
            image: dbBox.image,
            dimensions: dbBox.dimensions,
            capacity: dbBox.capacity,
          },
          items: verifiedHamperItems,
          personalisation: {
            ...ch.personalisation,
            wrappingFee,
            extrasFee,
          },
          boxPrice: dbBox.price,
          itemsPrice: hamperProductsTotal,
          customisationPrice: customisationTotal,
          totalPrice: hamperUnitPrice,
        };

        orderItemsData.push({
          productId: null,
          productName: `Custom Hamper — ${dbBox.name}`,
          productImage: dbBox.image,
          unitPrice: hamperUnitPrice,
          quantity: item.quantity,
          totalPrice: rowTotal,
          recipientName: ch.personalisation?.recipientName || null,
          customMessage: ch.personalisation?.cardMessage || null,
          giftCardMessage: ch.personalisation?.cardMessage || null,
          chosenColor: ch.personalisation?.ribbonColor || null,
          customDetails: JSON.stringify(customDetailsSnapshot),
        });

        customConfigsToCreate.push({
          userId: session?.userId || null,
          boxId: dbBox.id,
          occasion: ch.personalisation?.occasion || "Just Because",
          wrappingTheme: wrapTheme,
          wrappingPrice: wrappingFee,
          ribbonColor: ch.personalisation?.ribbonColor || "Warm Champagne",
          senderName: ch.personalisation?.senderName || null,
          recipientName: ch.personalisation?.recipientName || null,
          cardMessage: ch.personalisation?.cardMessage || null,
          extrasDetails: JSON.stringify(ch.personalisation?.extras || []),
          subtotal: hamperProductsTotal,
          totalPrice: hamperUnitPrice,
          items: verifiedHamperItems,
        });
      } else {
        // --- STANDARD PRODUCT ITEM ---
        const dbProduct = productMap.get(item.productId);
        if (!dbProduct) {
          return NextResponse.json(
            { error: `Product not found: ${item.productId}` },
            { status: 400 }
          );
        }

        if (dbProduct.stock < item.quantity) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} left.`,
            },
            { status: 400 }
          );
        }

        const wrapAddon = item.personalisation?.giftWrap ? 99 : 0;
        const unitPrice = dbProduct.price + wrapAddon;
        const rowTotal = unitPrice * item.quantity;
        calculatedSubtotal += rowTotal;

        const primaryImg =
          dbProduct.images.find((img) => img.isPrimary)?.url ||
          dbProduct.images[0]?.url ||
          "";

        inventoryDecrements.push({
          productId: dbProduct.id,
          quantity: item.quantity,
        });

        orderItemsData.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          productImage: primaryImg,
          unitPrice,
          quantity: item.quantity,
          totalPrice: rowTotal,
          recipientName: item.personalisation?.recipientName || null,
          customMessage: item.personalisation?.customMessage || null,
          giftCardMessage: item.personalisation?.giftCardMessage || null,
          customPhotoUrl: item.personalisation?.customPhotoUrl || null,
          chosenColor: item.personalisation?.chosenColor || null,
        });
      }
    }

    // Recalculate discount if coupon supplied
    let calculatedDiscount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });
      if (coupon && coupon.isActive && calculatedSubtotal >= coupon.minOrderValue) {
        if (coupon.discountType === "PERCENTAGE") {
          calculatedDiscount = Math.round(
            (calculatedSubtotal * coupon.discountValue) / 100
          );
          if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
            calculatedDiscount = coupon.maxDiscount;
          }
        } else {
          calculatedDiscount = coupon.discountValue;
        }

        // Increment usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    // Shipping calculation: Free on orders >= ₹1499, else ₹99
    const shippingFee = calculatedSubtotal >= 1499 ? 0 : 99;
    const finalTotal = Math.max(0, calculatedSubtotal - calculatedDiscount + shippingFee);

    // Generate unique order number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BOH-${new Date().getFullYear()}-${randomDigits}`;

    // Estimated delivery (3-4 days from now)
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + (deliveryMethod === "EXPRESS" ? 2 : 4));
    const estimatedDelivery = estDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // Execute in Prisma Transaction for atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.userId || null,
          customerName: customerName.trim(),
          customerEmail: customerEmail.toLowerCase().trim(),
          customerPhone: customerPhone.trim(),
          house: house.trim(),
          street: street ? street.trim() : "",
          city: city.trim(),
          state: state ? state.trim() : "",
          pinCode: pinCode.trim(),
          deliveryInstructions: deliveryInstructions || null,
          deliveryMethod: deliveryMethod || "STANDARD",
          estimatedDelivery,
          giftMessage: giftMessage || null,
          giftWrap: Boolean(giftWrap),
          giftWrapTheme: giftWrapTheme || null,
          subtotal: calculatedSubtotal,
          discount: calculatedDiscount,
          couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
          shippingFee,
          totalAmount: finalTotal,
          paymentMethod: paymentMethod || "RAZORPAY",
          paymentStatus:
            paymentMethod === "COD" ? "PENDING" : "PAID",
          paymentTransactionId: `boh_pay_${Date.now()}`,
          fulfilmentStatus: "ORDER_PLACED",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Save custom hamper configuration entities if applicable
      for (const config of customConfigsToCreate) {
        const { items: configItems, ...configData } = config;
        const createdConfig = await tx.customHamperConfig.create({
          data: configData,
        });

        if (configItems && configItems.length > 0) {
          await tx.customHamperConfigItem.createMany({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: configItems.map((ci: any) => ({
              configurationId: createdConfig.id,
              productId: ci.productId,
              quantity: ci.quantity,
              unitPrice: ci.unitPrice,
              selectedVariant: ci.selectedVariant,
            })),
          });
        }
      }

      // Decrement product inventory for all items
      for (const dec of inventoryDecrements) {
        await tx.product.update({
          where: { id: dec.productId },
          data: {
            stock: { decrement: dec.quantity },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to process and create order. Please try again." },
      { status: 500 }
    );
  }
}
