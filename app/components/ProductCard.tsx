import React, { useState, useEffect } from 'react'
import { Card } from "./ui/card"
import { ShoppingCart } from 'lucide-react'
// import { Product } from '../data/products'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Product {
  _id: string
  title: string
  price: number
  actual_price: number
  image_url: string
  tabs_image_url: string[]
  discount_percentage: number
}

interface ProductCardProps {
  product: Product
  currentImageIndex: Record<string, number>
  setCurrentImageIndex: (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
}

function ProductCard({ product, currentImageIndex, setCurrentImageIndex }: ProductCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  // Combine image_url with tabs_image_url for all product images
  const allImages = [product.image_url, ...product.tabs_image_url]
  const currentIndex = currentImageIndex[product._id] || 0

  // Preload critical images
  useEffect(() => {
    if (!imagesLoaded) {
      const imagePromises = allImages.slice(0, 2).map(src => {
        return new Promise((resolve, reject) => {
          const img = document.createElement('img')
          img.src = src
          img.onload = resolve
          img.onerror = reject
        })
      })

      Promise.all(imagePromises)
        .then(() => setImagesLoaded(true))
        .catch(err => console.error('Error preloading images:', err))
    }
  }, [product._id, allImages, imagesLoaded])

  // Auto-sliding effect when hovering - only change image if hovering
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [product._id]: (prev[product._id] + 1) % allImages.length || 0
        }))
      }, 1500) // Change image every 1.5 seconds (slightly longer for better UX)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isHovered, product._id, allImages.length, setCurrentImageIndex])

  const handleCardClick = () => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    if (!recentlyViewed.includes(product._id)) {
      recentlyViewed.unshift(product._id)
      const updatedRecentlyViewed = recentlyViewed.slice(0, 10)
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed))
    }
    
    router.push(`/details/${product._id}`)
  }
  
  return (
    <Card 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        // Reset to first image when mouse leaves
        setCurrentImageIndex(prev => ({ ...prev, [product._id]: 0 }))
      }}
      className="group relative bg-white overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer w-full max-w-md mx-auto"
    >
      {/* Discount Badge */}
      {product.discount_percentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full">
            {Math.round(product.discount_percentage)}% OFF
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden group-hover:opacity-95 transition-all duration-300">
        <img
          src={allImages[currentIndex]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          style={{ transition: 'transform 0.3s' }}
          loading="lazy"
        />
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
          {/* Navigation Dots - Only show if there are multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => ({ ...prev, [product._id]: index }))
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-150 ${
                    index === currentIndex 
                      ? "bg-white scale-125" 
                      : "bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Shopping Cart */}
          <button 
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-4 lg:p-5">
        <h3 className="font-medium text-gray-900 text-xs sm:text-base truncate">
          {product.title}
        </h3>
        <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-sm sm:text-lg font-semibold text-gray-900">
            Rs. {product.price}
          </span>
          {product.actual_price > product.price && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              Rs. {product.actual_price}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProductCard