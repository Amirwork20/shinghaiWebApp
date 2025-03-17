'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useCategory } from '../context/CategoryContext'
import ProductCard from "./ProductCard"
import { useFilter } from '../context/FilterContext'
import { Loader2 } from 'lucide-react'

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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const { activeCategory } = useCategory()
  const { sortBy, season, priceRange, fabric } = useFilter()
  const PAGE_SIZE = 12 // Number of products to load per batch

  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore])

  const fetchProducts = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true)
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
      
      // Add pagination params
      params.append('page', pageNum.toString())
      params.append('limit', PAGE_SIZE.toString())
      
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
        if (fabric && fabric !== 'all') {
          filteredProducts = filteredProducts.filter(product => 
            product.fabric_id === fabric || 
            product.fabric?._id === fabric
          )
        }

        // Apply client-side season filtering
        if (season && season !== 'all') {
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

        if (pageNum === 1) {
          setProducts(filteredProducts)
        } else {
          setProducts(prev => [...prev, ...filteredProducts])
        }
        
        // If we got fewer products than the page size, we've reached the end
        setHasMore(filteredProducts.length === PAGE_SIZE)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory, sortBy, season, priceRange, fabric])

  useEffect(() => {
    // Reset to page 1 when filters or category changes
    setPage(1)
    setProducts([])
    setHasMore(true)
    fetchProducts(1)
  }, [activeCategory, sortBy, season, priceRange, fabric, fetchProducts])

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page)
    }
  }, [page, fetchProducts])

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
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product, index) => {
          if (displayProducts.length === index + 1 && !limit && !recentlyViewed) {
            return (
              <div key={product._id} ref={lastProductRef}>
                <ProductCard
                  product={product}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </div>
            )
          } else {
            return (
              <ProductCard
                key={product._id}
                product={product}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            )
          }
        })}
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      
      {!isLoading && displayProducts.length === 0 && (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
      
      {!isLoading && !hasMore && displayProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the collection</p>
        </div>
      )}
    </>
  )
} 