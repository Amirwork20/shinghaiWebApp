'use client'
import { useState, useEffect } from 'react'
import { useCategory } from '../context/CategoryContext'
import ProductCard from "./ProductCard"
import { useFilter } from '../context/FilterContext'

interface Product {
  _id: string
  title: string
  price: number
  actual_price: number
  image_url: string
  tabs_image_url: string[]
  discount_percentage: number
  fabric_id: string
  season?: string
  fabric?: {
    _id: string
    fabric_name: string
  }
  // ... other fields as needed
}

interface ProductGridProps {
  limit?: number
  excludeId?: string
  recentlyViewed?: boolean
}

export function ProductGrid({ limit, excludeId, recentlyViewed = false }: ProductGridProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { activeCategory } = useCategory()
  const { sortBy, season, priceRange, fabric } = useFilter()
console.log(products,"products")
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()
        
        // Add category params
        if (activeCategory.mainCategory.id) {
          params.append('main-category', activeCategory.mainCategory.id)
        }
        if (activeCategory.subCategory.id) {
          params.append('sub-category', activeCategory.subCategory.id)
        }
        if (activeCategory.category.id) {
          params.append('category', activeCategory.category.id)
        }

        // Add search parameter if it exists
        if (activeCategory.search) {
          params.append('search', activeCategory.search)
        }

        // Add filter params
        if (sortBy) {
          params.append('sort', sortBy)
        }
        
        // Add price range params
        params.append('min_price', priceRange[0].toString())
        params.append('max_price', priceRange[1].toString())
        
        const queryString = params.toString()
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/recommended-products${queryString ? `?${queryString}` : ''}`
        
        const response = await fetch(url)
        const data = await response.json()
        if (data.success) {
          let filteredProducts = data.data.products

          // Apply client-side fabric filtering
          if (fabric) {
            filteredProducts = filteredProducts.filter(product => 
              product.fabric_id === fabric || 
              product.fabric?._id === fabric
            )
          }

          // Apply client-side season filtering
          if (season) {
            filteredProducts = filteredProducts.filter(product => {
              // Handle case-insensitive comparison
              const productSeason = product.season?.toLowerCase() || ''
              const selectedSeason = season.toLowerCase()
              return productSeason === selectedSeason
            })
          }

          // Apply client-side price filtering
          filteredProducts = filteredProducts.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
          )

          // Apply sorting if needed
          if (sortBy) {
            filteredProducts.sort((a, b) => {
              switch (sortBy) {
                case 'new':
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'old':
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case 'price-asc':
                  return a.price - b.price
                case 'price-desc':
                  return b.price - a.price
                default:
                  return 0
              }
            })
          }

          setProducts(filteredProducts)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory, sortBy, season, priceRange, fabric])

  // Filter and limit products based on props
  let displayProducts = [...products]
  
  if (excludeId) {
    displayProducts = displayProducts.filter(product => product._id !== excludeId)
  }

  if (recentlyViewed) {
    const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    displayProducts = displayProducts.filter(product => recentlyViewedIds.includes(product._id))
  }

  if (limit) {
    displayProducts = displayProducts.slice(0, limit)
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {displayProducts.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      ))}
    </div>
  )
} 