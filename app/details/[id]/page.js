'use client'
import React from 'react'
import ProductDetail from '../../components/detailUi/ProductDetail'
import TopBanner from '../../components/layout/TopBanner'
import { Header } from "../../components/layout/Header"
import { Footer } from "../../components/layout/Footer"
import { ProductGrid } from "../../components/ProductGrid"

function Page() {
  return (
    <div>
      <TopBanner/>
      <Header/>
      <ProductDetail/>
      
      {/* You May Also Like Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">You May Also Like</h2>
          <ProductGrid limit={4} excludeId={1} /> {/* Limit to 4 products and exclude current product */}
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Recently Viewed</h2>
          <ProductGrid limit={4} recentlyViewed={true} />
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default Page
