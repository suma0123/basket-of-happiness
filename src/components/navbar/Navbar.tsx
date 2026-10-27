"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  Package,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { openCart, itemCount } = useCart();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [occasionsDropdownOpen, setOccasionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const occasionsList = [
    { name: "Birthday", href: "/shop?occasion=birthday" },
    { name: "Anniversary", href: "/shop?occasion=anniversary" },
    { name: "Thank You", href: "/shop?occasion=thank-you" },
    { name: "Baby Gifts", href: "/shop?occasion=baby-gifts" },
    { name: "Just Because", href: "/shop?occasion=just-because" },
    { name: "For Him", href: "/shop?occasion=for-him" },
    { name: "For Her", href: "/shop?occasion=for-her" },
    { name: "Festive Gifts", href: "/shop?occasion=festive-gifts" },
  ];

  return (
    <>
      <div
        className={`w-full z-40 transition-all duration-300 ${
          isHome ? "fixed top-0 left-0 right-0" : "sticky top-0"
        }`}
      >

        {/* Main Navigation */}
        <header
          className={`w-full transition-all duration-300 ${
            isTransparent
              ? "bg-transparent border-b border-white/10 py-4 sm:py-5"
              : "bg-[#FFF9F0]/95 backdrop-blur-md shadow-sm border-b border-[#B8A28A]/20 py-3 sm:py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className={`p-2 -ml-2 transition-colors ${
                    isTransparent ? "text-white hover:text-[#F4EBDD]" : "text-[#191C18] hover:text-[#263B2D]"
                  }`}
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 transition-colors ml-1 ${
                    isTransparent ? "text-white hover:text-[#F4EBDD]" : "text-[#191C18] hover:text-[#263B2D]"
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Brand Logo */}
              <div className="flex-1 lg:flex-initial text-center lg:text-left">
                <Link href="/" className="inline-block group">
                  <div className="flex flex-col items-center lg:items-start">
                    <span
                      className={`font-serif text-2xl sm:text-3xl font-medium tracking-tight transition-colors ${
                        isTransparent
                          ? "text-white group-hover:text-[#F4EBDD] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                          : "text-[#191C18] group-hover:text-[#263B2D]"
                      }`}
                    >
                      Basket of Happiness
                    </span>
                    <span
                      className={`text-[10px] tracking-[0.28em] uppercase -mt-1 font-sans font-medium transition-colors ${
                        isTransparent ? "text-[#E8D8C3]" : "text-[#B8A28A]"
                      }`}
                    >
                      Artisanal Luxury Gifting
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav
                className={`hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide transition-colors ${
                  isTransparent ? "text-white/95" : "text-[#191C18]/90"
                }`}
              >
                <Link
                  href="/"
                  className={`transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform ${
                    isTransparent
                      ? "hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] after:bg-white"
                      : "hover:text-[#263B2D] after:bg-[#263B2D]"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className={`transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform ${
                    isTransparent
                      ? "hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] after:bg-white"
                      : "hover:text-[#263B2D] after:bg-[#263B2D]"
                  }`}
                >
                  Shop
                </Link>

                {/* Occasions Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setOccasionsDropdownOpen(true)}
                  onMouseLeave={() => setOccasionsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 transition-colors py-1 ${
                      isTransparent
                        ? "hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                        : "hover:text-[#263B2D]"
                    }`}
                  >
                    <span>Occasions</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                  {occasionsDropdownOpen && (
                    <div className="absolute top-full left-0 w-56 pt-2 z-50">
                      <div className="bg-[#FFF9F0] border border-[#B8A28A]/30 rounded-xl shadow-xl p-2 py-3 backdrop-blur-md">
                        {occasionsList.map((occ) => (
                          <Link
                            key={occ.name}
                            href={occ.href}
                            onClick={() => setOccasionsDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-[#191C18] hover:bg-[#F4EBDD] rounded-lg transition-colors"
                          >
                            <span>{occ.name}</span>
                            <ArrowRight className="w-3 h-3 opacity-40" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/build-your-hamper"
                  className={`font-semibold transition-colors py-1 flex items-center gap-1.5 ${
                    isTransparent
                      ? "text-[#F4EBDD] hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                      : "text-[#263B2D] hover:text-[#58111A]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B8A28A]" />
                  <span>Build Your Hamper</span>
                  <span className="hidden xl:inline-block text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-[#58111A] text-[#FAF0F2] shadow-xs">
                    Studio
                  </span>
                </Link>
                <Link
                  href="/about"
                  className={`transition-colors py-1 ${
                    isTransparent ? "hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]" : "hover:text-[#263B2D]"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`transition-colors py-1 ${
                    isTransparent ? "hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]" : "hover:text-[#263B2D]"
                  }`}
                >
                  Contact
                </Link>
              </nav>

              {/* Utility Actions (Search, Account, Wishlist, Cart) */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Desktop Search Toggle */}
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`hidden lg:flex p-2 transition-colors ${
                    isTransparent ? "text-white/95 hover:text-white" : "text-[#191C18] hover:text-[#263B2D]"
                  }`}
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Icon */}
                <Link
                  href="/account/dashboard?tab=wishlist"
                  className={`p-2 transition-colors relative ${
                    isTransparent ? "text-white/95 hover:text-white" : "text-[#191C18] hover:text-[#263B2D]"
                  }`}
                  aria-label="View Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {user && user.wishlistIds && user.wishlistIds.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#58111A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                      {user.wishlistIds.length}
                    </span>
                  )}
                </Link>

                {/* User Account Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`p-2 transition-colors flex items-center gap-1 ${
                      isTransparent ? "text-white/95 hover:text-white" : "text-[#191C18] hover:text-[#263B2D]"
                    }`}
                    aria-label="Account options"
                  >
                    <User className="w-5 h-5" />
                    {user && (
                      <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                        {user.name.split(" ")[0]}
                      </span>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-[#FFF9F0] border border-[#B8A28A]/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-[#B8A28A]/20">
                            <p className="text-xs text-[#B8A28A] font-medium uppercase tracking-wider">
                              Signed in as
                            </p>
                            <p className="text-sm font-semibold text-[#191C18] truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#191C18]/70 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/account/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#191C18] hover:bg-[#F4EBDD] transition-colors"
                          >
                            <Package className="w-4 h-4 text-[#263B2D]" />
                            My Orders & Dashboard
                          </Link>
                          {user.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#263B2D] bg-[#263B2D]/5 hover:bg-[#263B2D]/10 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-[#263B2D]" />
                              Admin Console
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors text-left border-t border-[#B8A28A]/15 mt-1"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-2 text-xs text-[#191C18]/80 font-medium border-b border-[#B8A28A]/20">
                            Welcome to Basket of Happiness
                          </div>
                          <Link
                            href="/account/login"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#191C18] hover:bg-[#F4EBDD] transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/account/register"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#263B2D] font-semibold hover:bg-[#F4EBDD] transition-colors"
                          >
                            Create Account
                          </Link>
                          <div className="border-t border-[#B8A28A]/20 pt-1">
                            <Link
                              href="/track-order"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-xs text-[#191C18]/70 hover:bg-[#F4EBDD] transition-colors"
                            >
                              Track an Order
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Shopping Bag Button with Live Badge */}
                <button
                  type="button"
                  onClick={openCart}
                  className={`relative p-2.5 rounded-full transition-all shadow-sm flex items-center justify-center group ${
                    isTransparent
                      ? "bg-[#263B2D] text-white border border-white/25 hover:bg-[#1A281E] hover:border-white shadow-md"
                      : "bg-[#263B2D] text-white hover:bg-[#1A281E]"
                  }`}
                  aria-label={`Open shopping cart with ${itemCount} items`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#F4EBDD] group-hover:scale-105 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#58111A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FFF9F0] shadow-md animate-bounce">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Slide-out Search Bar */}
            {searchOpen && (
              <div className={`mt-4 pt-3 border-t animate-fade-in ${isTransparent ? "border-white/20" : "border-[#B8A28A]/20"}`}>
                <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artisanal hampers, chocolates, candles, flowers, baby gifts..."
                    className="w-full bg-[#FFFFFF] border border-[#B8A28A]/40 rounded-full py-2.5 pl-5 pr-24 text-sm focus:outline-none focus:border-[#263B2D] text-[#191C18] shadow-lg"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[#263B2D] text-[#F4EBDD] rounded-full text-xs font-medium hover:bg-[#1A281E] transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FFF9F0] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#B8A28A]/20">
                <div className="font-serif text-xl font-medium text-[#191C18]">
                  Basket of Happiness
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#191C18]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gifts..."
                    className="w-full bg-white border border-[#B8A28A]/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-[#263B2D]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2.5 text-[#191C18]/60"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Nav links */}
              <nav className="mt-6 space-y-3 font-medium text-sm">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#191C18] hover:text-[#263B2D] border-b border-[#B8A28A]/10"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#191C18] hover:text-[#263B2D] border-b border-[#B8A28A]/10"
                >
                  Shop All Gifts
                </Link>
                <div className="py-2">
                  <p className="text-xs uppercase tracking-wider text-[#B8A28A] font-semibold mb-2">
                    Shop By Occasion
                  </p>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {occasionsList.map((occ) => (
                      <Link
                        key={occ.name}
                        href={occ.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs text-[#191C18]/80 hover:text-[#263B2D] py-1"
                      >
                        • {occ.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/build-your-hamper"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#263B2D] font-bold border-b border-[#B8A28A]/10 flex items-center justify-between"
                >
                  <span>✨ Build Your Own Hamper</span>
                  <span className="text-[10px] bg-[#58111A] text-white px-2 py-0.5 rounded-full font-sans shadow-xs">Studio</span>
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#191C18] hover:text-[#263B2D] border-b border-[#B8A28A]/10"
                >
                  About Our Brand
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#191C18] hover:text-[#263B2D]"
                >
                  Contact Concierge
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-xs text-[#B8A28A]"
                >
                  Track Existing Order →
                </Link>
              </nav>
            </div>

            {/* Account CTA bottom */}
            <div className="pt-6 border-t border-[#B8A28A]/20">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#191C18] font-semibold truncate">
                    Hello, {user.name}
                  </p>
                  <Link
                    href="/account/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2 bg-[#263B2D] text-white rounded-lg text-xs font-medium"
                  >
                    View Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block text-center w-full py-2 border border-red-200 text-red-600 rounded-lg text-xs font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/account/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 border border-[#263B2D] text-[#263B2D] rounded-lg text-xs font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/account/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 bg-[#263B2D] text-white rounded-lg text-xs font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
