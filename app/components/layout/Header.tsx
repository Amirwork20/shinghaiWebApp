"use client"
import Link from "next/link"
import { Input } from "../ui/input"
import { Phone, Search, ShoppingCart, User } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { NavMenu } from "./NavMenu"
import { useCategory } from "../../context/CategoryContext"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const { handleSearch } = useCategory()
  const pathname = usePathname()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchTerm)
  }

  // Function to store the current location before navigating to account
  const storeCurrentLocation = () => {
    // Don't store the location if already on the account page
    if (pathname !== '/account') {
      localStorage.setItem('previousLocation', pathname)
    }
  }

  return (
    <header>
      {/* Top Bar with 3 sections - Black background */}
      <div className="bg-[#002a2a] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Left Section: WhatsApp, Phone & Search */}
            <div className="flex items-center gap-3 w-1/3 justify-start">
              <Link href="https://wa.me/923362164396" className="text-green-500 hover:text-green-400 transition-transform hover:scale-110">
                <FaWhatsapp className="w-6 h-6" />
              </Link>
              {/* <div className="h-6 flex items-center">
                <a href="tel:+923362164396" className="text-white hover:text-gray-300">
                  <Phone className="w-5 h-5" />
                </a>
              </div> */}

              {/* Desktop Search Input */}
              <div className="hidden md:block relative ml-2">
                <form onSubmit={handleSubmit} className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 pr-4 py-1 w-[180px] lg:w-[220px] bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-500" />
                </form>
              </div>
            </div>

            {/* Center Section: Logo */}
            <div className="flex items-center justify-center w-1/3">
              <Link 
                href="/collections" 
                className="transition-transform hover:scale-105 flex items-center justify-center"
              >
                <img 
                  src="/Shinghai Brand Assets/PNG Assets-Shinghai Official-02.png"
                  alt="Shinghai Logo"
                  className="h-[30px] sm:h-[35px] md:h-[40px] w-auto object-contain"
                />
              </Link>
            </div>

            {/* Right Section: Shipping, Account & Cart */}
            <div className="flex items-center gap-4 w-1/3 justify-end">
              <div className="flex items-center">
                <Link 
                  href="/account" 
                  className="text-white hover:text-gray-300 transition-transform hover:scale-110"
                  onClick={storeCurrentLocation}
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="/add-to-cart" className="text-white hover:text-gray-300 transition-transform hover:scale-110">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-2">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 pr-4 py-1.5 w-full rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-500" />
            </form>
          </div>
        </div>
      </div>

      {/* Navigation - White background */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <NavMenu />
        </div>
      </div>
    </header>
  )
} 