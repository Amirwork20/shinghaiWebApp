"use client"

import Link from "next/link"
import Image from "next/image" 
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { useCategory } from "../../context/CategoryContext"
import { useCart } from "../../context/CartContext"
import { useState, useEffect } from "react"
import { Input } from "../ui/input"

export default function Navbar() {
  const { handleCategoryChange, handleClearCategories, handleSearch } = useCategory()
  const { cartItems } = useCart()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/category-hierarchy`)
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (type, id, name, e) => {
    e.preventDefault()
    handleCategoryChange(type, id, name)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchTerm)
    setIsSearchOpen(false)
    setSearchTerm("")
  }

  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container flex h-14 items-center">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 text-black hover:bg-red-700">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black [&>button]:text-white">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-lg text-white font-medium"
                onClick={(e) => {
                  setIsMenuOpen(false)
                }}
              >
                Home
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => {
                  e.preventDefault();
                  handleClearCategories();
                  // Navigate programmatically after clearing categories
                  window.location.href = "/collections";
                }}
                className="text-lg text-white font-medium"
              >
                All Products
              </Link>
              
              {/* Dynamic Categories from API */}
              {!isLoading && categories.map((category) => (
                <Link 
                  key={category._id}
                  href="/collections"
                  onClick={(e) => handleCategoryClick('main-category', category._id, category.category_name, e)}
                  className="text-lg text-white font-medium"
                >
                  {category.category_name}
                </Link>
              ))}
              
              {/* Static navigation items */}
              <Link href="/about-us" className="text-lg text-white font-medium">
                About
              </Link>
              <Link href="/contact-us" className="text-lg text-white font-medium">
                Contact
              </Link>
              {/* <Link href="/track-order" className="text-lg text-white font-medium">
                Track Order
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-auto">
          <img 
            src="/Shinghai Brand Assets/PNG Assets-Shinghai Official-01.png" 
            alt="Shinghai Logo"
            width={120} 
            height={40}
            className="object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden text-black hover:bg-red-700 md:flex"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            SEARCH
          </Button>
          {/* <div className="hidden h-4 w-px bg-red-400 md:block" /> */}
          {/*  <Button variant="ghost" size="sm" className="hidden text-black hover:bg-red-700 md:flex">
            TRACK ORDER
          </Button>*/}
          <div className="hidden h-4 w-px bg-red-400 md:block" />
          <Link href="/add-to-cart">
            <Button variant="ghost" size="sm" className="text-black hover:bg-red-700">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">SHOPPING BAG ({cartItems.length})</span>
            </Button>
          </Link>
        </nav>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Search Products</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 pr-4 py-2 w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Search className="w-4 h-4 absolute left-2 top-3 text-gray-500" />
              <Button 
                type="submit" 
                className="w-full mt-4 bg-[#002a2a] hover:bg-[#003a3a] text-white"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

