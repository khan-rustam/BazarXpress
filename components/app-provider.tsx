"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, persistor, RootState } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { logout as reduxLogout } from "../lib/slices/authSlice";
import { getCartItems, setCartItems as persistCartItems } from "../lib/cart";

interface AppContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoggedIn: boolean;
  user: any;
  addToCart: (product: any) => void;
  updateCartItem: (id: any, quantity: number) => void;
  cartTotal: number;
  handleLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProviderInner({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cartItems, setCartItemsState] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!reduxUser;
  const dispatch = useDispatch();

  // Load cart from localStorage on mount
  useEffect(() => {
    setCartItemsState(getCartItems());
    const sync = () => setCartItemsState(getCartItems());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Always update localStorage and state
  const setCartItems = (items: any[]) => {
    persistCartItems(items);
    setCartItemsState(items);
  };

  const addToCart = (product: any) => {
    const items = getCartItems();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    setCartItems(items);
  };

  const updateCartItem = (id: any, quantity: number) => {
    const items = getCartItems();
    const item = items.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        setCartItems(items.filter((item) => item.id !== id));
        return;
      }
      setCartItems(items);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const handleLogout = () => {
    dispatch(reduxLogout());
  };

  return (
    <AppContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        isLoginOpen,
        setIsLoginOpen,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        isLoggedIn,
        user: reduxUser,
        addToCart,
        updateCartItem,
        cartTotal,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProviderInner>{children}</AppProviderInner>
      </PersistGate>
    </Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
} 