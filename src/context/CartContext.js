import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

 const addToCart = (product) => {
  setCart((prev) => {
    const existing = prev.find((item) => item.masp === product.masp);

    if (existing) {
      // Tăng số lượng nếu sản phẩm đã có
      return prev.map((item) =>
        item.masp === product.masp
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    const gia =
      parseFloat(product.giamoi ?? product.gia ?? 0); // Ưu tiên giamoi, fallback về gia
    const newProduct = {
      ...product,
      gia,
      quantity: 1,
    };

    return [...prev, newProduct];
  });
};

  const removeFromCart = (masp) => {
    setCart((prev) => prev.filter((item) => item.masp !== masp));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart,setCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
