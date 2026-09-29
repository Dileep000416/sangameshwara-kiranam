import type { Metadata } from "next";

import "./globals.css";
import { CartProvider } from "@/context/CartContext";



export const metadata: Metadata = {
  title: {
    default: "Sangameshwara Kiranam & General Store",
    template: "%s | Sangameshwara Kiranam & General Store",
  },
  description:
    "Shop groceries, household essentials and everyday products from Sangameshwara Kiranam & General Store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
