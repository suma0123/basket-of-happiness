"use client";

import React, { useState } from "react";
import { Mail, Phone, Send, Sparkles, MessageCircle, Clock, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { success } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Custom Hamper Inquiry");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success("Thank you! Our gifting concierge will reach out to you within a few hours.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 600);
  };

  const faqs = [
    {
      q: "Can I customize the items inside a pre-curated hamper?",
      a: "Yes! You can either use our 'Make It Personal' customizer studio on the homepage, or message our concierge on WhatsApp directly to swap treats, adjust fragrances, or add specific sentimental keepsakes.",
    },
    {
      q: "How does personalized gift card calligraphy work?",
      a: "During checkout or on any product page, write your heartfelt message. Our in-house artists will print or hand-letter your words onto heavy-stock textured cardstock and seal it with a wax stamp.",
    },
    {
      q: "Do you deliver on a specific date for birthdays or anniversaries?",
      a: "Yes! We specialize in date-specific milestone delivery. Mention your target date in the delivery instructions during checkout and we schedule dispatch accordingly.",
    },
    {
      q: "Do you accept corporate bulk hamper orders?",
      a: "Absolutely. We craft custom corporate gifting trunks with company branding, premium dry fruits, branded stationery, and custom ribbons for teams and VIP clients.",
    },
  ];

  return (
    <div className="bg-[#FFF9F0] min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 animate-fade-in">
          <span className="text-xs uppercase tracking-widest text-[#B8A28A] font-semibold">
            Dedicated Gifting Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#191C18]">
            We&apos;re Here to Help You Spread Joy
          </h1>
          <p className="text-sm text-[#191C18]/70 font-light">
            Have a custom gifting inquiry, bulk order request, or need help choosing the perfect surprise? Reach out anytime.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6 animate-step-enter-left">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#B8A28A]/25 shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#191C18]">
                Get in Touch
              </h3>

              <div className="space-y-4 text-xs text-[#191C18]/80">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20 hover:border-[#263B2D] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#263B2D] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191C18] group-hover:text-[#263B2D]">
                      WhatsApp Concierge
                    </h4>
                    <p className="text-[#191C18]/60">+91 98765 43210 (Mon-Sat, 9am - 8pm)</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/basket_of_happi_nesss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20 hover:border-[#263B2D] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#263B2D] text-white flex items-center justify-center shrink-0">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191C18] group-hover:text-[#263B2D]">
                      Instagram DM
                    </h4>
                    <p className="text-[#191C18]/60">@basket_of_happi_nesss</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20">
                  <div className="w-10 h-10 rounded-xl bg-[#263B2D] text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191C18]">Email Concierge</h4>
                    <p className="text-[#191C18]/60">concierge@basketofhappiness.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#B8A28A]/20">
                  <div className="w-10 h-10 rounded-xl bg-[#263B2D] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191C18]">Operating Hours</h4>
                    <p className="text-[#191C18]/60">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Right (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#58111A]/20 shadow-lg shadow-[#58111A]/5 animate-step-enter">
            <h3 className="font-serif text-2xl font-medium text-[#191C18] mb-1">
              Send Us a Message
            </h3>
            <p className="text-xs text-[#191C18]/60 mb-6">
              Fill out this form and we will get back to you promptly with recommendations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aanya Sharma"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aanya@example.com"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-4 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#191C18] mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl px-3 py-2.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                  >
                    <option>Custom Hamper Inquiry</option>
                    <option>Corporate / Bulk Gifting</option>
                    <option>Order Tracking &amp; Delivery</option>
                    <option>Product Inquiry</option>
                    <option>General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191C18] mb-1">
                  How can we help you? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the recipient, occasion, preferred treats, or any questions..."
                  className="w-full bg-[#FAF5EE] border border-[#B8A28A]/30 rounded-xl p-3.5 text-xs text-[#191C18] focus:outline-none focus:border-[#263B2D]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#58111A] hover:bg-[#3B0A11] disabled:bg-gray-400 text-white border border-[#7A1B28]/40 shadow-md hover:shadow-lg rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Sending Message..." : "Send Message to Concierge"}</span>
                <Send className="w-3.5 h-3.5 text-[#FAF0F2]" />
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <div id="faqs" className="pt-8 space-y-6">
          <div className="text-center max-w-xl mx-auto animate-fade-in">
            <h2 className="font-serif text-3xl font-medium text-[#191C18] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#191C18]/60">
              Quick answers about shipping, customisation, and unboxing surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 90}ms` }}
                className="bg-white p-6 rounded-3xl border border-[#B8A28A]/25 shadow-xs space-y-2 animate-fade-in-up hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-serif text-base font-semibold text-[#191C18]">
                  {faq.q}
                </h3>
                <p className="text-xs text-[#191C18]/70 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
