import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner"; // Using the installed sonner library

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("nova-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart data");
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("nova-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, size?: string, color?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success("Updated quantity in cart");
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Added to cart");
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info("Removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};