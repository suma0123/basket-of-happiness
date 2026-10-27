"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Users,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Truck,
  Shield,
  Tag,
  Star,
  RefreshCw,
  Box,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order, Product, Coupon, Review, HamperBox } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "hampers" | "coupons" | "reviews">("overview");

  // Admin stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersFilter, setOrdersFilter] = useState("ALL");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Selected order for status & tracking update modal
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newFulfillmentStatus, setNewFulfillmentStatus] = useState("");
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [newTrackingCarrier, setNewTrackingCarrier] = useState("");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pSpecs, setPSpecs] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pOriginalPrice, setPOriginalPrice] = useState("");
  const [pStock, setPStock] = useState("30");
  const [pOccasion, setPOccasion] = useState("Birthday");
  const [pGiftType, setPGiftType] = useState("Hamper");
  const [pImageUrl, setPImageUrl] = useState("");

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("15");
  const [couponMinOrder, setCouponMinOrder] = useState("999");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  // Hamper Boxes state
  const [boxes, setBoxes] = useState<HamperBox[]>([]);
  const [boxModalOpen, setBoxModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<HamperBox | null>(null);
  const [boxName, setBoxName] = useState("");
  const [boxDesc, setBoxDesc] = useState("");
  const [boxPrice, setBoxPrice] = useState("299");
  const [boxDims, setBoxDims] = useState("25x18x10 cm");
  const [boxCapacity, setBoxCapacity] = useState("Holds 4–6 items");
  const [boxImage, setBoxImage] = useState("");
  const [boxAvailable, setBoxAvailable] = useState(true);

  // Auth protection check
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/account/login");
      }
    }
  }, [user, authLoading, router]);

  // Load stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams();
      if (ordersSearch) params.set("search", ordersSearch);
      if (ordersFilter) params.set("status", ordersFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=50");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load coupons
  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load Hamper Boxes
  const fetchBoxes = async () => {
    try {
      const res = await fetch("/api/hamper-boxes?all=true");
      if (res.ok) {
        const data = await res.json();
        setBoxes(data.boxes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBoxAvailability = async (box: HamperBox) => {
    try {
      const res = await fetch("/api/hamper-boxes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: box.id, isAvailable: !box.isAvailable }),
      });
      if (res.ok) {
        success(`Box "${box.name}" updated!`);
        fetchBoxes();
      }
    } catch {
      toastError("Failed to update box status");
    }
  };

  const handleSaveBox = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBox) {
        const res = await fetch("/api/hamper-boxes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingBox.id,
            name: boxName,
            description: boxDesc,
            price: Number(boxPrice),
            dimensions: boxDims,
            capacity: boxCapacity,
            image: boxImage,
            isAvailable: boxAvailable,
          }),
        });
        if (res.ok) {
          success("Hamper box updated successfully!");
          setBoxModalOpen(false);
          fetchBoxes();
        }
      } else {
        const res = await fetch("/api/hamper-boxes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: boxName,
            description: boxDesc,
            price: Number(boxPrice),
            dimensions: boxDims,
            capacity: boxCapacity,
            image: boxImage,
            isAvailable: boxAvailable,
          }),
        });
        if (res.ok) {
          success("New hamper box created!");
          setBoxModalOpen(false);
          fetchBoxes();
        }
      }
    } catch {
      toastError("Failed to save hamper box");
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStats();
      fetchOrders();
      fetchProducts();
      fetchBoxes();
      fetchCoupons();
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle Order Status & Tracking update
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: editingOrder.id,
          fulfilmentStatus: newFulfillmentStatus || editingOrder.fulfilmentStatus,
          trackingNumber: newTrackingNumber || editingOrder.trackingNumber,
          trackingCarrier: newTrackingCarrier || editingOrder.trackingCarrier,
        }),
      });
      if (res.ok) {
        success(`Order #${editingOrder.orderNumber} updated!`);
        setEditingOrder(null);
        fetchOrders();
        fetchStats();
      }
    } catch {
      toastError("Failed to update order");
    }
  };

  // Handle Product Create / Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Edit existing
        const res = await fetch(`/api/products/${editingProduct.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pName,
            description: pDesc,
            specifications: pSpecs,
            price: pPrice,
            originalPrice: pOriginalPrice,
            stock: pStock,
            occasion: pOccasion,
            giftType: pGiftType,
          }),
        });
        if (res.ok) {
          success("Product updated successfully!");
          setProductModalOpen(false);
          setEditingProduct(null);
          fetchProducts();
        }
      } else {
        // Create new
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pName,
            description: pDesc,
            specifications: pSpecs,
            price: pPrice,
            originalPrice: pOriginalPrice,
            stock: pStock,
            occasion: pOccasion,
            giftType: pGiftType,
            images: [
              {
                url: pImageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
                alt: pName,
                isPrimary: true,
              },
            ],
          }),
        });
        if (res.ok) {
          success("New curated hamper created!");
          setProductModalOpen(false);
          resetProductForm();
          fetchProducts();
        }
      }
    } catch {
      toastError("Failed to save product");
    }
  };

  const resetProductForm = () => {
    setPName("");
    setPDesc("");
    setPSpecs("");
    setPPrice("");
    setPOriginalPrice("");
    setPStock("30");
    setPOccasion("Birthday");
    setPGiftType("Hamper");
    setPImageUrl("");
    setEditingProduct(null);
  };

  // Handle Product Delete
  const handleDeleteProduct = async (slug: string) => {
    if (!confirm("Are you sure you want to retire this product from the boutique?")) return;
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      if (res.ok) {
        success("Product deleted");
        fetchProducts();
      }
    } catch {
      toastError("Failed to delete product");
    }
  };

  // Handle Coupon Create
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          discountType: "PERCENTAGE",
          discountValue: couponDiscount,
          minOrderValue: couponMinOrder,
        }),
      });
      if (res.ok) {
        success(`Coupon ${couponCode.toUpperCase()} created!`);
        setCouponCode("");
        fetchCoupons();
      }
    } catch {
      toastError("Failed to create coupon");
    }
  };

  // Handle Coupon Delete
  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        success("Coupon removed");
        fetchCoupons();
      }
    } catch {
      toastError("Failed to delete coupon");
    }
  };

  // Handle Review Moderation
  const handleToggleReviewApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved: !currentStatus }),
      });
      if (res.ok) {
        success("Review approval status updated");
        fetchReviews();
      }
    } catch {
      toastError("Failed to update review");
    }
  };

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 text-center font-serif text-sm">
        Checking administrative privileges...
      </div>
    );
  }

  const fulfillmentStatuses = [
    "ORDER_PLACED",
    "PAYMENT_CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-[#B8A28A]/20 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B8A28A] bg-[#263B2D]/5 px-2.5 py-0.5 rounded-full mb-1">
              <Shield className="w-3 h-3 text-[#263B2D]" />
              <span>Administrative Control Center</span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[#191C18]">
              Basket of Happiness Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchStats();
                fetchOrders();
                fetchProducts();
              }}
              className="px-3.5 py-2 bg-white border border-[#B8A28A]/30 text-[#191C18] rounded-xl text-xs font-semibold hover:bg-[#FAF5EE] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Telemetry</span>
            </button>
            <Link
              href="/account/dashboard"
              className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] transition-colors"
            >
              Customer View
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-[#B8A28A]/20 pb-4 overflow-x-auto">
          {[
            { key: "overview", label: "Overview & KPIs" },
            { key: "orders", label: `Orders (${orders.length})` },
            { key: "products", label: `Products & Stock (${products.length})` },
            { key: "hampers", label: `Hamper Boxes (${boxes.length})` },
            { key: "coupons", label: `Coupons (${coupons.length})` },
            { key: "reviews", label: `Reviews (${reviews.length})` },
          ].map((t) => (
            <button
              key={t.key}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? "bg-[#263B2D] text-white shadow-sm"
                  : "bg-white text-[#191C18]/80 border border-[#B8A28A]/30 hover:border-[#263B2D]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8A28A]">
                  Recorded Revenue
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#263B2D] mt-1">
                  ₹{stats?.totalRevenue?.toLocaleString("en-IN") || 0}
                </p>
                <p className="text-[11px] text-[#191C18]/50 mt-1">From all confirmed orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8A28A]">
                  Total Orders
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#191C18] mt-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-[11px] text-[#263B2D] font-medium mt-1">
                  {stats?.pendingOrders || 0} currently pending
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8A28A]">
                  Catalog Products
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#191C18] mt-1">
                  {stats?.productsCount || 0}
                </p>
                <p className="text-[11px] text-[#191C18]/50 mt-1">Curated in 8 occasions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8A28A]">
                  Low Stock Watch
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#8B2626] mt-1">
                  {stats?.lowStockCount || 0}
                </p>
                <p className="text-[11px] text-[#191C18]/50 mt-1">Items below 25 units</p>
              </div>
            </div>

            {/* Low Stock Alerts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Low stock table (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs">
                <h3 className="font-serif text-lg font-medium text-[#191C18] mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Low Stock Priority Restock</span>
                </h3>

                <div className="space-y-2.5">
                  {stats?.lowStockProducts?.map((item: { id: string; name: string; stock: number; price: number }) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#FAF5EE] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#191C18]">{item.name}</p>
                        <p className="text-[10px] text-[#191C18]/50">₹{item.price}</p>
                      </div>
                      <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                        {item.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders table (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs">
                <h3 className="font-serif text-lg font-medium text-[#191C18] mb-4">
                  Latest Received Orders
                </h3>
                <div className="divide-y divide-[#B8A28A]/15 text-xs">
                  {stats?.recentOrders?.map((ord: Order) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#191C18]">{ord.orderNumber}</p>
                        <p className="text-[#191C18]/60">{ord.customerName} • {ord.city}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#263B2D]">₹{ord.totalAmount}</span>
                        <p className="text-[10px] text-[#191C18]/50">{ord.fulfilmentStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-[#B8A28A]/25">
              <input
                type="text"
                value={ordersSearch}
                onChange={(e) => setOrdersSearch(e.target.value)}
                placeholder="Search orders by number, customer, email, phone, tracking..."
                className="flex-1 bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#263B2D]"
              />
              <div className="flex gap-2">
                <select
                  value={ordersFilter}
                  onChange={(e) => setOrdersFilter(e.target.value)}
                  className="bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="ALL">All Statuses</option>
                  {fulfillmentStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#B8A28A]/25 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#B8A28A]/20 text-[#191C18] uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tracking</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8A28A]/15">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF5EE]/50">
                        <td className="p-4 font-bold text-[#191C18] whitespace-nowrap">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-[#191C18]">{ord.customerName}</p>
                          <p className="text-[10px] text-[#191C18]/60">{ord.customerPhone}</p>
                        </td>
                        <td className="p-4 text-[#191C18]/80">
                          {ord.city}, {ord.pinCode}
                        </td>
                        <td className="p-4 text-[#191C18]/80">
                          {ord.items?.length || 0} gift(s)
                        </td>
                        <td className="p-4 font-bold text-[#263B2D]">
                          ₹{ord.totalAmount}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#263B2D]/10 text-[#263B2D]">
                            {ord.fulfilmentStatus.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="p-4 text-[#191C18]/70">
                          {ord.trackingNumber ? (
                            <span className="font-mono text-[10px] font-semibold">{ord.trackingNumber}</span>
                          ) : (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditingOrder(ord);
                              setNewFulfillmentStatus(ord.fulfilmentStatus);
                              setNewTrackingNumber(ord.trackingNumber || "");
                              setNewTrackingCarrier(ord.trackingCarrier || "Blue Dart Express");
                            }}
                            className="px-3 py-1 bg-[#263B2D] text-white rounded-lg text-[11px] font-medium hover:bg-[#1A281E]"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-xl font-medium text-[#191C18]">
                Boutique Gift Catalogue
              </h2>
              <button
                onClick={() => {
                  resetProductForm();
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-[#B8A28A]/25 shadow-xs flex gap-4 items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF5EE] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-medium text-[#191C18] truncate">{p.name}</h4>
                    <p className="text-[#B8A28A]">{p.occasion}</p>
                    <p className="font-bold text-[#263B2D]">
                      ₹{p.price} • Stock: {p.stock}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setPName(p.name);
                        setPDesc(p.description);
                        setPSpecs(p.specifications || "");
                        setPPrice(p.price.toString());
                        setPOriginalPrice(p.originalPrice?.toString() || "");
                        setPStock(p.stock.toString());
                        setPOccasion(p.occasion);
                        setPGiftType(p.giftType || "Hamper");
                        setProductModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-[#FAF5EE] rounded text-gray-700"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.slug)}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: HAMPER BOXES */}
        {activeTab === "hampers" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#191C18]">
                  Hamper Box Foundations
                </h2>
                <p className="text-xs text-[#191C18]/60 mt-0.5">
                  Manage the keepsake boxes available in the &ldquo;Build Your Own Hamper&rdquo; studio.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBox(null);
                  setBoxName("");
                  setBoxDesc("");
                  setBoxPrice("299");
                  setBoxDims("25x18x10 cm");
                  setBoxCapacity("Holds 4–6 items");
                  setBoxImage("https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80");
                  setBoxAvailable(true);
                  setBoxModalOpen(true);
                }}
                className="px-4 py-2 bg-[#263B2D] text-white rounded-xl text-xs font-semibold hover:bg-[#1A281E] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hamper Box</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {boxes.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-[#B8A28A]/25 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF5EE] border border-[#B8A28A]/15 mb-3 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {b.isAvailable ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline gap-1">
                      <h3 className="font-serif text-base font-semibold text-[#191C18] truncate">
                        {b.name}
                      </h3>
                      <span className="text-sm font-bold text-[#263B2D]">₹{b.price}</span>
                    </div>

                    <p className="text-[11px] text-[#B8A28A] uppercase tracking-wider font-semibold mt-0.5">
                      {b.dimensions || "Standard Size"}
                    </p>
                    <p className="text-xs text-[#191C18]/65 mt-1 line-clamp-2">{b.description}</p>
                    {b.capacity && (
                      <p className="text-[11px] text-[#263B2D] font-medium mt-1">📦 {b.capacity}</p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#B8A28A]/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBoxAvailability(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        b.isAvailable
                          ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "bg-green-50 text-green-800 hover:bg-green-100"
                      }`}
                    >
                      {b.isAvailable ? "Disable" : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingBox(b);
                        setBoxName(b.name);
                        setBoxDesc(b.description);
                        setBoxPrice(String(b.price));
                        setBoxDims(b.dimensions || "");
                        setBoxCapacity(b.capacity || "");
                        setBoxImage(b.image);
                        setBoxAvailable(b.isAvailable);
                        setBoxModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#F4EBDD] text-[#191C18] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: COUPONS */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Coupon creation form (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-[#191C18] mb-4">
                Create Discount Coupon
              </h3>
              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. LUXURY25"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Minimum Order Value (INR)</label>
                  <input
                    type="number"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(e.target.value)}
                    placeholder="e.g. 999"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#263B2D] text-white rounded-xl font-semibold hover:bg-[#1A281E]"
                >
                  Create Coupon
                </button>
              </form>
            </div>

            {/* Coupons list (8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-[#191C18] mb-4">
                Active Promotions &amp; Coupons
              </h3>
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-sm text-[#263B2D] bg-white px-2 py-0.5 rounded border border-[#B8A28A]/30">
                        {c.code}
                      </span>
                      <p className="text-[#191C18]/70 mt-1">
                        {c.discountValue}% off on minimum cart of ₹{c.minOrderValue}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: REVIEWS MODERATION */}
        {activeTab === "reviews" && (
          <div className="bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs space-y-4 animate-fade-in">
            <h3 className="font-serif text-lg font-medium text-[#191C18]">
              Customer Review Moderation
            </h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#191C18]">{r.authorName}</span>
                      <div className="flex text-[#263B2D]">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#191C18]/80 italic mt-1">&ldquo;{r.comment}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReviewApproval(r.id, r.isApproved)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        r.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.isApproved ? "Approved ✓" : "Pending Approval"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingOrder(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/20">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B8A28A]">
                  Order Telemetry
                </span>
                <h3 className="font-serif text-xl font-medium text-[#191C18]">
                  Order #{editingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-[#191C18]/50 hover:text-[#191C18]"
              >
                ✕
              </button>
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#B8A28A]/20 space-y-2 max-h-56 overflow-y-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8A28A] block">
                Items in Order ({editingOrder.items?.length || 0})
              </span>
              {editingOrder.items?.map((item) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let hamperDetails: any = null;
                if (item.customDetails) {
                  try {
                    hamperDetails = JSON.parse(item.customDetails);
                  } catch {
                    // ignore
                  }
                }

                return (
                  <div key={item.id} className="p-2.5 bg-white rounded-xl border border-[#B8A28A]/15 text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-[#191C18]">{item.productName}</span>
                      <span className="font-bold text-[#263B2D]">₹{item.totalPrice}</span>
                    </div>
                    <p className="text-[11px] text-[#191C18]/60">Qty: {item.quantity} × ₹{item.unitPrice}</p>

                    {hamperDetails && (
                      <div className="pt-1.5 mt-1 border-t border-[#B8A28A]/15 text-[10.5px] text-[#191C18]/80 space-y-1 bg-[#FAF5EE]/70 p-2 rounded-lg">
                        <p className="font-semibold text-[#263B2D]">
                          Box: {hamperDetails.box?.name} (₹{hamperDetails.boxPrice})
                        </p>
                        <p>
                          <strong>Inside ({hamperDetails.items?.length || 0}):</strong>{" "}
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {hamperDetails.items?.map((ci: any) => `${ci.quantity}x ${ci.productName}`).join(", ")}
                        </p>
                        <div className="flex flex-wrap gap-1 text-[9.5px] text-gray-700">
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#B8A28A]/20">
                            🎀 {hamperDetails.personalisation?.ribbonColor}
                          </span>
                          <span className="bg-white px-1.5 py-0.5 rounded border border-[#B8A28A]/20">
                            🎁 {hamperDetails.personalisation?.giftWrap}
                          </span>
                          {hamperDetails.personalisation?.recipientName && (
                            <span className="bg-white px-1.5 py-0.5 rounded border border-[#B8A28A]/20 font-medium">
                              💌 For: {hamperDetails.personalisation.recipientName}
                            </span>
                          )}
                        </div>
                        {hamperDetails.personalisation?.cardMessage && (
                          <p className="italic text-[10px] text-gray-600 bg-white p-1.5 rounded border border-[#B8A28A]/15">
                            &ldquo;{hamperDetails.personalisation.cardMessage}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Fulfilment Status</label>
                <select
                  value={newFulfillmentStatus}
                  onChange={(e) => setNewFulfillmentStatus(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                >
                  {fulfillmentStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={newTrackingCarrier}
                  onChange={(e) => setNewTrackingCarrier(e.target.value)}
                  placeholder="e.g. Blue Dart Express, DTDC, Delhivery"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder="e.g. BOH-BD-99812401"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2.5 border rounded-xl font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#263B2D] text-white rounded-xl font-semibold"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setProductModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4 my-8">
            <h3 className="font-serif text-xl font-medium text-[#191C18]">
              {editingProduct ? "Edit Product" : "Create New Luxury Hamper"}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hamper Name *</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Royal Silk & Spice Hamper"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Occasion *</label>
                  <select
                    value={pOccasion}
                    onChange={(e) => setPOccasion(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  >
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Thank You</option>
                    <option>Baby Gifts</option>
                    <option>Just Because</option>
                    <option>For Him</option>
                    <option>For Her</option>
                    <option>Festive Gifts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Gift Type</label>
                  <select
                    value={pGiftType}
                    onChange={(e) => setPGiftType(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  >
                    <option>Hamper</option>
                    <option>Box</option>
                    <option>Keepsake</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="1499"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Original Price</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(e.target.value)}
                    placeholder="1899"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={pImageUrl}
                  onChange={(e) => setPImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Editorial Description *</label>
                <textarea
                  rows={3}
                  required
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Describe the atmosphere, scents, and textures..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hamper Specifications (Bullets)</label>
                <textarea
                  rows={3}
                  value={pSpecs}
                  onChange={(e) => setPSpecs(e.target.value)}
                  placeholder="• 1x Scented Soy Candle&#10;• 1x Belgian Truffles..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#263B2D] text-white rounded-xl font-semibold hover:bg-[#1A281E]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hamper Box Create / Edit Modal */}
      {boxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setBoxModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/20">
              <h3 className="font-serif text-xl font-medium text-[#191C18]">
                {editingBox ? "Edit Hamper Box" : "Create New Hamper Box"}
              </h3>
              <button
                type="button"
                onClick={() => setBoxModalOpen(false)}
                className="text-[#191C18]/50 hover:text-[#191C18]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBox} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Box Name *</label>
                <input
                  type="text"
                  required
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  placeholder="e.g. Luxury Celebration Box"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Base Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={boxPrice}
                    onChange={(e) => setBoxPrice(e.target.value)}
                    placeholder="e.g. 499"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={boxDims}
                    onChange={(e) => setBoxDims(e.target.value)}
                    placeholder="e.g. 32x24x12 cm"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Capacity</label>
                  <input
                    type="text"
                    value={boxCapacity}
                    onChange={(e) => setBoxCapacity(e.target.value)}
                    placeholder="e.g. Holds 6–9 items"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={boxAvailable}
                      onChange={(e) => setBoxAvailable(e.target.checked)}
                      className="rounded text-[#263B2D] focus:ring-[#263B2D]"
                    />
                    <span>Available in Studio</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Box Image URL *</label>
                <input
                  type="url"
                  required
                  value={boxImage}
                  onChange={(e) => setBoxImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={boxDesc}
                  onChange={(e) => setBoxDesc(e.target.value)}
                  placeholder="Describe the keepsake material, aesthetic, and finishing..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setBoxModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#263B2D] text-white rounded-xl font-semibold hover:bg-[#1A281E] cursor-pointer"
                >
                  Save Hamper Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
