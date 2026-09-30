import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sangameshwarakiranam.in"),
  title: {
    default: "Sangameshwara Kiranam & General Store",
    template: "%s | Sangameshwara Kiranam & General Store",
  },
  description:
    "Shop groceries, household essentials and everyday products from Sangameshwara Kiranam & General Store. Order online, pay on delivery, and confirm instantly on WhatsApp.",
  openGraph: {
    title: "Sangameshwara Kiranam & General Store",
    description:
      "Shop groceries, household essentials and everyday products online with fast WhatsApp order confirmation.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
