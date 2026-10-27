"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  User as UserIcon,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  LogOut,
  ShoppingBag,
  Plus,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Order, Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
  const { addToCart } = useCart();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address modal form
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addrHouse, setAddrHouse] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPin, setAddrPin] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [isDefaultAddr, setIsDefaultAddr] = useState(true);

  // Profile fields
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account/login");
    } else if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone || "");
    }
  }, [user, authLoading, router]);

  // Load orders
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(data.orders || []);
        })
        .catch(console.error)
        .finally(() => setLoadingOrders(false));

      // Load wishlist products
      fetch("/api/wishlist")
        .then((r) => r.json())
        .then((data) => {
          if (data.wishlist) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setWishlistProducts(data.wishlist.map((w: any) => w.product));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      });
      if (res.ok) {
        success("Profile updated successfully!");
        refreshUser();
      } else {
        toastError("Failed to update profile");
      }
    } catch {
      toastError("Network error updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: {
            fullName: user?.name,
            house: addrHouse,
            street: addrStreet,
            city: addrCity,
            state: addrState,
            pinCode: addrPin,
            phone: addrPhone || user?.phone,
            isDefault: isDefaultAddr,
          },
        }),
      });
      if (res.ok) {
        success("Address saved successfully!");
        setAddressModalOpen(false);
        refreshUser();
      }
    } catch {
      toastError("Failed to save address");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 text-center font-serif text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!user) return null;

  const fulfillmentTimeline = [
    { key: "ORDER_PLACED", label: "Order Placed" },
    { key: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
    { key: "PROCESSING", label: "Processing & Curating" },
    { key: "PACKED", label: "Dressed in Ribbons" },
    { key: "SHIPPED", label: "Shipped in Transit" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered with Love" },
  ];

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8A28A]/30 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#263B2D] text-[#F4EBDD] flex items-center justify-center font-serif text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-medium text-[#191C18]">
                  Hello, {user.name}
                </h1>
                {user.role === "ADMIN" && (
                  <span className="text-[10px] font-bold bg-[#263B2D] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Master Curator
                  </span>
                )}
              </div>
              <p className="text-xs text-[#191C18]/60">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] transition-colors"
              >
                Go to Admin Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-3 border-b border-[#B8A28A]/20 pb-4 mb-8 overflow-x-auto">
          {[
            { key: "orders", label: `My Orders (${orders.length})`, icon: Package },
            { key: "wishlist", label: `Wishlist (${user.wishlistIds?.length || 0})`, icon: Heart },
            { key: "addresses", label: `Saved Addresses (${user.addresses?.length || 0})`, icon: MapPin },
            { key: "settings", label: "Account Profile", icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-[#263B2D] text-white shadow-sm"
                    : "bg-white text-[#191C18]/80 border border-[#B8A28A]/30 hover:border-[#263B2D]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Orders */}
        {activeTab === "orders" && (
          <div key="orders" className="space-y-6 animate-step-enter">
            {loadingOrders ? (
              <p className="text-xs text-[#191C18]/60">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#B8A28A]/25 shadow-xs">
                <Package className="w-12 h-12 text-[#B8A28A] mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium text-[#191C18] mb-1">
                  No orders placed yet
                </h3>
                <p className="text-xs text-[#191C18]/60 max-w-sm mx-auto mb-6">
                  Surprise someone special with a handcrafted bespoke hamper today.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-[#263B2D] text-white text-xs font-semibold rounded-full"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const currentStatusIdx = fulfillmentTimeline.findIndex(
                  (f) => f.key === order.fulfilmentStatus
                );

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8A28A]/25 shadow-xs space-y-6"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-[#B8A28A]/15 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#B8A28A] font-bold">
                          Order Reference
                        </span>
                        <h3 className="font-serif text-xl font-medium text-[#191C18]">
                          {order.orderNumber}
                        </h3>
                        <p className="text-[11px] text-[#191C18]/50">
                          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#263B2D]/10 text-[#263B2D]">
                          {order.fulfilmentStatus.replace(/_/g, " ")}
                        </span>
                        <p className="text-base font-serif font-bold text-[#191C18] mt-1">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* Timeline stepper */}
                    <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#B8A28A]/20">
                      <p className="text-xs font-bold text-[#191C18] mb-3 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#263B2D]" />
                        <span>Fulfillment Timeline</span>
                        {order.trackingNumber && (
                          <span className="text-[11px] text-[#263B2D] font-normal ml-auto">
                            Tracking: <strong>{order.trackingNumber}</strong> ({order.trackingCarrier || "Express"})
                          </span>
                        )}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-[10px]">
                        {fulfillmentTimeline.map((stepItem, idx) => {
                          const isDone = currentStatusIdx >= idx;
                          const isCurrent = currentStatusIdx === idx;
                          return (
                            <div
                              key={stepItem.key}
                              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isCurrent
                                  ? "bg-[#263B2D] text-white border-[#263B2D] font-bold shadow-xs"
                                  : isDone
                                  ? "bg-white text-[#263B2D] border-[#263B2D]/40 font-semibold"
                                  : "bg-white/50 text-[#191C18]/40 border-gray-200"
                              }`}
                            >
                              <span>{isDone ? "✓" : idx + 1}</span>
                              <span className="leading-tight mt-0.5">{stepItem.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#B8A28A]">
                        Items inside this Hamper Box
                      </p>
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-[#FAF5EE]/50 border border-[#B8A28A]/15"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <h4 className="font-medium text-[#191C18] truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[#191C18]/50">Qty: {item.quantity}</p>
                            {item.recipientName && (
                              <p className="text-[#263B2D]">For: {item.recipientName}</p>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#263B2D]">
                            ₹{item.totalPrice}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & notes */}
                    <div className="text-xs text-[#191C18]/70 pt-2 border-t border-[#B8A28A]/15 flex flex-col sm:flex-row justify-between gap-2">
                      <p>
                        <strong>Delivering to:</strong> {order.house}, {order.street}, {order.city} - {order.pinCode}
                      </p>
                      <Link
                        href={`/track-order?id=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`}
                        className="text-[#263B2D] font-bold hover:underline"
                      >
                        Public Tracking Link →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: Wishlist */}
        {activeTab === "wishlist" && (
          <div key="wishlist" className="space-y-6 animate-step-enter">
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#B8A28A]/25">
                <Heart className="w-12 h-12 text-[#B8A28A] mx-auto mb-3" />
                <h3 className="font-serif text-xl font-medium text-[#191C18] mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-[#191C18]/60 mb-6">
                  Save your favorite luxury hampers here by tapping the heart icon.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-[#263B2D] text-white text-xs font-semibold rounded-full"
                >
                  Explore Gifts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div key="addresses" className="space-y-6 animate-step-enter">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-medium text-[#191C18]">
                Your Saved Shipping Addresses
              </h2>
              <button
                onClick={() => setAddressModalOpen(true)}
                className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 bg-[#263B2D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                  <h4 className="font-semibold text-sm text-[#191C18] mb-1">{addr.fullName}</h4>
                  <p className="text-xs text-[#191C18]/70 leading-relaxed">
                    {addr.house}, {addr.street}
                    <br />
                    {addr.city}, {addr.state} - {addr.pinCode}
                  </p>
                  <p className="text-xs text-[#263B2D] font-medium mt-2">
                    Phone: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Profile Settings */}
        {activeTab === "settings" && (
          <div key="settings" className="max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-[#B8A28A]/25 shadow-xs animate-step-enter">
            <h2 className="font-serif text-xl font-medium text-[#191C18] mb-4 pb-2 border-b border-[#B8A28A]/20">
              Personal Information
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-[#191C18]/40">Email cannot be changed</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] transition-colors"
              >
                {isSavingProfile ? "Saving Changes..." : "Save Profile"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAddressModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#191C18]">
              Add Shipping Address
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                required
                placeholder="House / Flat / Building *"
                value={addrHouse}
                onChange={(e) => setAddrHouse(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
              />
              <input
                type="text"
                placeholder="Street / Locality"
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City *"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="PIN Code *"
                  value={addrPin}
                  onChange={(e) => setAddrPin(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
                />
                <input
                  type="tel"
                  placeholder="Delivery Phone"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#263B2D] text-white rounded-xl text-xs font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
