"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Gift,
  ArrowRight,
  Clock,
  Sparkles,
  Check,
  CheckCircle,
  Share2,
  Package,
} from "lucide-react";
import { Product, Review } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Personalisation options
  const [recipientName, setRecipientName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [giftCardMessage, setGiftCardMessage] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [chosenColor, setChosenColor] = useState("Warm Champagne");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Review submission
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        }
      } catch (e) {
        console.error("Failed to load product", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 flex flex-col items-center justify-center">
        <Sparkles className="w-8 h-8 text-[#B8A28A] animate-spin mb-4" />
        <p className="font-serif text-lg text-[#191C18]">Presenting luxury curations...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] py-20 text-center">
        <h2 className="font-serif text-2xl text-[#191C18] mb-3">Gift Not Found</h2>
        <p className="text-xs text-[#191C18]/60 mb-6">The item you are searching for might have been retired.</p>
        <Link href="/shop" className="px-6 py-2.5 bg-[#263B2D] text-white text-xs font-semibold rounded-full">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: "f1", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", alt: product.name, isPrimary: true, displayOrder: 0 }];

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      recipientName: recipientName.trim() || undefined,
      customMessage: customMessage.trim() || undefined,
      giftCardMessage: giftCardMessage.trim() || undefined,
      giftWrap,
      chosenColor,
      customPhotoUrl: photoPreview || undefined,
    });
    success(`Added "${product.name}" to your shopping bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlist = async () => {
    const added = await toggleWishlist(product.id);
    success(added ? `Saved "${product.name}" to wishlist` : "Removed from wishlist");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
          authorName: reviewAuthor || user?.name || "Verified Customer",
        }),
      });
      if (res.ok) {
        success("Your review has been submitted and published!");
        setReviewComment("");
        // Reload product to refresh review list
        const refreshed = await fetch(`/api/products/${slug}`).then((r) => r.json());
        if (refreshed.product) setProduct(refreshed.product);
      }
    } catch {
      toastError("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const ribbonColors = ["Warm Champagne", "Forest Velvet", "Muted Rose", "Midnight Charcoal"];

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#191C18]/60 mb-8 font-medium">
          <Link href="/" className="hover:text-[#263B2D]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#263B2D]">Shop</Link>
          <span>/</span>
          <Link href={`/shop?occasion=${encodeURIComponent(product.occasion)}`} className="hover:text-[#263B2D]">
            {product.occasion}
          </Link>
          <span>/</span>
          <span className="text-[#191C18] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout: Gallery Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-[#B8A28A]/20">
          {/* Gallery Left (7 cols) */}
          <div className="lg:col-span-7 space-y-4 animate-step-enter-left">
            {/* Main Stage Image */}
            <div className="aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden bg-white border-2 border-[#58111A]/20 relative shadow-md shadow-[#58111A]/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[selectedImageIdx]?.url}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.discountPercent && (
                <span className="absolute top-4 left-4 bg-[#58111A] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider shadow-sm border border-[#7A1B28]/40">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIdx === idx
                        ? "border-[#58111A] ring-2 ring-[#58111A]/25 scale-105"
                        : "border-[#B8A28A]/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6 animate-step-enter">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-[#B8A28A] font-semibold mb-1.5">
                <span>{product.occasion} • {product.giftType || "Luxury Hamper"}</span>
                <span className="text-[#263B2D] bg-[#263B2D]/10 px-2.5 py-0.5 rounded-full font-bold">
                  {product.stock > 0 ? `${product.stock} In Stock` : "Sold Out"}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#191C18] leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-[#263B2D]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-[#263B2D]" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#191C18]">{product.rating}</span>
                <span className="text-xs text-[#191C18]/50">
                  ({product.reviews?.length || product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-serif font-bold text-[#263B2D]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#191C18]/40 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#191C18]/60">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#191C18]/80 leading-relaxed font-light mb-6">
                {product.description}
              </p>
            </div>

            {/* Personalisation Studio Form */}
            <div className="bg-white p-5 rounded-2xl border border-[#B8A28A]/30 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#B8A28A]/20">
                <p className="text-xs font-bold uppercase tracking-wider text-[#191C18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8A28A]" />
                  <span>Personalise Your Gift</span>
                </p>
                <span className="text-[10px] text-[#263B2D] font-semibold">Complimentary</span>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#191C18] mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Aanya Sharma"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              {/* Calligraphy Greeting Card Note */}
              <div>
                <label className="block text-[11px] font-semibold text-[#191C18] mb-1">
                  Calligraphy Gift Card Message:
                </label>
                <textarea
                  rows={2}
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  placeholder="e.g. Wishing you a year of pure happiness..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-3 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              {/* Ribbon Theme */}
              <div>
                <label className="block text-[11px] font-semibold text-[#191C18] mb-1.5">
                  Satin Ribbon Color:
                </label>
                <div className="flex gap-2">
                  {ribbonColors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setChosenColor(col)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                        chosenColor === col
                          ? "bg-[#263B2D] text-white border-[#263B2D]"
                          : "bg-[#FAF5EE] text-[#191C18]/80 border-[#B8A28A]/30 hover:bg-[#F4EBDD]"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload preview */}
              <div>
                <label className="block text-[11px] font-semibold text-[#191C18] mb-1">
                  Optional Photo for Memory Card / Keepsake:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-xs text-[#191C18]/70"
                />
                {photoPreview && (
                  <p className="text-[10px] text-[#263B2D] font-medium mt-1">
                    ✓ Photo attached successfully
                  </p>
                )}
              </div>

              {/* Velvet Gift Wrap Toggle */}
              <label className="flex items-center gap-2.5 pt-1 text-xs text-[#191C18] cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded border-[#B8A28A] text-[#263B2D] focus:ring-[#263B2D]"
                />
                <span className="font-medium">
                  Add Signature Velvet Gift Wrap (+₹99)
                </span>
              </label>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-[#B8A28A]/40 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 hover:bg-[#F4EBDD] text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-[#191C18]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-3 hover:bg-[#F4EBDD] text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-6 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-300 text-white rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all border border-[#7A1B28]/40"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FAF0F2]" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWishlist
                      ? "bg-[#58111A] border-[#58111A] text-white"
                      : "border-[#B8A28A]/40 text-[#191C18] hover:bg-[#F4EBDD]"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Buy Now direct button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 bg-[#FAF0F2] hover:bg-[#58111A] hover:text-white text-[#58111A] border-2 border-[#58111A] rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Buy Now with 1-Click Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#58111A] group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Delivery & Trust highlights */}
            <div className="pt-4 border-t border-[#B8A28A]/20 grid grid-cols-2 gap-3 text-xs text-[#191C18]/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#263B2D]" />
                <span>Pan-India Delivery in 2-4 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#263B2D]" />
                <span>Complimentary Calligraphy Card</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#263B2D]" />
                <span>100% Genuine Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#263B2D]" />
                <span>Dispatches Within 24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Contents Section */}
        {product.specifications && (
          <div className="py-12 border-b border-[#B8A28A]/20 max-w-4xl">
            <h2 className="font-serif text-2xl font-medium text-[#191C18] mb-4">
              What&apos;s Inside the Hamper
            </h2>
            <div className="bg-white p-6 rounded-3xl border border-[#B8A28A]/25 whitespace-pre-line text-xs sm:text-sm text-[#191C18]/80 leading-relaxed font-light">
              {product.specifications}
            </div>
          </div>
        )}

        {/* Customer Reviews & Ratings Section */}
        <div className="py-12 border-b border-[#B8A28A]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191C18]">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-[#263B2D]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#191C18]">{product.rating} out of 5</span>
              </div>
            </div>
          </div>

          {/* Review list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-[#B8A28A]/25 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-semibold text-[#191C18]">
                      {rev.authorName}
                    </span>
                    <div className="flex text-[#263B2D]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#191C18]/80 leading-relaxed mb-3 italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <span className="text-[10px] text-[#263B2D] font-medium bg-[#263B2D]/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Verified Customer
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#191C18]/60 italic col-span-2">
                No customer reviews yet for this particular item. Be the first to share your thoughts!
              </p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#58111A]/20 shadow-md shadow-[#58111A]/5 max-w-xl">
            <h3 className="font-serif text-lg font-medium text-[#191C18] mb-1">
              Add a Verified Review
            </h3>
            <p className="text-xs text-[#191C18]/60 mb-4">
              Share your unboxing experience with our boutique gifting community.
            </p>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating ? "fill-[#263B2D] text-[#263B2D]" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the presentation, freshness, and packaging?"
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-3 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-2.5 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 shadow-sm hover:shadow-md text-xs font-semibold rounded-xl disabled:opacity-50 transition-all"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191C18]">
                You May Also Adore
              </h2>
              <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-[#263B2D] hover:underline">
                View All Gifts →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
