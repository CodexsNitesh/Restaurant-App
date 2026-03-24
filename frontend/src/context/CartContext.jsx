import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // [{ item, quantity }]

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.item._id === item._id);
      if (exists) return prev.map((c) => c.item._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.item._id === itemId);
      if (exists?.quantity === 1) return prev.filter((c) => c.item._id !== itemId);
      return prev.map((c) => c.item._id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);