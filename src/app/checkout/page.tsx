"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Truck,
  CreditCard,
  Gift,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Step 1: Customer details
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");

  // Step 2: Delivery address
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  // Step 3: Delivery options
  const [deliveryMethod, setDeliveryMethod] = useState("STANDARD");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftWrap, setGiftWrap] = useState(true);
  const [giftWrapTheme, setGiftWrapTheme] = useState("Warm Champagne");

  // Step 4: Payment method
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY"); // "RAZORPAY", "UPI", "CARD", "COD", "TEST"

  // Autofill user details if available
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);

      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (defaultAddr && !house) {
        setHouse(defaultAddr.house);
        setStreet(defaultAddr.street);
        setCity(defaultAddr.city);
        setState(defaultAddr.state);
        setPinCode(defaultAddr.pinCode);
        if (defaultAddr.instructions) setDeliveryInstructions(defaultAddr.instructions);
      }
    }
  }, [user, customerName, customerEmail, customerPhone, house]);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="min-h-[70vh] bg-[#FFF9F0] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-medium text-[#191C18] mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-[#191C18]/60 mb-6">
          Add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-[#263B2D] text-white text-xs font-semibold rounded-full"
        >
          Browse Gifts
        </Link>
      </div>
    );
  }

  // Step 1 Validation
  const validateStep1 = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      toastError("Please fill out your name, email, and phone number.");
      return false;
    }
    setStep(2);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!house.trim() || !city.trim() || !pinCode.trim()) {
      toastError("Please complete the house/building, city, and PIN code.");
      return false;
    }
    setStep(3);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    setStep(4);
    return true;
  };

  // Step 4: Finalize and create Order with payment verification
  const handleFinalOrderSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Step 4a: Create payment transaction with Razorpay Test Mode or instant verification
      let transactionId = `pay_boh_${Date.now()}`;
      if (paymentMethod !== "COD") {
        const orderRes = await fetch("/api/payment/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, currency: "INR" }),
        });
        const orderData = await orderRes.json();

        // Verify payment signature
        const verifyRes = await fetch("/api/payment/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `pay_test_${Math.random().toString(36).substring(2, 9)}`,
            isTestMode: true,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.transactionId) {
          transactionId = verifyData.transactionId;
        }
      }

      // Step 4b: Submit order to server
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          couponCode: appliedCoupon?.code,
          paymentMethod,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toastError(data.error || "Order creation failed");
        setIsSubmitting(false);
        return;
      }

      // Success! Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#263B2D", "#F4EBDD", "#D7B3A8", "#B8A28A"],
      });

      setCompletedOrder(data.order);
      setStep(5);
      clearCart();
      success("Order placed successfully!");
    } catch {
      toastError("Failed to process payment and order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 5: Order Confirmation Screen
  if (step === 5 && completedOrder) {
    return (
      <div className="bg-[#FFF9F0] min-h-screen py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#58111A]/20 shadow-2xl text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-[#58111A]/10 text-[#58111A] flex items-center justify-center mx-auto animate-checkmark shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B8A28A]">
                Payment Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18] mt-1 mb-2">
                Thank You For Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-[#191C18]/70 max-w-md mx-auto">
                Your luxury hamper is being hand-curated with utmost love and precision. A confirmation has been sent to <strong>{completedOrder.customerEmail}</strong>.
              </p>
            </div>

            {/* Order Summary Pill */}
            <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#B8A28A]/25 text-left space-y-3">
              <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-[#B8A28A]/15 text-xs gap-1">
                <div>
                  <span className="text-[#191C18]/60">Order Number:</span>
                  <span className="font-bold text-[#191C18] ml-1.5">{completedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[#191C18]/60">Estimated Delivery:</span>
                  <span className="font-bold text-[#263B2D] ml-1.5">{completedOrder.estimatedDelivery || "In 3 Business Days"}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 text-xs">
                {completedOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-1">
                    <span className="text-[#191C18] font-medium truncate max-w-xs">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-bold text-[#263B2D]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#B8A28A]/15 flex justify-between text-sm font-bold text-[#191C18]">
                <span>Total Paid</span>
                <span className="text-[#263B2D]">₹{completedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Delivery address snippet */}
            <div className="text-xs text-left bg-white p-4 rounded-xl border border-[#B8A28A]/20 text-[#191C18]/80">
              <p className="font-semibold text-[#191C18] mb-1">Delivering to:</p>
              <p>{completedOrder.customerName}</p>
              <p>{completedOrder.house}, {completedOrder.street}</p>
              <p>{completedOrder.city}, {completedOrder.state} - {completedOrder.pinCode}</p>
              <p className="mt-1 text-[#263B2D]">Phone: {completedOrder.customerPhone}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href={`/track-order?id=${completedOrder.orderNumber}&email=${encodeURIComponent(completedOrder.customerEmail)}`}
                className="flex-1 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 shadow-md hover:shadow-lg rounded-xl text-xs font-semibold tracking-wider uppercase transition-all"
              >
                Track Live Shipment
              </Link>
              <Link
                href="/account/dashboard"
                className="flex-1 py-3.5 bg-[#FAF0F2] hover:bg-[#58111A] hover:text-white text-[#58111A] border-2 border-[#58111A]/30 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                View in Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <span className="text-xs uppercase tracking-widest text-[#B8A28A] font-semibold">
            Secure Luxury Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18] mt-1 mb-6">
            Complete Your Gift Order
          </h1>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
            {[
              { num: 1, label: "Customer" },
              { num: 2, label: "Delivery" },
              { num: 3, label: "Gifting" },
              { num: 4, label: "Payment" },
            ].map((st) => (
              <div key={st.num} className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === st.num
                      ? "bg-[#58111A] text-white shadow-md ring-2 ring-[#7A1B28]/40 scale-105"
                      : step > st.num
                      ? "bg-[#58111A]/80 text-white"
                      : "bg-[#E5DACD] text-[#191C18]/60"
                  }`}
                >
                  {step > st.num ? "✓" : st.num}
                </span>
                <span
                  className={`hidden sm:inline ${
                    step === st.num ? "text-[#191C18] font-bold" : "text-[#191C18]/50"
                  }`}
                >
                  {st.label}
                </span>
                {st.num < 4 && <span className="text-[#B8A28A]/50">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Form & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Step Form Left (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#58111A]/20 shadow-lg shadow-[#58111A]/5">
            {/* STEP 1: Customer Details */}
            {step === 1 && (
              <div className="space-y-5 animate-step-enter">
                <div className="pb-3 border-b border-[#B8A28A]/20">
                  <h2 className="font-serif text-xl font-medium text-[#191C18]">
                    1. Contact Information
                  </h2>
                  <p className="text-xs text-[#191C18]/60 mt-0.5">
                    We will send order confirmation and tracking updates here.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Aanya Sharma"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. aanya@example.com"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Phone Number (WhatsApp for Delivery Updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={validateStep1}
                    className="px-8 py-3 bg-[#58111A] hover:bg-[#3B0A11] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-[#7A1B28]/40"
                  >
                    <span>Proceed to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Address */}
            {step === 2 && (
              <div className="space-y-5 animate-step-enter">
                <div className="pb-3 border-b border-[#B8A28A]/20 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-[#191C18]">
                      2. Delivery Address
                    </h2>
                    <p className="text-xs text-[#191C18]/60 mt-0.5">
                      Where should we deliver this surprise hamper?
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#B8A28A] hover:underline"
                  >
                    ← Edit Contact
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      House / Flat / Building / Floor *
                    </label>
                    <input
                      type="text"
                      required
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      placeholder="e.g. Villa 42, Magnolia Greens"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Street / Area / Locality
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Koramangala 4th Block"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#191C18] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#191C18] mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Karnataka"
                        className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#191C18] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="e.g. 560034"
                        className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryInstructions}
                      onChange={(e) => setDeliveryInstructions(e.target.value)}
                      placeholder="e.g. Please ring doorbell and leave at reception if unavailable"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#191C18] font-medium hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={validateStep2}
                    className="px-8 py-3 bg-[#58111A] hover:bg-[#3B0A11] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-[#7A1B28]/40"
                  >
                    <span>Delivery &amp; Gift Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Delivery Options & Gift Wrapping */}
            {step === 3 && (
              <div className="space-y-5 animate-step-enter">
                <div className="pb-3 border-b border-[#B8A28A]/20 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-[#191C18]">
                      3. Delivery Method &amp; Gift Options
                    </h2>
                    <p className="text-xs text-[#191C18]/60 mt-0.5">
                      Tailor your unboxing experience with signature details.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-[#B8A28A] hover:underline"
                  >
                    ← Edit Address
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Delivery Speed Radio Cards */}
                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-2">
                      Choose Delivery Method:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          deliveryMethod === "STANDARD"
                            ? "bg-[#FAF0F2] border-[#58111A] ring-1 ring-[#58111A]/20 shadow-xs"
                            : "bg-white border-[#58111A]/20 hover:border-[#58111A]/40 hover:bg-[#FAF0F2]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === "STANDARD"}
                            onChange={() => setDeliveryMethod("STANDARD")}
                            className="accent-[#58111A] focus:ring-[#58111A]"
                          />
                          <span className="text-xs font-bold text-[#58111A]">
                            {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#191C18]">Standard Delivery</h4>
                        <p className="text-[11px] text-[#191C18]/60 mt-0.5">
                          Arrives in 3-4 business days with live tracking
                        </p>
                      </label>

                      <label
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          deliveryMethod === "EXPRESS"
                            ? "bg-[#FAF0F2] border-[#58111A] ring-1 ring-[#58111A]/20 shadow-xs"
                            : "bg-white border-[#58111A]/20 hover:border-[#58111A]/40 hover:bg-[#FAF0F2]/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={deliveryMethod === "EXPRESS"}
                            onChange={() => setDeliveryMethod("EXPRESS")}
                            className="accent-[#58111A] focus:ring-[#58111A]"
                          />
                          <span className="text-xs font-bold text-[#58111A]">Priority Air</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#191C18]">Express Priority Dispatch</h4>
                        <p className="text-[11px] text-[#191C18]/60 mt-0.5">
                          Dispatched in priority lane within 24 hours
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Gift Message on Greeting Card */}
                  <div>
                    <label className="block text-xs font-semibold text-[#191C18] mb-1">
                      Calligraphy Greeting Card Message (Complimentary)
                    </label>
                    <textarea
                      rows={3}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="e.g. Dearest Priya, May your new journey be filled with happiness and sweet moments!"
                      className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-3 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                    />
                  </div>

                  {/* Signature Gift Wrapping */}
                  <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#B8A28A]/25 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="rounded border-[#B8A28A] text-[#263B2D] focus:ring-[#263B2D]"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-[#191C18]">
                          Add Signature Velvet Ribbon &amp; Wax Seal Gift Wrap
                        </span>
                        <p className="text-[11px] text-[#191C18]/60">
                          Hand-pressed wax seal, velvet ribbon, and botanical sprig (+₹99)
                        </p>
                      </div>
                    </label>

                    {giftWrap && (
                      <div className="pt-2">
                        <span className="text-[11px] font-semibold text-[#191C18] block mb-1.5">
                          Theme:
                        </span>
                        <div className="flex gap-2">
                          {["Warm Champagne", "Forest Velvet", "Muted Rose"].map((theme) => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => setGiftWrapTheme(theme)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                                giftWrapTheme === theme
                                  ? "bg-[#263B2D] text-white border-[#263B2D]"
                                  : "bg-white text-[#191C18] border-[#B8A28A]/30"
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-[#191C18] font-medium hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={validateStep3}
                    className="px-8 py-3 bg-[#58111A] hover:bg-[#3B0A11] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-[#7A1B28]/40"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Provider */}
            {step === 4 && (
              <div className="space-y-5 animate-step-enter">
                <div className="pb-3 border-b border-[#B8A28A]/20 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-[#191C18]">
                      4. Payment Method
                    </h2>
                    <p className="text-xs text-[#191C18]/60 mt-0.5">
                      Select your preferred secure payment method.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-[#B8A28A] hover:underline"
                  >
                    ← Edit Gifting
                  </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === "RAZORPAY"
                        ? "bg-[#FAF0F2] border-[#58111A] ring-1 ring-[#58111A]/20 shadow-xs"
                        : "bg-white border-[#58111A]/20 hover:border-[#58111A]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "RAZORPAY"}
                        onChange={() => setPaymentMethod("RAZORPAY")}
                        className="accent-[#58111A] focus:ring-[#58111A]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#191C18]">
                            Razorpay (UPI, Credit/Debit Cards, NetBanking)
                          </span>
                          <span className="text-[10px] bg-[#58111A] text-white px-2 py-0.5 rounded-full font-semibold">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-[#191C18]/60 mt-0.5">
                          Instant verified payment via Google Pay, PhonePe, Cards, Paytm, NetBanking
                        </p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-[#58111A]" />
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === "UPI"
                        ? "bg-[#FAF0F2] border-[#58111A] ring-1 ring-[#58111A]/20 shadow-xs"
                        : "bg-white border-[#58111A]/20 hover:border-[#58111A]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="accent-[#58111A] focus:ring-[#58111A]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#191C18]">
                          Direct UPI QR / VPA
                        </span>
                        <p className="text-[11px] text-[#191C18]/60 mt-0.5">
                          Scan and pay with any UPI application
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === "COD"
                        ? "bg-[#FAF0F2] border-[#58111A] ring-1 ring-[#58111A]/20 shadow-xs"
                        : "bg-white border-[#58111A]/20 hover:border-[#58111A]/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-[#58111A] focus:ring-[#58111A]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#191C18]">
                          Cash on Delivery (COD)
                        </span>
                        <p className="text-[11px] text-[#191C18]/60 mt-0.5">
                          Pay upon delivery to the courier executive
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Secure Trust Badge */}
                <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#B8A28A]/20 flex items-center gap-3 text-xs text-[#191C18]/70">
                  <Lock className="w-5 h-5 text-[#263B2D] shrink-0" />
                  <span>
                    Your payment details are strictly encrypted with 256-bit SSL banking standards. We never store credit card numbers or banking passwords.
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-[#191C18] font-medium hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalOrderSubmit}
                    className="px-8 py-4 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-400 text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#58111A]/30 transition-all flex items-center gap-2 border border-[#7A1B28]/50"
                  >
                    {isSubmitting ? (
                      <span>Verifying &amp; Placing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#F4EBDD]" />
                        <span>Place Order — ₹{total}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#58111A]/20 shadow-lg shadow-[#58111A]/5 space-y-4">
              <h3 className="font-serif text-lg font-medium text-[#191C18] pb-3 border-b border-[#B8A28A]/20 flex items-center justify-between">
                <span>Items in Order ({items.length})</span>
                <Link href="/cart" className="text-xs text-[#B8A28A] hover:underline font-sans">
                  Edit Bag
                </Link>
              </h3>

              {/* Items scroll */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center py-2.5 border-b border-[#58111A]/10">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF0F2]/40 shrink-0 border-2 border-[#58111A]/20 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.isCustomHamper && item.customHamper
                            ? item.customHamper.box.image
                            : item.product.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={item.isCustomHamper && item.customHamper ? item.customHamper.box.name : item.product.name}
                        className="w-full h-full object-cover"
                      />
                      {item.isCustomHamper && (
                        <span className="absolute bottom-0.5 inset-x-0 text-[8px] font-bold bg-[#263B2D]/90 text-white text-center py-0.2">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-medium text-[#191C18] truncate">
                        {item.isCustomHamper && item.customHamper
                          ? `Custom Hamper — ${item.customHamper.box.name}`
                          : item.product.name}
                      </p>
                      <p className="text-[11px] text-[#191C18]/60">
                        Qty: {item.quantity}{" "}
                        {item.isCustomHamper && item.customHamper && (
                          <span>({item.customHamper.items.length} items inside)</span>
                        )}
                      </p>
                      {item.isCustomHamper && item.customHamper ? (
                        <p className="text-[10px] text-[#263B2D] truncate">
                          🎀 {item.customHamper.personalisation.ribbonColor}
                          {item.customHamper.personalisation.recipientName
                            ? ` • For: ${item.customHamper.personalisation.recipientName}`
                            : ""}
                        </p>
                      ) : (
                        item.personalisation?.recipientName && (
                          <p className="text-[10px] text-[#263B2D] truncate">
                            For: {item.personalisation.recipientName}
                          </p>
                        )
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#191C18]">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#191C18]/80 pt-2 border-t border-[#B8A28A]/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#191C18]">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#263B2D] font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#263B2D]">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#B8A28A]/20 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#191C18]">Total to Pay</span>
                  <span className="font-serif text-2xl font-bold text-[#58111A]">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
