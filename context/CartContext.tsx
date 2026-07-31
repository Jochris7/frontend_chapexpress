'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'chapexpress-cart';

const isSameLine = (item: CartItem, productId: string, size?: string) =>
  item.product.id === productId && item.size === size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Reading localStorage (an external system) is exactly what this effect
        // synchronizes with; it can only happen client-side, after mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = (product: Product, quantity = 1, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => isSameLine(item, product.id, size));
      if (existing) {
        return prev.map((item) =>
          isSameLine(item, product.id, size)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity, size }];
    });
  };

  const removeItem = (productId: string, size?: string) => {
    setItems((prev) => prev.filter((item) => !isSameLine(item, productId, size)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    setItems((prev) =>
      prev.map((item) => (isSameLine(item, productId, size) ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
