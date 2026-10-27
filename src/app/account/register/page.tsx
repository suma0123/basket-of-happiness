"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Phone, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toastError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    const res = await register({ name, email, password, phone });
    setIsSubmitting(false);

    if (res.success) {
      success("Welcome to the Basket of Happiness family!");
      router.push("/account/dashboard");
    } else {
      toastError(res.error || "Registration failed");
    }
  };

  return (
    <div className="bg-[#FFF9F0] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#58111A]/20 shadow-xl shadow-[#58111A]/5 space-y-6 animate-scale-in">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#B8A28A] font-bold">
            Join The Happiness Circle
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#191C18] mt-1 mb-2">
            Create an Account
          </h1>
          <p className="text-xs text-[#191C18]/60">
            Enjoy streamlined checkout, order tracking, and personalised gifting wishlists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aanya Sharma"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              />
              <User className="w-4 h-4 text-[#B8A28A] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aanya@example.com"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              />
              <Mail className="w-4 h-4 text-[#B8A28A] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              />
              <Phone className="w-4 h-4 text-[#B8A28A] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1">
              Password (Min. 6 characters) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              />
              <Lock className="w-4 h-4 text-[#B8A28A] absolute right-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-400 text-white border border-[#7A1B28]/40 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 text-[#FAF0F2]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#B8A28A]/15 text-xs text-[#191C18]/70">
          <span>Already have an account? </span>
          <Link href="/account/login" className="text-[#58111A] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
