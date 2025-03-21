import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { CategoryProvider } from "./context/CategoryContext";
import { FilterProvider } from "./context/FilterContext";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "shinghai",
  description: "shinghai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryProvider>
            <FilterProvider>
              <CartProvider>
                {children}
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#333",
                      color: "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                    },
                    success: {
                      style: {
                        background: "#059669",
                      },
                    },
                    error: {
                      style: {
                        background: "#dc2626",
                      },
                    },
                  }}
                />
              </CartProvider>
            </FilterProvider>
          </CategoryProvider>
        </Suspense>
      </body>
    </html>
  );
}
