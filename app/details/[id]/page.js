"use client";
import React, { useState, useEffect, Suspense } from "react";
import ProductDetail from "../../components/detailUi/ProductDetail";
import TopBanner from "../../components/layout/TopBanner";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { ProductGrid } from "../../components/ProductGrid";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DetailPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showRecommended, setShowRecommended] = useState(false);
  
  // After initial render, allow a slight delay before showing recommended products
  // This gives priority to loading the main product details first
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Delay showing recommended products even further
      const recommendedTimer = setTimeout(() => {
        setShowRecommended(true);
      }, 500);
      
      return () => clearTimeout(recommendedTimer);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <TopBanner />
      <Header />

      <ProductDetail />

      {!isLoading && (
        <>
          {/* You May Also Like Section */}
          <section className="py-12 px-4 sm:py-16 sm:px-6 lg:px-8 bg-gray-50">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">
                You May Also Like
              </h2>
              <Suspense fallback={<LoadingGrid />}>
                <ProductGrid limit={4} excludeId={params?.id} />
              </Suspense>
            </div>
          </section>

          {/* Recently Viewed Section - Only load after Everything else */}
          {showRecommended && (
            <section className="py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">
                  Recently Viewed
                </h2>
                <Suspense fallback={<LoadingGrid />}>
                  <ProductGrid limit={4} recentlyViewed={true} />
                </Suspense>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

// Loading placeholder for product grids
const LoadingGrid = () => (
  <div className="w-full">
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
