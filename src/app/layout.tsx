// src/app/layout.tsx
import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ChessWatch",
  description: "Live chess tournament tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      {/* CHANGE: Removed conflicting bg-white/dark:bg-black classes. Let globals.css handle it. */}
      <body className="min-h-screen">
        <ThemeProvider>
          <Header />
          {/* CHANGE: Added padding top/bottom to prevent content from hiding under the fixed header/footer. */}
          <main className="pt-24 pb-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}