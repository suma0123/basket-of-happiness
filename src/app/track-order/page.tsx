"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, Search, CheckCircle, Package, ArrowRight, ShieldCheck } from "lucide-react";
import { Order } from "@/lib/types";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("id") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderId: string, emailQuery: string) => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(emailQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "Order not found. Please double check the details.");
        setOrder(null);
      }
    } catch {
      setError("Failed to track order due to network issue.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber, email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, email);
  };

  const steps = [
    { key: "ORDER_PLACED", label: "Order Placed" },
    { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
    { key: "PROCESSING", label: "Processing & Curating" },
    { key: "PACKED", label: "Dressed in Ribbons" },
    { key: "SHIPPED", label: "Shipped in Transit" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered with Love" },
  ];

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8A28A]">
            Real-time Logistics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18] mt-1 mb-3">
            Track Your Hamper
          </h1>
          <p className="text-xs text-[#191C18]/60">
            Enter your order reference number and email to follow the live journey of your gift.
          </p>
        </div>

        {/* Track Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#58111A]/20 shadow-lg shadow-[#58111A]/5 mb-8">
          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-[#191C18] mb-1">
                Order Number
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. BOH-2026-8941"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#58111A]"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-[#191C18] mb-1">
                Customer Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. demo@basketofhappiness.in"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#58111A]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-400 text-white border border-[#7A1B28]/40 shadow-md hover:shadow-lg rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
              >
                {loading ? "Tracking..." : "Track"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Order Details Result */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#58111A]/20 shadow-xl shadow-[#58111A]/5 space-y-6 animate-scale-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#58111A]/15 gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B8A28A] font-bold">
                  Active Dispatch
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#191C18]">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-xs text-[#191C18]/60 mt-0.5">
                  Estimated Delivery: <strong className="text-[#58111A]">{order.estimatedDelivery || "In 2-3 Business Days"}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#58111A]/10 text-[#58111A] border border-[#58111A]/20">
                  {order.fulfilmentStatus.replace(/_/g, " ")}
                </span>
                {order.trackingNumber && (
                  <p className="text-xs text-[#191C18]/80 font-medium mt-1">
                    Carrier: {order.trackingCarrier} • #{order.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-[#FAF0F2]/50 p-5 rounded-2xl border border-[#58111A]/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
                {steps.map((s, idx) => {
                  const currentIdx = steps.findIndex((x) => x.key === order.fulfilmentStatus);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  return (
                    <div
                      key={s.key}
                      className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-[#58111A] text-white border-[#7A1B28] font-bold shadow-md ring-2 ring-[#7A1B28]/30 scale-105 animate-pulse"
                          : isDone
                          ? "bg-white text-[#58111A] border-[#58111A]/40 font-semibold"
                          : "bg-white/50 text-[#191C18]/40 border-gray-200"
                      }`}
                    >
                      <span className="text-xs">{isDone ? "✓" : idx + 1}</span>
                      <span className="leading-tight mt-1">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B8A28A]">
                Gift Items in this Parcel
              </h4>
              <div className="divide-y divide-[#B8A28A]/15">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191C18]">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-bold text-[#263B2D]">₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-[#FAF5EE] p-4 rounded-xl text-xs text-[#191C18]/80 space-y-1">
              <p className="font-bold text-[#191C18]">Destination Address:</p>
              <p>{order.customerName}</p>
              <p>{order.house}, {order.street}</p>
              <p>{order.city}, {order.state} - {order.pinCode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
