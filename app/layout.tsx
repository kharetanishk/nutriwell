import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeContextProvider from "@/lib/themeProvider";
import Providers from "./Providers"; // 🌟 Global Booking Provider Wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriWell | Nutrition Doctor",
  description: "Personalized nutrition and wellness care",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-800`}
      >
        <ThemeContextProvider>
          {/* 🌟 All client providers loaded here */}
          <Providers>
            <Navbar />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
          </Providers>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
