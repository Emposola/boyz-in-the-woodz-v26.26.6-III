/* ============================================================
   CART CONTEXT — Unified cart for both Boyz & Barber businesses
   Persists to localStorage, provides add/remove/update/clear
   ============================================================ */
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  /* --- Load cart from localStorage on mount --- */
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('bitw_cart');
    return saved ? JSON.parse(saved) : [];
  });

  /* --- Persist to localStorage on every change --- */
  useEffect(() => {
    localStorage.setItem('bitw_cart', JSON.stringify(items));
  }, [items]);

  /* --- Add item to cart (with quantity merge) --- */
  const addItem = (product, size = null, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${size || 'one-size'}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key,
        product_id: product.id,
        product_name: product.name,
        business: product.business,
        price: product.price,
        image_url: product.image_url,
        size,
        quantity,
      }];
    });
  };

  /* --- Update item quantity --- */
  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.key !== key));
    } else {
      setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
    }
  };

  /* --- Remove single item --- */
  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  /* --- Clear entire cart --- */
  const clearCart = () => setItems([]);

  /* --- Computed values --- */
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);