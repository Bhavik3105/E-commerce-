"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";
import { cartItemKey } from "@/lib/utils";

// ─── State ───────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

function computeTotals(items: CartItem[]): Pick<CartState, "totalItems" | "totalPrice"> {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

function buildState(items: CartItem[]): CartState {
  return { items, ...computeTotals(items) };
}

const initialState: CartState = buildState([]);

// ─── Actions ─────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; size: string; colour: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; size: string; colour: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

// ─── Reducer ─────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload;
      const key = cartItemKey(newItem.productId, newItem.size, newItem.colour);

      const existingIndex = state.items.findIndex(
        (item) => cartItemKey(item.productId, item.size, item.colour) === key
      );

      let updatedItems: CartItem[];

      if (existingIndex >= 0) {
        // Duplicate: merge quantity (clamped to maxStock)
        updatedItems = state.items.map((item, index) => {
          if (index !== existingIndex) return item;
          const newQty = Math.min(item.quantity + newItem.quantity, item.maxStock);
          return { ...item, quantity: newQty };
        });
      } else {
        updatedItems = [...state.items, newItem];
      }

      return buildState(updatedItems);
    }

    case "REMOVE_ITEM": {
      const { productId, size, colour } = action.payload;
      const key = cartItemKey(productId, size, colour);
      const updatedItems = state.items.filter(
        (item) => cartItemKey(item.productId, item.size, item.colour) !== key
      );
      return buildState(updatedItems);
    }

    case "UPDATE_QUANTITY": {
      const { productId, size, colour, quantity } = action.payload;
      const key = cartItemKey(productId, size, colour);

      if (quantity <= 0) {
        const updatedItems = state.items.filter(
          (item) => cartItemKey(item.productId, item.size, item.colour) !== key
        );
        return buildState(updatedItems);
      }

      const updatedItems = state.items.map((item) => {
        if (cartItemKey(item.productId, item.size, item.colour) !== key) return item;
        const clampedQty = Math.min(quantity, item.maxStock);
        return { ...item, quantity: clampedQty };
      });

      return buildState(updatedItems);
    }

    case "CLEAR_CART": {
      return buildState([]);
    }

    case "LOAD_CART": {
      return buildState(action.payload);
    }

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  ready: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, colour: string) => void;
  updateQuantity: (productId: string, size: string, colour: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Storage helpers ─────────────────────────────────────────────

const STORAGE_KEY = "jummip-cart";

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silently fail if storage is full
  }
}

// ─── Provider ────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [ready, setReady] = useState(false);

  // Load the saved cart before any write. Writing the empty first render
  // would wipe a cart that was already in storage.
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      dispatch({ type: "LOAD_CART", payload: savedItems });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveCartToStorage(state.items);
  }, [ready, state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (productId: string, size: string, colour: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size, colour } });
  };

  const updateQuantity = (productId: string, size: string, colour: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, colour, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value: CartContextValue = {
    ...state,
    ready,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
