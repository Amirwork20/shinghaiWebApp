"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity, selectedAttributes) => {
    setCartItems((prevItems) => {
      // Helper function to check if attributes match
      const attributesMatch = (itemAttrs, newAttrs) => {
        if (!itemAttrs && !newAttrs) return true;
        if (!itemAttrs || !newAttrs) return false;
        
        const itemKeys = Object.keys(itemAttrs);
        const newKeys = Object.keys(newAttrs);
        
        if (itemKeys.length !== newKeys.length) return false;
        
        return itemKeys.every(key => itemAttrs[key] === newAttrs[key]);
      };

      const existingItem = prevItems.find(
        (item) => item.id === product._id && attributesMatch(item.attributes, selectedAttributes)
      );

      if (existingItem) {
        // Check if the new total quantity would exceed available stock
        const newQuantity = existingItem.quantity + quantity;
        const maxAllowed = Math.min(
          product.quantity,
          product.max_quantity_per_user || product.quantity
        );
        
        if (newQuantity > maxAllowed) {
          alert(`Sorry, you can only have a maximum of ${maxAllowed} of this item in your cart.`);
          return prevItems;
        }
        
        return prevItems.map((item) =>
          item.id === product._id && attributesMatch(item.attributes, selectedAttributes)
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          id: product._id,
          title: product.title,
          price: product.price,
          delivery_charges: product.delivery_charges || 0,
          image_url: product.image_url,
          attributes: selectedAttributes,
          quantity: quantity,
          sku: product.sku,
          // Store available stock information
          available_quantity: product.quantity,
          max_quantity_per_user: product.max_quantity_per_user,
          attributeLabels: product.attributes?.reduce((acc, attr) => {
            if (selectedAttributes[attr.attribute_id]) {
              acc[attr.attribute_id] = {
                name: attr.attribute_name || 'Attribute',
                value: selectedAttributes[attr.attribute_id]
              };
            }
            return acc;
          }, {})
        },
      ];
    });
  };

  const removeFromCart = (id, attributes) => {
    setCartItems((prevItems) => {
      // Helper function to check if attributes match
      const attributesMatch = (itemAttrs, targetAttrs) => {
        if (!itemAttrs && !targetAttrs) return true;
        if (!itemAttrs || !targetAttrs) return false;
        
        const itemKeys = Object.keys(itemAttrs);
        const targetKeys = Object.keys(targetAttrs);
        
        if (itemKeys.length !== targetKeys.length) return false;
        
        return itemKeys.every(key => itemAttrs[key] === targetAttrs[key]);
      };

      return prevItems.filter(
        (item) => !(item.id === id && attributesMatch(item.attributes, attributes))
      );
    });
  };

  const updateQuantity = (id, attributes, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems((prevItems) => {
      // Helper function to check if attributes match
      const attributesMatch = (itemAttrs, targetAttrs) => {
        if (!itemAttrs && !targetAttrs) return true;
        if (!itemAttrs || !targetAttrs) return false;
        
        const itemKeys = Object.keys(itemAttrs);
        const targetKeys = Object.keys(targetAttrs);
        
        if (itemKeys.length !== targetKeys.length) return false;
        
        return itemKeys.every(key => itemAttrs[key] === targetAttrs[key]);
      };

      // Find the item to check its available quantity
      const itemToUpdate = prevItems.find(
        item => item.id === id && attributesMatch(item.attributes, attributes)
      );
      
      if (itemToUpdate) {
        // Get the max allowed quantity (either from stored values or default to current quantity)
        const availableQuantity = itemToUpdate.available_quantity || itemToUpdate.quantity;
        const maxPerUser = itemToUpdate.max_quantity_per_user || availableQuantity;
        const maxAllowed = Math.min(availableQuantity, maxPerUser);
        
        // If trying to exceed the limit, show alert and don't update
        if (newQuantity > maxAllowed) {
          alert(`Sorry, you cannot add more than ${maxAllowed} of this item to your cart.`);
          return prevItems;
        }
      }

      return prevItems.map((item) =>
        item.id === id && attributesMatch(item.attributes, attributes)
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          updateQuantity,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    </Suspense>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
