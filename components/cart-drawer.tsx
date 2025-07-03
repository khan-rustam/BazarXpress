"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Truck, Info, CreditCard, LogIn } from "lucide-react";
import { getCartItems, updateCartQuantity, removeFromCart, getCartTotals } from "../lib/cart";
import { useAppContext } from "@/components/app-provider";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState(getCartItems());
  const [totals, setTotals] = useState(getCartTotals());
  const { isLoggedIn, setIsLoginOpen } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setItems(getCartItems());
    setTotals(getCartTotals());
    const sync = () => {
      setItems(getCartItems());
      setTotals(getCartTotals());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [isOpen]);

  // Auto-close drawer if cart becomes empty
  useEffect(() => {
    if (isOpen && items.length === 0) {
      onClose();
    }
  }, [items.length, isOpen, onClose]);

  const handleUpdate = (id: string, quantity: number) => {
    updateCartQuantity(id, quantity);
    setItems(getCartItems());
    setTotals(getCartTotals());
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setItems(getCartItems());
    setTotals(getCartTotals());
  };

  const handleProceed = () => {
    if (isLoggedIn) {
      router.push("/payment");
      onClose();
    } else {
      setIsLoginOpen(true);
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full pb-32">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">My Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close cart">
              <X size={28} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">Your cart is empty.</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 shadow-sm">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-contain rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.brand} {item.weight}</div>
                      <div className="text-sm text-gray-700 mt-1">₹{item.price} x {item.quantity}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleUpdate(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button onClick={() => handleUpdate(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-xs text-red-500 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-2xl shadow p-4 m-4 mt-0">
            <div className="font-bold text-lg text-gray-900 mb-4">Bill details</div>
            <div className="flex items-center justify-between mb-2 text-gray-700">
              <span className="flex items-center gap-2"><ShoppingBag size={18} /> Items total</span>
              <span>₹{totals.itemsTotal}</span>
            </div>
            <div className="flex items-center justify-between mb-2 text-gray-700">
              <span className="flex items-center gap-2"><Truck size={18} /> Delivery charge <Info size={14} className="ml-1 text-gray-400" /></span>
              <span className={Number(totals.deliveryCharge) === 0 ? "text-green-600 font-bold" : undefined}>
                {Number(totals.deliveryCharge) > 0 ? `₹${totals.deliveryCharge}` : <><span className="line-through text-gray-400">₹25</span> <span className="text-green-600 font-bold">FREE</span></>}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2 text-gray-700">
              <span className="flex items-center gap-2"><Info size={18} /> Handling charge</span>
              <span>₹{totals.handlingCharge}</span>
            </div>
            <div className="flex items-center justify-between mb-4 text-gray-700">
              <span className="flex items-center gap-2"><CreditCard size={18} /> Tax (5%)</span>
              <span>₹{totals.tax}</span>
            </div>
            <div className="flex items-center justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-3">
              <span>Grand total</span>
              <span>₹{totals.grandTotal}</span>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-green-700 rounded-t-2xl flex items-center justify-between px-6 py-4 z-50">
            <div className="text-white text-lg font-bold">₹{totals.grandTotal}<div className="text-xs font-normal">TOTAL</div></div>
            <button
              className="bg-white text-green-700 font-semibold text-lg px-8 py-3 rounded-lg hover:bg-green-50 transition flex items-center gap-2"
              style={{ minWidth: 180 }}
              onClick={handleProceed}
              disabled={items.length === 0}
            >
              {isLoggedIn ? (<><CreditCard className="mr-2" size={20}/>Proceed to Payment</>) : (<><LogIn className="mr-2" size={20}/>Login to Proceed</>)}
              <span className="text-xl">&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 