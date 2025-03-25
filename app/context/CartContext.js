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
        return prevItems.map((item) =>
          item.id === product._id && attributesMatch(item.attributes, selectedAttributes)
            ? { ...item, quantity: item.quantity + quantity }
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
