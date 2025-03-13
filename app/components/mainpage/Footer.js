import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-12 bg-white">
    <div className="md:py-0 py-6"></div>
      <div className="container px-4 mx-auto">
        {/* Newsletter Section */}
        <div className="mb-6 md:mb-12 text-center">
          <h2 className="mb-3 md:mb-6 text-2xl md:text-3xl font-serif">Shinghai</h2>
          <p className="mb-3 md:mb-4 text-xs md:text-sm">Signup for our newsletter</p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 h-10"
            />
            <Button 
              type="submit"
              variant="outline"
              className="px-3 md:px-4 h-10"
            >
              →
            </Button>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 py-4 md:py-8 border-t lg:grid-cols-4">
          {/* Information Column */}
          <div className="text-sm">
            <h3 className="mb-2 md:mb-4 text-xs md:text-sm font-semibold">INFORMATION</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/exchange-policy">Exchange Policy</Link></li>
              <li><Link href="/shipping-policy">Shipping Policy</Link></li>
              <li><Link href="/international-policy">International Policy</Link></li>
              <li><Link href="/store-locator">Store Locator</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-sm">
            <h3 className="mb-2 md:mb-4 text-xs md:text-sm font-semibold">COMPANY</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/contact-us">Contact Us</Link></li>
              <li><Link href="/look-book">Look Book</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="text-sm text-center">
            <h3 className="mb-2 md:mb-4 text-xs md:text-sm font-semibold">HELP</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm flex flex-col items-center">
              <li className="flex items-center justify-center gap-1 md:gap-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <a href="tel:+923171177300">+92 317 1177300</a>
              </li>
              <li className="flex items-center justify-center gap-1 md:gap-2">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <a href="tel:+923171177300">+92 317 1177300</a>
              </li>
              <li className="flex items-center justify-center gap-1 md:gap-2">
                <Mail className="w-3 h-3 md:w-4 md:h-4" />
                <a href="mailto:customercare@Shinghai.com" className="text-xs md:text-sm whitespace-nowrap">
                  customercare@Shinghai.com
                </a>
              </li>
              <li className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                Mon-Sat, (09:00 AM To 10:00 PM PST)
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="text-sm">
            <h3 className="mb-2 md:mb-4 text-xs md:text-sm font-semibold">CONNECT</h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link href="https://facebook.com">Facebook</Link></li>
              <li><Link href="https://instagram.com">Instagram</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-4 md:pt-8 mt-4 md:mt-8 text-xs md:text-sm text-gray-600 border-t">
          <div className="flex flex-col justify-between gap-2 md:gap-4 md:flex-row">
            <p>© 2025 Shinghai - All Rights Reserved.</p>
            <p>Powered by Commerce by Ginkgo Retail</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

