"use client";

import React, { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  HamperBox,
  Product,
  CustomHamperProductItem,
  CustomHamperPersonalisation,
} from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import StepProgress from "./StepProgress";
import BudgetSelector, { BudgetTier } from "./BudgetSelector";
import Step1ChooseBox from "./Step1ChooseBox";
import Step2ChooseProducts from "./Step2ChooseProducts";
import Step3Personalise from "./Step3Personalise";
import Step4Review from "./Step4Review";
import HamperLivePreview from "./HamperLivePreview";

interface HamperBuilderProps {
  initialBoxes: HamperBox[];
  initialProducts: Product[];
  categories: { id: string; name: string; slug: string }[];
}

const STORAGE_KEY = "boh_hamper_studio_draft_v1";

export default function HamperBuilder({
  initialBoxes,
  initialProducts,
  categories,
}: HamperBuilderProps) {
  const { addCustomHamperToCart, openCart } = useCart();
  const { success, error: toastError } = useToast();

  // Builder step (1: Box, 2: Products, 3: Personalise, 4: Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections state
  const [selectedBox, setSelectedBox] = useState<HamperBox | null>(
    initialBoxes[0] || null
  );
  const [selectedItems, setSelectedItems] = useState<CustomHamperProductItem[]>([]);
  const [personalisation, setPersonalisation] = useState<CustomHamperPersonalisation>({
    senderName: "",
    recipientName: "",
    cardMessage: "",
    greetingCard: "Classic Gold Floral",
    giftWrap: "Classic",
    ribbonColor: "Champagne",
    occasion: "Birthday",
    extras: [],
  });

  // Budget selector state
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<BudgetTier>("all");
  const [customBudget, setCustomBudget] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  // Restore draft from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.boxId) {
          const matchBox = initialBoxes.find((b) => b.id === parsed.boxId);
          if (matchBox) setSelectedBox(matchBox);
        }
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          // Re-hydrate full products from initialProducts
          const hydrated: CustomHamperProductItem[] = [];
          for (const savedItem of parsed.items) {
            const p = initialProducts.find((prod) => prod.id === savedItem.productId);
            if (p) {
              hydrated.push({
                product: p,
                quantity: savedItem.quantity,
                unitPrice: p.price,
              });
            }
          }
          if (hydrated.length > 0) setSelectedItems(hydrated);
        }
        if (parsed.personalisation) {
          setPersonalisation((prev) => ({ ...prev, ...parsed.personalisation }));
        }
        if (parsed.step) {
          setCurrentStep(parsed.step);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [initialBoxes, initialProducts]);

  // Persist draft to localStorage on changes
  useEffect(() => {
    try {
      const draft = {
        boxId: selectedBox?.id,
        items: selectedItems.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        personalisation,
        step: currentStep,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota errors
    }
  }, [selectedBox, selectedItems, personalisation, currentStep]);

  // --- Dynamic Pricing Calculations ---
  const boxPrice = selectedBox?.price || 0;

  const itemsPrice = useMemo(() => {
    return selectedItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [selectedItems]);

  const wrappingFee = useMemo(() => {
    if (personalisation.giftWrap === "Premium") return 99;
    if (personalisation.giftWrap === "Occasion") return 149;
    return 0; // Classic is free
  }, [personalisation.giftWrap]);

  const extrasFee = useMemo(() => {
    return (personalisation.extras || []).reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [personalisation.extras]);

  const customisationPrice = wrappingFee + extrasFee;
  const totalPrice = boxPrice + itemsPrice + customisationPrice;

  // --- Navigation Guards ---
  const canNavigateToStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return Boolean(selectedBox);
    if (step === 3) return Boolean(selectedBox) && selectedItems.length > 0;
    if (step === 4) return Boolean(selectedBox) && selectedItems.length > 0;
    return false;
  };

  const handleStepNavigation = (step: number) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  // --- Product Handlers ---
  const handleAddItem = (product: Product) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: 1, unitPrice: product.price }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setSelectedItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId) {
          const clamped = Math.min(quantity, i.product.stock);
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // --- Add to Cart Handler ---
  const handleAddToCart = () => {
    if (!selectedBox) {
      toastError("Please select a hamper box before adding to cart.");
      setCurrentStep(1);
      return;
    }
    if (selectedItems.length === 0) {
      toastError("Please add at least one product inside your hamper.");
      setCurrentStep(2);
      return;
    }

    setIsAddingToCart(true);

    try {
      const customHamperPayload = {
        box: selectedBox,
        items: selectedItems,
        personalisation: {
          ...personalisation,
        },
        boxPrice,
        itemsPrice,
        customisationPrice,
        totalPrice,
      };

      addCustomHamperToCart(customHamperPayload, 1);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#263B2D", "#F4EBDD", "#D7B3A8", "#B8A28A"],
      });

      success("Your custom hamper has been added to your shopping bag!");

      // Clear draft storage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      openCart();
    } catch (err) {
      console.error(err);
      toastError("Failed to add hamper to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] pb-24 sm:pb-32">
      {/* 4-Step Progress Indicator */}
      <StepProgress
        currentStep={currentStep}
        onStepClick={handleStepNavigation}
        canNavigateToStep={canNavigateToStep}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Builder Form (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Part 5: Budget Selector */}
            <BudgetSelector
              currentTotal={totalPrice}
              selectedTier={selectedBudgetTier}
              customBudget={customBudget}
              onSelectTier={setSelectedBudgetTier}
              onSetCustomBudget={setCustomBudget}
            />

            <div key={currentStep} className="animate-step-enter">
              {/* Step 1: Choose Box */}
              {currentStep === 1 && (
                <Step1ChooseBox
                  boxes={initialBoxes}
                  selectedBox={selectedBox}
                  onSelectBox={(box) => setSelectedBox(box)}
                  onContinue={() => handleStepNavigation(2)}
                />
              )}

              {/* Step 2: Choose Products */}
              {currentStep === 2 && (
                <Step2ChooseProducts
                  products={initialProducts}
                  categories={categories}
                  selectedItems={selectedItems}
                  onAddItem={handleAddItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onBack={() => handleStepNavigation(1)}
                  onContinue={() => handleStepNavigation(3)}
                />
              )}

              {/* Step 3: Personalise It */}
              {currentStep === 3 && (
                <Step3Personalise
                  personalisation={personalisation}
                  onChange={(updated) =>
                    setPersonalisation((prev) => ({ ...prev, ...updated }))
                  }
                  onBack={() => handleStepNavigation(2)}
                  onContinue={() => handleStepNavigation(4)}
                />
              )}

              {/* Step 4: Review Your Hamper */}
              {currentStep === 4 && selectedBox && (
                <Step4Review
                  box={selectedBox}
                  selectedItems={selectedItems}
                  personalisation={personalisation}
                  boxPrice={boxPrice}
                  itemsPrice={itemsPrice}
                  customisationPrice={customisationPrice}
                  totalPrice={totalPrice}
                  onEditStep={handleStepNavigation}
                  onRemoveItem={handleRemoveItem}
                  onAddToCart={handleAddToCart}
                  isAdding={isAddingToCart}
                />
              )}
            </div>
          </div>

          {/* Part 4: Live Visual Hamper Preview (5 cols on Desktop) */}
          <div className="lg:col-span-5">
            <HamperLivePreview
              box={selectedBox}
              selectedItems={selectedItems}
              personalisation={personalisation}
              boxPrice={boxPrice}
              itemsPrice={itemsPrice}
              customisationPrice={customisationPrice}
              totalPrice={totalPrice}
              onReviewClick={() => handleStepNavigation(4)}
              isReviewStep={currentStep === 4}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
