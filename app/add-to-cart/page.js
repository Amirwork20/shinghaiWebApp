'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import TopBanner from '../components/layout/TopBanner'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div>
    <TopBanner/>
    <Header/>
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          {cartItems.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
              <div className="w-full sm:w-48 h-48 relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  </div>
                  <p className="font-medium">Rs. {item.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="px-3 py-1 border-r hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="px-3 py-1 border-l hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between pt-2">
                  <p className="font-medium">Item Total</p>
                  <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Order Notes</p>
            <Textarea 
              placeholder="PLEASE LEAVE SPECIAL INSTRUCTIONS ABOVE"
              className="min-h-[100px] w-full"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Subtotal</p>
              <p className="text-lg font-medium">Rs. {subtotal.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
              <Link href="/payment">
              <Button className="w-full bg-black text-white hover:bg-black/90">
                Checkout
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

