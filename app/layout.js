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
    <head>
      <!-- Meta Pixel Code -->
      <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '701620179080005');
      fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=701620179080005&ev=PageView&noscript=1"
      /></noscript>
      <!-- End Meta Pixel Code -->
    </head>
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
