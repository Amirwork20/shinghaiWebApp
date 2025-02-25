"use client"
import Link from "next/link"
import { Input } from "../ui/input"
import { Phone, Search, ShoppingCart, User } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { NavMenu } from "./NavMenu"
import { useCategory } from "../../context/CategoryContext"
import { useFilter } from "../../context/FilterContext"
import { useState, useEffect, useRef } from "react"

interface Product {
  _id: string
  title: string
  price: number
  image_url: string
}

export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { handleSearch, handleClearCategories } = useCategory()
  const { resetFilters } = useFilter()

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/recommended-products?search=${searchTerm}`)
        const data = await response.json()
        if (data.success) {
          setSearchResults(data.data.products)
        }
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchSearchResults()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleClearCategories()
    resetFilters()
    handleSearch("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <Link href="https://wa.me/yourwhatsapp" className="text-green-600 hover:scale-110 transition-transform">
              <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="tel:yourphone" className="text-gray-600 hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div className="relative" ref={dropdownRef}>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleSearch(searchTerm)
                setShowDropdown(false)
              }}>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 pr-4 py-1 w-[200px] lg:w-[300px] transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowDropdown(true)
                  }}
                />
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              </form>

              {/* Search Preview Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-black text-white rounded-lg shadow-xl p-4">
                  <h3 className="text-lg font-medium mb-4">PRODUCTS</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        href={`/details/${product._id}`}
                        className="flex items-center gap-4 hover:bg-gray-800 p-2 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div>
                          <h4 className="text-white text-sm">{product.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* "Search for" footer */}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <Link 
                      href="/collections"
                      onClick={() => {
                        handleSearch(searchTerm)
                        setShowDropdown(false)
                      }}
                      className="flex items-center justify-between text-white hover:text-gray-300"
                    >
                      <span>Search for "{searchTerm}"</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Link 
            href="/collections" 
            onClick={handleLogoClick}
            className="text-2xl font-bold order-first sm:order-none transition-transform hover:scale-105 flex items-center justify-center"
          >
            <img 
              src="/bfsadas-removebg-preview.png"
              alt="Limelight Logo"
              className="h-[50px] sm:h-[60px] md:h-[80px] w-[150px] sm:w-[180px] md:w-[240px] object-contain"
            />
          </Link>
          <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-end">
            <Link href="/account" className="hover:scale-110 transition-transform">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="/add-to-cart" className="hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
        <div className="sm:hidden pb-2">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4 py-1.5 w-full rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
          </form>
        </div>
        <NavMenu />
      </div>
    </header>
  )
} 