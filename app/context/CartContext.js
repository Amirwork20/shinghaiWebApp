'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity, selectedSize) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product._id && item.size === selectedSize
      )

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product._id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, {
        id: product._id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        size: selectedSize,
        quantity: quantity,
        sku: product.sku
      }]
    })
  }

  const removeFromCart = (id, size) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.size === size))
    )
  }

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}