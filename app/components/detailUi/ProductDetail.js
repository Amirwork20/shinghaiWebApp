"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Heart, Share2, ChevronDown, X, Loader2, Copy, Check } from 'lucide-react'
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
import SizeGuideModal from './SizeGuideModal'

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
  const [showCartModal, setShowCartModal] = useState(false)
  const [autoSlide, setAutoSlide] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
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

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareViaWhatsApp = () => {
    const text = `Check out ${product.title}: `;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, '_blank');
  };

  const shareViaFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareViaInstagram = () => {
    // Instagram doesn't have a direct sharing API, so we just inform the user
    alert("Instagram doesn't support direct sharing. Please copy the link and share it manually on Instagram.");
    copyToClipboard();
  };

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
              <Button variant="ghost" size="icon" onClick={handleShareClick} aria-label="Share product">
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
              <div className="flex items-center gap-2 mb-4">
                {product.size_guide_id && (
                  <button 
                    onClick={() => setShowSizeGuide(true)} 
                    className="w-full text-sm font-medium bg-indigo-100 text-indigo-800 px-4 py-2.5 rounded-md flex items-center justify-center hover:bg-indigo-200 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    View Size Guide
                  </button>
                )}
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
    <SizeGuideModal 
      isOpen={showSizeGuide} 
      onClose={() => setShowSizeGuide(false)} 
      sizeGuide={product.size_guide_id}
    />

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

    {/* Share Modal */}
    <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
      <DialogContent className="max-w-xs bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-black mb-4">
            Share
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center gap-6 mb-4">
          <button 
            onClick={shareViaWhatsApp}
            className="p-3 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" className="text-green-600">
              <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
          
          <button 
            onClick={shareViaFacebook}
            className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            aria-label="Share on Facebook"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" className="text-blue-600">
              <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="h-7 w-7 text-green-600" />
            ) : (
              <Copy className="h-7 w-7 text-gray-600" />
            )}
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          {copied ? "Link copied to clipboard!" : "Click to copy product link"}
        </p>
      </DialogContent>  
    </Dialog>
    </>
  )
}

