import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccountProvider } from "@/lib/account-context";
import { CartProvider } from "@/lib/cart-context";
import { StoreChrome } from "@/components/layout/StoreChrome";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jummip | Premium Garments",
  description:
    "Shop women’s t-shirts, nightsuits and undergarments at Jummip. Soft cotton, everyday comfort.",
  keywords: [
    "womens t-shirts",
    "nightsuits",
    "undergarments",
    "cotton wear",
    "garments",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AccountProvider>
          <CartProvider>
            <StoreChrome>{children}</StoreChrome>
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
