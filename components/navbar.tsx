"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, User, ShoppingCart, Menu, X, ChevronDown, Gift, HelpCircle, Shield, LayoutDashboard, LogOut as LogOutIcon } from "lucide-react"
import LocationModal from "@/components/location-modal"
import Link from "next/link"
import Image from "next/image"
import { useAppContext } from "@/components/app-provider"
import { useAppSelector, useAppDispatch } from "../lib/store"
import { logout } from "../lib/slices/authSlice"
import toast from "react-hot-toast"
import SearchBar from "@/components/search-bar"
import CartDrawer from "@/components/cart-drawer"

export default function Navbar() {
  const {
    setIsLoginOpen,
    cartItems,
    searchQuery,
    setSearchQuery,
    handleLogout,
  } = useAppContext();

  const user = useAppSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const dispatch = useAppDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({
    name: "New Delhi",
    address: "124, Sachivalaya Vihar, Kalyanpuri, New Delhi",
    deliveryTime: "8-12 mins",
  })

  const suggestions = ["vegetables", "fruits", "milk", "bread", "eggs", "chicken"]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAccountDropdown && !(event.target as HTMLElement).closest(".account-dropdown")) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showAccountDropdown])

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(location)
  }

  // Calculate cart item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoutRedux = () => {
    dispatch(logout());
    toast.success("Logged Out, Successfully!")
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/logo.png"
                    alt="BazarXpress"
                    width={100}
                    height={60}
                    className="mt-5"
                  />
                </Link>
              </div>

              {/* Location Selector */}
              <div className="hidden sm:block">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer border-r border-gray-200 pr-4 py-2 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        Delivery in {currentLocation.deliveryTime}
                      </span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600 truncate max-w-48">
                        {currentLocation.address.split(",")[0]}...
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 relative">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Account Section */}
              {isLoggedIn ? (
                <div className="relative account-dropdown">
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    <User size={20} />
                    <span>Account</span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Account Dropdown */}
                  {showAccountDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <a
                            href="/account"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <User size={16} />
                            <span>My Account</span>
                          </a>
                          <a
                            href="/orders"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <ShoppingCart size={16} />
                            <span>My Orders</span>
                          </a>
                          <a
                            href="/addresses"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <MapPin size={16} />
                            <span>Saved Addresses</span>
                          </a>
                          <a
                            href="/gift-cards"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <Gift size={16} className="text-yellow-500" />
                            <span>E-Gift Cards</span>
                          </a>
                          <a
                            href="/faq"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <HelpCircle size={16} className="text-blue-500" />
                            <span>FAQ's</span>
                          </a>
                          <a
                            href="/privacy"
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <Shield size={16} className="text-gray-500" />
                            <span>Account Privacy</span>
                          </a>
                          {user?.role === "admin" && (
                            <a
                              href="/admin"
                              className="flex items-center space-x-3 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold"
                            >
                              <LayoutDashboard size={16} className="text-indigo-500" />
                              <span>Admin Panel</span>
                            </a>
                          )}
                          <button
                            onClick={handleLogoutRedux}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <LogOutIcon size={16} className="text-red-500" />
                            <span>Log Out</span>
                          </button>
                        </div>


                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <User size={20} />
                  <span>Login</span>
                </button>
              )}
              {/* Cart Button */}
              <button
                onClick={() => cartItemCount > 0 && setIsCartOpen(true)}
                className={`relative p-2 rounded-lg transition ${cartItemCount === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 bg-green-50 hover:bg-green-100'}`}
                aria-label="Shopping cart"
                disabled={cartItemCount === 0}
                aria-disabled={cartItemCount === 0}
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile Location */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full flex items-center space-x-2 text-gray-600 py-2 text-left"
              >
                <MapPin size={20} />
                <div>
                  <p className="text-sm font-medium">Delivery in {currentLocation.deliveryTime}</p>
                  <p className="text-xs text-gray-500">{currentLocation.address.split(",")[0]}</p>
                </div>
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                >
                  <User size={20} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer rendered globally */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation.address}
      />
    </>
  )
}
