import Link from "next/link"
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter, FaShippingFast, FaExchangeAlt, FaQuestionCircle, FaInfoCircle, FaUsers, FaEnvelope, FaFileContract, FaUserShield } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-16 border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-12 sm:gap-24">
          <div className="text-center sm:text-start">
            <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">CUSTOMER CARE</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping-handling" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaShippingFast className="text-lg" />
                  <span>SHIPPING & HANDLING</span>
                </Link>
              </li>
              <li>
                <Link href="/exchange-policy" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaExchangeAlt className="text-lg" />
                  <span>RETURNS & EXCHANGES</span>
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaQuestionCircle className="text-lg" />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-start">
            <h3 className="font-bold mb-4 sm:mb-6 text-base sm:text-lg">INFORMATION</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaUsers className="text-lg" />
                  <span>ABOUT US</span>
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaEnvelope className="text-lg" />
                  <span>CONTACT US</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaFileContract className="text-lg" />
                  <span>TERMS OF SERVICE</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-pink-600 transition-colors flex items-center justify-center sm:justify-start gap-2">
                  <FaUserShield className="text-lg" />
                  <span>PRIVACY POLICY</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center border-t border-gray-200 pt-6 sm:pt-8">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="#" className="text-2xl hover:text-pink-600 transition-colors">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-2xl hover:text-pink-600 transition-colors">
              <FaFacebookF />
            </Link>
            <Link href="#" className="text-2xl hover:text-pink-600 transition-colors">
              <FaPinterestP />
            </Link>
            <Link href="#" className="text-2xl hover:text-pink-600 transition-colors">
              <FaTwitter />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025, Shinghai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 