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
  const deliveryCharges = cartItems.reduce((sum, item) => sum + (item.delivery_charges * item.quantity), 0)
  const total = subtotal + deliveryCharges

  // Helper function to generate a unique key for each cart item
  const getItemKey = (item) => {
    const attributesKey = item.attributes ? Object.entries(item.attributes)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${value}`)
      .join('-') : '';
    
    return `${item.id}-${attributesKey}`;
  };

  // Function to render attributes in a readable format
  const renderAttributes = (item) => {
    if (!item.attributes || Object.keys(item.attributes).length === 0) {
      return null;
    }

    if (item.attributeLabels) {
      return (
        <div className="space-y-1">
          {Object.values(item.attributeLabels).map((attr, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {attr.name}: {attr.value}
            </p>
          ))}
        </div>
      );
    }

    // Fallback if attributeLabels is not available
    return (
      <div className="space-y-1">
        {Object.entries(item.attributes).map(([key, value], index) => (
          <p key={index} className="text-sm text-muted-foreground">
            Attribute: {value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
    <TopBanner/>
    <Header/>
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          {cartItems.map(item => (
            <div key={getItemKey(item)} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
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
                    {renderAttributes(item)}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. {item.price.toLocaleString()}</p>
                    {item.delivery_charges > 0 && (
                      <p className="text-xs text-muted-foreground">
                        +Rs. {item.delivery_charges} delivery charges
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.attributes, item.quantity - 1)}
                      className="px-3 py-1 border-r hover:bg-muted"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.attributes, item.quantity + 1)}
                      className="px-3 py-1 border-l hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.attributes)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between pt-2">
                  <p className="font-medium">Item Total</p>
                  <p className="font-medium">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                    {item.delivery_charges > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (includes Rs. {(item.delivery_charges * item.quantity).toLocaleString()} delivery)
                      </span>
                    )}
                  </p>
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
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Delivery Charges</p>
              <p className="text-sm font-medium">
                {deliveryCharges > 0 
                  ? `Rs. ${deliveryCharges.toLocaleString()}`
                  : 'Free'}
              </p>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">Rs. {total.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/collections">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
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

