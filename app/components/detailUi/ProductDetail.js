"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Heart, Share2, ChevronDown, X, Loader2 } from 'lucide-react'
import { Button } from "../../components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { useParams } from "next/navigation"
import { useCart } from '../../context/CartContext'
import Link from 'next/link'

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const imageRef = useRef(null)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [measurementUnit, setMeasurementUnit] = useState('IN') // 'IN' or 'CM'
  const [showCartModal, setShowCartModal] = useState(false)
  const [autoSlide, setAutoSlide] = useState(true)
  const { addToCart, cartItems } = useCart()

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/product/${params?.id}`)
      const data = await response.json()
      if (data.success) {
        setProduct(data.data)
        // Preload critical images
        const img = new Image()
        img.src = data.data.image_url
        img.onload = () => setImagesLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }, [params?.id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  // Add auto-sliding functionality - but only when not interacting with images
  useEffect(() => {
    if (!product || !autoSlide || showMagnifier) return
    
    const images = [product.image_url, ...(product.tabs_image_url || [])]
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [product, showMagnifier, autoSlide])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-gray-700 text-xl">Product not found</p>
          <Link href="/collections" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse our collections
          </Link>
        </div>
      </div>
    )
  }

  const images = [
    product.image_url,
    ...(product.tabs_image_url || [])
  ]

  const handleAddToCart = () => {
    // Check if there are attributes and if all have been selected
    const hasAttributes = product.attributes && product.attributes.length > 0;
    const sizeAttribute = product.attributes?.find(attr => 
      attr.attribute_name?.toLowerCase() === 'size' || 
      attr.en_attribute_name?.toLowerCase() === 'size'
    );
    
    // If there's a size attribute but no selection made, show alert
    if (sizeAttribute && !selectedAttributes[sizeAttribute.attribute_id]) {
      alert('Please select a size');
      return;
    }

    addToCart(product, quantity, selectedAttributes);
    setShowCartModal(true);
  };

  const handleImageNavigation = (direction) => {
    setAutoSlide(false)
    if (direction === 'prev') {
      setSelectedImage(prev => (prev > 0 ? prev - 1 : images.length - 1))
    } else {
      setSelectedImage(prev => (prev < images.length - 1 ? prev + 1 : 0))
    }
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Section */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          {/* Main Image Slider */}
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
            {!imagesLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            <button 
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
              onClick={() => handleImageNavigation('prev')}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div
              ref={imageRef}
              className="h-full w-full relative overflow-hidden"
              onMouseEnter={() => {
                setShowMagnifier(true)
                setAutoSlide(false)
              }}
              onMouseLeave={() => {
                setShowMagnifier(false)
                if (imageRef.current) {
                  imageRef.current.style.transform = 'scale(1)'
                  imageRef.current.style.transformOrigin = 'center'
                }
                setAutoSlide(true)
              }}
              onMouseMove={(e) => {
                if (!showMagnifier || !imageRef.current) return
                const rect = imageRef.current.getBoundingClientRect()
                const x = ((e.pageX - rect.left) / rect.width) * 100
                const y = ((e.pageY - rect.top) / rect.height) * 100
                imageRef.current.style.transformOrigin = `${x}% ${y}%`
                imageRef.current.style.transform = 'scale(2)'
              }}
              style={{
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: showMagnifier ? 'transform 0.1s ease-out' : 'none',
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="absolute top-0 left-0 h-full w-full transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `translateX(${(index - selectedImage) * 100}%)`,
                    zIndex: index === selectedImage ? 1 : 0,
                  }}
                />
              ))}
            </div>

            <button 
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
              onClick={() => handleImageNavigation('next')}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setAutoSlide(false)
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedImage === index 
                        ? "bg-white scale-125 shadow-sm" 
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery - Below slider on mobile */}
          <div className="grid grid-cols-4 gap-2 mt-4 lg:hidden">
            {images.map((src, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index)
                  setAutoSlide(false)
                }}
                className={`relative aspect-square border-2 ${
                  selectedImage === index ? "border-red-600" : "border-transparent"
                }`}
              >
                <img
                  src={src}
                  alt={`Product view ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="order-2 lg:order-3 lg:col-span-1">
          <div className="space-y-6">
            {/* Title */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-medium">{product.title}</h1>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Price */}
            <p className="text-xl font-medium">
              Rs. {product.price}
              {product.off_percentage_value > 0 && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  Rs. {product.actual_price}
                </span>
              )}
            </p>

            {/* Delivery Charges */}
            <div className="text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <span>Delivery charges:</span> 
                <span className="font-medium">
                  {product.delivery_charges > 0 
                    ? `Rs. ${product.delivery_charges}`
                    : 'Free delivery'}
                </span>
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSizeGuide(true)} 
                  className="text-sm text-blue-600 underline flex items-center"
                >
                  Size Guide
                  <svg className="w-4 h-4 ml-1 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 4L3 21" />
                    <path d="M15 4H20V9" />
                  </svg>
                </button>
              </div>
              {product.attributes?.map((attribute) => (
                <div key={attribute.attribute_id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{attribute.attribute_name || 'Attribute'}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {attribute.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSelectedAttributes(prev => ({
                            ...prev,
                            [attribute.attribute_id]: value
                          }));
                        }}
                        className={`min-w-[2.5rem] h-10 px-3 rounded-full border text-xs sm:text-sm ${
                          selectedAttributes[attribute.attribute_id] === value 
                            ? 'bg-black text-white border-black' 
                            : 'border-gray-300 hover:border-gray-400'
                        } flex items-center justify-center overflow-hidden`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <p className="font-medium">Quantity</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(prev => Math.min(product.max_quantity_per_user || 10, prev + 1))}
                  disabled={quantity >= (product.max_quantity_per_user || 10)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-zinc-900 text-white hover:bg-zinc-700"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </Button>

            {/* Care Instructions & Disclaimer - Desktop Only */}
            <div className="hidden lg:block space-y-4">
              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left font-medium">
                  Care Instructions
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600">
                  {product.care_instructions || 'No care instructions available'}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left font-medium">
                  Disclaimer
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600">
                  {product.disclaimer || 'No disclaimer available'}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Description Section with Desktop Thumbnails */}
        <div className="order-3 lg:order-1 lg:col-span-1 space-y-4">
          {/* Desktop Thumbnails */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-2 lg:justify-center lg:mb-6">
            {images.map((src, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedImage(index)
                  setAutoSlide(false)
                }}
                className={`relative aspect-square border-2 ${
                  selectedImage === index ? "border-red-600" : "border-transparent"
                }`}
              >
                <img
                  src={src}
                  alt={`Product view ${index + 1}`}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Description Content */}
          <h2 className="text-lg font-semibold">Description</h2>
          <div className="space-y-4 text-sm">
            <p>{product.description || 'No description available'}</p>
            <p>Fabric: {product.fabric?.fabric_name || 'N/A'}</p>
            <p>SKU: {product.sku || 'N/A'}</p>
            <p>Category: {product.category?.category_name || 'N/A'}</p>
          </div>

          {/* Care Instructions & Disclaimer - Mobile Only */}
          <div className="lg:hidden space-y-4">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left font-medium">
                Care Instructions
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 text-sm text-gray-600">
                {product.care_instructions || 'No care instructions available'}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left font-medium">
                Disclaimer
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 text-sm text-gray-600">
                {product.disclaimer || 'No disclaimer available'}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>

    {/* Size Guide Modal */}
    <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
      <DialogContent className="max-w-4xl mx-auto p-6 bg-white">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">Size Guide - A0357ST</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Measurement Toggle */}
          <div className="flex justify-center sm:justify-end border-b border-gray-200">
            <div className="inline-flex rounded-lg p-1 bg-indigo-50">
              <button 
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  measurementUnit === 'CM' 
                    ? 'bg-indigo-600 shadow-sm text-white' 
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                onClick={() => setMeasurementUnit('CM')}
              >
                CM
              </button>
              <button 
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  measurementUnit === 'IN'
                    ? 'bg-indigo-600 shadow-sm text-white'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                onClick={() => setMeasurementUnit('IN')}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Size Table */}
          <div className="overflow-x-auto rounded-lg border border-indigo-100 shadow-sm">
            <table className="w-full min-w-full divide-y divide-indigo-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Measurements</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">XS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">S</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">M</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">L</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-100">
                {[
                  { label: 'Shirt Length (Front)', xs: '40', s: '40', m: '40', l: '40' },
                  { label: 'Shirt Length (Back)', xs: '40', s: '40', m: '40', l: '40' },
                  { label: 'Shoulder', xs: '14', s: '14.5', m: '15', l: '16' },
                  { label: 'Chest', xs: '18', s: '19.5', m: '21.5', l: '23.5' },
                  { label: 'Arm Hole', xs: '9', s: '9.75', m: '10.5', l: '11.25' },
                  { label: 'Bottom', xs: '26', s: '27', m: '29', l: '31' },
                  { label: 'Sleeves Length', xs: '22.5', s: '22.5', m: '22.5', l: '22.5' },
                  { label: 'Sleeves Opening', xs: '4', s: '4', m: '4.5', l: '5' },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                    <td className="px-4 py-3 text-sm text-indigo-600">{measurementUnit === 'CM' ? row.xs : (Number(row.xs) * 0.393701).toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-indigo-600">{measurementUnit === 'CM' ? row.s : (Number(row.s) * 0.393701).toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-indigo-600">{measurementUnit === 'CM' ? row.m : (Number(row.m) * 0.393701).toFixed(1)}</td>
                    <td className="px-4 py-3 text-sm text-indigo-600">{measurementUnit === 'CM' ? row.l : (Number(row.l) * 0.393701).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Cart Modal */}
    <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-black">
            Item Added to Cart
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-6">
          <img 
            src={images[selectedImage]} 
            alt={product.title} 
            className="w-24 h-32 object-cover rounded-md border border-gray-200"
          />
          <div>
            <h4 className="font-medium text-black">{product.title}</h4>
            {Object.entries(selectedAttributes).length > 0 && (
              <div className="text-sm text-black">
                {product.attributes?.map(attr => 
                  selectedAttributes[attr.attribute_id] ? (
                    <p key={attr.attribute_id}>
                      {attr.attribute_name}: {selectedAttributes[attr.attribute_id]}
                    </p>
                  ) : null
                )}
              </div>
            )}
            <p className="text-sm text-black">Quantity: {quantity}</p>
            <p className="font-medium mt-2 text-black">Rs. {product.price.toLocaleString()}</p>
            {product.delivery_charges > 0 && (
              <p className="text-xs text-gray-600">
                +Rs. {product.delivery_charges} delivery charges
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/collections" className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-black text-black hover:bg-gray-100"
            >
              CONTINUE SHOPPING
            </Button>
          </Link>
          <Link href="/add-to-cart" className="w-full">
            <Button className="w-full bg-transparent text-black hover:bg-gray-100 border border-black">
              VIEW CART ({cartItems.length})
            </Button>
          </Link>
        </div>
        <Link href="/payment" className="w-full block mt-4">
          <Button 
            className="w-full bg-transparent text-black hover:bg-gray-100 border border-black"
          >
            CHECKOUT
          </Button>
        </Link>
      </DialogContent>  
    </Dialog>
    </>
  )
}

