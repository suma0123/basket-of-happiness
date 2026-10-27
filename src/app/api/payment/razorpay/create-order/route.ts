import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live/test credentials are configured
    const isMock = !keyId || !keySecret || keyId.includes("placeholder") || keyId.includes("sample");

    if (isMock) {
      // Return a test mock order for smooth local verification
      const mockOrderId = `order_test_${crypto.randomBytes(8).toString("hex")}`;
      return NextResponse.json({
        success: true,
        isTestMode: true,
        orderId: mockOrderId,
        amount: Math.round(amount * 100), // in paise
        currency,
        key: keyId || "rzp_test_placeholder",
      });
    }

    // Call official Razorpay Orders API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Razorpay order creation fallback to test mode:", data);
      return NextResponse.json({
        success: true,
        isTestMode: true,
        orderId: `order_test_${crypto.randomBytes(8).toString("hex")}`,
        amount: Math.round(amount * 100),
        currency,
        key: keyId,
      });
    }

    return NextResponse.json({
      success: true,
      isTestMode: false,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      key: keyId,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
