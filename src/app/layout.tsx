import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { MusicProvider } from "@/context/MusicContext";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ScrollRevealProvider from "@/components/ui/ScrollRevealProvider";
import PageTransition from "@/components/ui/PageTransition";
import BackgroundMusicPlayer from "@/components/audio/BackgroundMusicPlayer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Basket of Happiness | Premium Luxury Gift Store & Custom Hampers",
  description:
    "Thoughtfully curated luxury hampers, bespoke gifts, and personalised surprises for every special moment in life. Handcrafted with love in India.",
  keywords: [
    "luxury gift hampers",
    "custom gifts India",
    "birthday hampers",
    "anniversary gifts",
    "curated gift boxes",
    "basket of happiness",
  ],
  openGraph: {
    title: "Basket of Happiness | Premium Luxury Gift Store",
    description:
      "More Than Just Gifts, It's a Feeling. Thoughtfully curated hampers, bespoke gifts, and personalised surprises.",
    url: "https://basketofhappiness.in",
    siteName: "Basket of Happiness",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Basket of Happiness Luxury Hamper",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${caveat.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF9F0] text-[#191C18] antialiased selection:bg-[#B8A28A]/30 selection:text-[#191C18]">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <MusicProvider>
                <Navbar />
                <ScrollRevealProvider>
                  <main className="flex-1 flex flex-col">
                    <PageTransition>{children}</PageTransition>
                  </main>
                </ScrollRevealProvider>
                <CartDrawer />
                <BackgroundMusicPlayer />
                <Footer />
              </MusicProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
