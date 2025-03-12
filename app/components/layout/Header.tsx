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
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <Link href="https://wa.me/923362164396" className="text-green-600 hover:scale-110 transition-transform">
              <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            {/* <Link href="tel:yourphone" className="text-gray-600 hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link> */}
            <form onSubmit={handleSubmit} className="relative hidden sm:block">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 pr-4 py-1 w-[200px] lg:w-[300px] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
            </form>
          </div>
          <Link 
            href="/collections" 
            className="text-2xl font-bold order-first sm:order-none transition-transform hover:scale-105 flex items-center justify-center"
          >
            <img 
              src="/1d4da0a1-d803-4c60-b33f-9adb3ca2bfbc.jpg"
              alt="Limelight Logo"
              className="h-[50px] sm:h-[60px] md:h-[80px] w-[150px] sm:w-[180px] md:w-[240px] object-contain"
            />
          </Link>
          <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-end">
            <Link 
              href="/account" 
              className="hover:scale-110 transition-transform"
              onClick={storeCurrentLocation}
            >
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