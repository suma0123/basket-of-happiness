"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      success("Welcome back to Basket of Happiness!");
      router.push("/account/dashboard");
    } else {
      toastError(res.error || "Invalid email or password");
    }
  };

  return (
    <div className="bg-[#FFF9F0] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#58111A]/20 shadow-xl shadow-[#58111A]/5 space-y-6 animate-scale-in">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#B8A28A] font-bold">
            Member Access
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#191C18] mt-1 mb-2">
            Welcome Back
          </h1>
          <p className="text-xs text-[#191C18]/60">
            Sign in to access your saved addresses, track current orders, and manage wishlists.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#191C18] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
              />
              <Mail className="w-4 h-4 text-[#B8A28A] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#191C18]">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{isSubmitting ? "Signing In..." : "Sign In to Account"}</span>
            <ArrowRight className="w-4 h-4 text-[#FAF0F2]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#B8A28A]/15 text-xs text-[#191C18]/70">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/account/register" className="text-[#58111A] font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
