"use client";

import React, { useState } from "react";
import { Star, CheckCircle, MessageSquareQuote, Sparkles, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  productName: string;
  isVerified: boolean;
  date: string;
}

const INITIAL_TESTIMONIALS: ReviewItem[] = [
  {
    id: "rev-1",
    authorName: "Pooja Varma",
    rating: 5,
    comment:
      "Ordered the Classic Happiness Hamper for my sister's 25th birthday and she literally cried happy tears! The handwritten calligraphy card and the fragrance of the vanilla candle when opening the wooden trunk was just breathtaking.",
    productName: "Classic Happiness Hamper",
    isVerified: true,
    date: "Verified Buyer • Bengaluru",
  },
  {
    id: "rev-2",
    authorName: "Vikram Malhotra",
    rating: 5,
    comment:
      "Undoubtedly the most opulent gift hamper in India. The velvet emerald finish, gold-embossed details, and custom photo easel made our 10th wedding anniversary truly unforgettable.",
    productName: "Premium Velvet Emerald Hamper",
    isVerified: true,
    date: "Verified Buyer • Mumbai",
  },
  {
    id: "rev-3",
    authorName: "Ananya Deshmukh",
    rating: 5,
    comment:
      "The preserved Ecuadorian roses look as fresh today as they did when delivered 3 months ago! Packaged with utmost care and delivered right on time.",
    productName: "Midnight Bloom Luxury Box",
    isVerified: true,
    date: "Verified Buyer • Pune",
  },
  {
    id: "rev-4",
    authorName: "Meera Nair",
    rating: 5,
    comment:
      "The photo keepsake print quality was museum grade, and the succulent arrived in pristine condition. Basket of Happiness really lives up to its name!",
    productName: "Personalised Keepsake Memory Frame",
    isVerified: true,
    date: "Verified Buyer • Kochi",
  },
];

export default function TestimonialsSection() {
  const { user } = useAuth();
  const { success } = useToast();

  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_TESTIMONIALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [productName, setProductName] = useState("Classic Happiness Hamper");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim() || user?.name || "Happy Customer",
      rating,
      comment: comment.trim(),
      productName,
      isVerified: true,
      date: "Verified Buyer • Just now",
    };

    setReviews([newReview, ...reviews]);
    success("Thank you! Your heartfelt review has been shared.");
    setModalOpen(false);
    setComment("");
    setAuthorName("");
  };

  return (
    <section className="py-20 md:py-24 bg-[#FAF5EE] border-b border-[#B8A28A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B8A28A] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Stories of Joy</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191C18]">
              Words from Happy Hearts
            </h2>
          </div>
          <div>
            <button
              onClick={() => {
                if (user) setAuthorName(user.name);
                setModalOpen(true);
              }}
              className="px-6 py-3 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 text-xs font-semibold tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#58111A]/15 shadow-xs flex flex-col justify-between hover:shadow-xl hover:shadow-[#58111A]/10 hover:border-[#58111A] transition-all duration-300"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? "fill-[#263B2D] text-[#263B2D]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-[#191C18]/80 leading-relaxed font-light italic mb-6">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#B8A28A]/15">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-semibold text-[#191C18]">
                    {rev.authorName}
                  </h4>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#263B2D] font-medium bg-[#263B2D]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#B8A28A] font-medium mt-0.5">
                  {rev.productName}
                </p>
                <p className="text-[10px] text-[#191C18]/40 mt-0.5">
                  {rev.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#191C18]/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-[#FFF9F0] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#B8A28A]/30 animate-fade-in">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F4EBDD]"
              >
                <X className="w-5 h-5 text-[#191C18]" />
              </button>

              <h3 className="font-serif text-2xl font-medium text-[#191C18] mb-1">
                Share Your Experience
              </h3>
              <p className="text-xs text-[#191C18]/60 mb-6">
                Tell us how your hamper brought happiness to your loved one.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Pooja Varma"
                    className="w-full bg-white border border-[#B8A28A]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#263B2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Hamper / Product
                  </label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-white border border-[#B8A28A]/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#263B2D]"
                  >
                    <option>Classic Happiness Hamper</option>
                    <option>Midnight Bloom Luxury Box</option>
                    <option>Sweet Moments Gourmet Hamper</option>
                    <option>Cozy Vibes Wellness Hamper</option>
                    <option>Premium Velvet Emerald Hamper</option>
                    <option>Personalised Keepsake Memory Frame</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "fill-[#263B2D] text-[#263B2D]"
                              : "text-gray-300"
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
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your honest review..."
                    className="w-full bg-white border border-[#B8A28A]/40 rounded-xl p-3 text-xs focus:outline-none focus:border-[#263B2D]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#58111A] hover:bg-[#3B0A11] text-white border border-[#7A1B28]/40 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
