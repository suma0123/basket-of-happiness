"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, CartItemPersonalisation, CustomHamperPayload, Coupon, Product } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, personalisation?: CartItemPersonalisation) => void;
  addCustomHamperToCart: (hamper: CustomHamperPayload, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "boh_shopping_cart";
const COUPON_STORAGE_KEY = "boh_applied_coupon";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save coupon", e);
    }
  }, [appliedCoupon, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    personalisation?: CartItemPersonalisation
  ) => {
    const unitPrice = product.price + (personalisation?.giftWrap ? 99 : 0);
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      product,
      quantity,
      personalisation,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setItems((prev) => {
      // If no personalisation, we can stack matching product ID
      if (!personalisation || Object.keys(personalisation).length === 0) {
        const existingIndex = prev.findIndex(
          (i) => i.productId === product.id && (!i.personalisation || Object.keys(i.personalisation).length === 0)
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            totalPrice: updated[existingIndex].unitPrice * newQty,
          };
          return updated;
        }
      }
      return [newItem, ...prev];
    });

    setIsOpen(true);
  };

  const addCustomHamperToCart = (
    hamper: CustomHamperPayload,
    quantity = 1
  ) => {
    const cartItemId = `hamper-${hamper.box.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const syntheticProduct: Product = {
      id: `custom-hamper-${hamper.box.id}`,
      name: `Custom Hamper — ${hamper.box.name}`,
      slug: `custom-hamper-${hamper.box.slug}-${Date.now()}`,
      description: `Bespoke artisanal hamper with ${hamper.items.reduce((s, x) => s + x.quantity, 0)} handcrafted treats & keepsakes.`,
      price: hamper.totalPrice,
      originalPrice: hamper.totalPrice + Math.round(hamper.totalPrice * 0.15),
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      occasion: hamper.personalisation?.occasion || "Just Because",
      giftType: "Custom Hamper",
      rating: 5.0,
      reviewCount: 1,
      images: [
        {
          id: `img-${hamper.box.id}`,
          url: hamper.box.image,
          alt: hamper.box.name,
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newItem: CartItem = {
      id: cartItemId,
      productId: syntheticProduct.id,
      product: syntheticProduct,
      quantity,
      isCustomHamper: true,
      customHamper: hamper,
      unitPrice: hamper.totalPrice,
      totalPrice: hamper.totalPrice * quantity,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {}
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: "Please enter a valid coupon code" };
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Invalid coupon" };
      }

      setAppliedCoupon(data.coupon);
      return {
        success: true,
        message: `Coupon ${data.coupon.code} applied successfully!`,
      };
    } catch {
      return { success: false, message: "Network error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Free shipping on orders >= ₹1499, otherwise ₹99
  const shippingFee = subtotal === 0 || subtotal >= 1499 ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        addCustomHamperToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
