'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Info } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: '',
    deliveryCity: '',
    orderNotes: ''
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^(\+92|0)?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number'
    }

    // Required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.deliveryCity) newErrors.deliveryCity = 'Please select a delivery city'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please check all required fields and try again.')
      return
    }

    setLoading(true)

    const orderPayload = {
      customer_details: {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        postal_code: formData.postalCode,
        delivery_city: formData.deliveryCity
      },
      order_items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      order_notes: formData.orderNotes,
      subtotal: subtotal,
      payment_method: 'COD'
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        toast.success('Order placed successfully!')
        router.push('/order-success')
      } else {
        toast.error(data.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // If cart is empty, redirect or show message
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <Button onClick={() => window.location.href = '/collections'}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b py-4 sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
            alt="Limelight"
            className="h-8 sm:h-10 w-auto"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <section className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Contact</h2>
                <button className="text-blue-600 text-sm">Log in</button>
              </div>
              <div className="space-y-1">
                <Input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email or mobile phone number"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter">Email me with news and offers</Label>
              </div>
            </section>

            <section className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium">Delivery</h2>
              <Select 
                name="deliveryCity"
                value={formData.deliveryCity}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryCity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city from dropdown" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="lahore">Lahore</SelectItem>
                  <SelectItem value="islamabad">Islamabad</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="pakistan">
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name" 
                  required
                />
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name" 
                />
              </div>

              <Input 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address" 
                required
              />
              <Input 
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Apartment, suite, etc. (optional)" 
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City" 
                />
                <Input 
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal code (optional)" 
                />
              </div>

              <div className="relative">
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                  required
                />
                <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="save-info" />
                <Label htmlFor="save-info">Save this information for next time</Label>
              </div>
            </section>

            <section className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium">Shipping method</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">
                  Enter your shipping address to view available shipping methods.
                </p>
              </div>
            </section>

            <section className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium">Payment method</h2>
              <p className="text-sm text-gray-600">Select your preferred payment method</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="cod" name="payment-method" defaultChecked />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <path d="M12 12h4"/>
                      <circle cx="8" cy="12" r="2"/>
                    </svg>
                  </div>
                </div>

                {/* Commenting out Online Payment Option for now
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="online" name="payment-method" />
                      <Label htmlFor="online">Credit Card / Debit Card</Label>
                    </div>
                    <div className="flex gap-2">
                      <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" alt="Visa" className="w-8 h-5" />
                      <img src="https://images.unsplash.com/photo-1556742111-a301076d9d18" alt="Mastercard" className="w-8 h-5" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 text-center space-y-4">
                    <img 
                      src="https://images.unsplash.com/photo-1556742205-e7530469f4eb?q=80&w=400"
                      alt="Redirect notice" 
                      className="mx-auto w-[200px] h-[100px]"
                    />
                    <p className="text-sm text-gray-600">
                      After clicking "Pay now", you will be redirected to Credit Card / Debit Card to complete your purchase securely.
                    </p>
                  </div>
                </div>
                */}
              </div>
            </section>

            <section className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium">Billing address</h2>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="same-address" name="billing" defaultChecked />
                  <Label htmlFor="same-address">Same as shipping address</Label>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="different-address" name="billing" />
                  <Label htmlFor="different-address">Use a different billing address</Label>
                </div>
              </div>
            </section>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 sm:py-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Order Now'}
            </Button>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-center">
              <a href="#" className="hover:underline">Refund policy</a>
              <a href="#" className="hover:underline">Shipping policy</a>
              <a href="#" className="hover:underline">Privacy policy</a>
              <a href="#" className="hover:underline">Terms of service</a>
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg h-fit sticky top-24 order-first lg:order-last mb-6 lg:mb-0">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="rounded-lg w-16 h-16 object-cover"
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm">{item.title}</h3>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                  </div>
                  <p className="font-medium">Rs {item.price.toLocaleString()}</p>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Input placeholder="Discount code" className="flex-1" />
                  <Button variant="outline" className="sm:w-24">Apply</Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal • {cartItems.length} items</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Shipping
                    <Info className="w-4 h-4 text-gray-400" />
                  </span>
                  <span>—</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2">
                  <span>Total</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">PKR</span>
                    <span> Rs {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

