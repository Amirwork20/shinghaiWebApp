'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. We'll send you an email confirmation with order details and tracking information.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <Link href="/collections">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">
              Continue Shopping
            </Button>
          </Link>
          
          <div className="text-sm text-gray-600">
            Having trouble? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="text-sm text-gray-500">
            Need assistance? Email us at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 