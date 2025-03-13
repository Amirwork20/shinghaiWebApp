"use client"

import Link from "next/link"
import Image from "next/image" 
import { Menu, Search, ShoppingBag } from 'lucide-react'
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { useCategory } from "../../context/CategoryContext"
import { useCart } from "../../context/CartContext"

export default function Navbar() {
  const { handleCategoryChange } = useCategory()
  const { cartItems } = useCart()

  const handleCategoryClick = (type, value, e) => {
    e.preventDefault()
    handleCategoryChange(type, value)
  }

  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 text-black hover:bg-red-700">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-lg text-black font-medium"
              >
                Home
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => handleCategoryClick('main-category', 'all', e)}
                className="text-lg text-black font-medium"
              >
                All Products
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => handleCategoryClick('main-category', 'men', e)}
                className="text-lg text-black font-medium"
              >
                Men
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => handleCategoryClick('main-category', 'women', e)}
                className="text-lg text-black font-medium"
              >
                Women
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => handleCategoryClick('main-category', 'new-arrivals', e)}
                className="text-lg text-black font-medium"
              >
                New Arrivals
              </Link>
              <Link 
                href="/collections"
                onClick={(e) => handleCategoryClick('main-category', 'sale', e)}
                className="text-lg text-black font-medium"
              >
                Sale
              </Link>
              <Link href="/about" className="text-lg text-black font-medium">
                About
              </Link>
              <Link href="/contact" className="text-lg text-black font-medium">
                Contact
              </Link>
              <Link href="/track-order" className="text-lg text-black font-medium">
                Track Order
              </Link>
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
          <Button variant="ghost" size="sm" className="hidden text-black hover:bg-red-700 md:flex">
            <Search className="mr-2 h-4 w-4" />
            SEARCH
          </Button>
          <div className="hidden h-4 w-px bg-red-400 md:block" />
          <Button variant="ghost" size="sm" className="hidden text-black hover:bg-red-700 md:flex">
            TRACK ORDER
          </Button>
          <div className="hidden h-4 w-px bg-red-400 md:block" />
          <Link href="/add-to-cart">
            <Button variant="ghost" size="sm" className="text-black hover:bg-red-700">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">SHOPPING BAG ({cartItems.length})</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

