"use client"

import AccountLayout from "@/components/AccountLayout"
import { Gift, Plus, CreditCard } from "lucide-react"

export default function GiftCardsPage() {
  const giftCards = [
    {
      id: 1,
      amount: 500,
      balance: 350,
      code: "GIFT500ABC",
      expiryDate: "2024-12-31",
      status: "active",
    },
    {
      id: 2,
      amount: 1000,
      balance: 0,
      code: "GIFT1000XYZ",
      expiryDate: "2024-06-30",
      status: "used",
    },
  ]

  return (
    <AccountLayout currentPage="gift-cards">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">E-Gift Cards</h1>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2">
              <Plus size={20} />
              <span>Buy Gift Card</span>
            </button>
          </div>
        </div>

        {/* Gift Card Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {[500, 1000, 2000].map((amount) => (
            <div
              key={amount}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <Gift size={32} />
                <span className="text-2xl font-bold">₹{amount}</span>
              </div>
              <p className="text-sm opacity-90">Perfect for gifting</p>
            </div>
          ))}
        </div>

        {/* My Gift Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">My Gift Cards</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {giftCards.map((card) => (
              <div key={card.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Gift Card - ₹{card.amount}</h3>
                      <p className="text-sm text-gray-500">Code: {card.code}</p>
                      <p className="text-sm text-gray-500">Expires: {card.expiryDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{card.balance}</p>
                    <p className="text-sm text-gray-500">Balance</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Gift Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Redeem Gift Card</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter gift card code"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Redeem
            </button>
          </div>
        </div>
      </div>
    </AccountLayout>
  )
}
