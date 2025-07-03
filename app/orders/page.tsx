"use client"

import AdminLayout from "@/components/AdminLayout"
import { CheckCircle, ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      status: "Arrived in 21 minutes",
      amount: 220,
      date: "18 May, 11:59 am",
      products: [
        { name: "Watermelon", image: "/placeholder.svg?height=60&width=60" },
        { name: "Mixed Seeds", image: "/placeholder.svg?height=60&width=60" },
        { name: "Bananas", image: "/placeholder.svg?height=60&width=60" },
        { name: "Bread", image: "/placeholder.svg?height=60&width=60" },
      ],
    },
    {
      id: 2,
      status: "Arrived in 14 minutes",
      amount: 122,
      date: "12 May, 10:04 am",
      products: [
        { name: "Spinach", image: "/placeholder.svg?height=60&width=60" },
        { name: "Yogurt", image: "/placeholder.svg?height=60&width=60" },
        { name: "Green Beans", image: "/placeholder.svg?height=60&width=60" },
        { name: "Tomatoes", image: "/placeholder.svg?height=60&width=60" },
      ],
    },
    {
      id: 3,
      status: "Arrived in 15 minutes",
      amount: 195,
      date: "16 Apr, 2:06 am",
      products: [
        { name: "Bread", image: "/placeholder.svg?height=60&width=60" },
        { name: "Maggi", image: "/placeholder.svg?height=60&width=60" },
        { name: "Coke", image: "/placeholder.svg?height=60&width=60" },
      ],
    },
    {
      id: 4,
      status: "Arrived in 16 minutes",
      amount: 207,
      date: "05 Apr, 2:06 pm",
      products: [
        { name: "Tomatoes", image: "/placeholder.svg?height=60&width=60" },
        { name: "Onions", image: "/placeholder.svg?height=60&width=60" },
        { name: "Green Beans", image: "/placeholder.svg?height=60&width=60" },
        { name: "Coriander", image: "/placeholder.svg?height=60&width=60" },
      ],
      moreCount: 3,
    },
  ]

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>

        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.status}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{order.amount} • {order.date}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-3">
                {order.products.map((product, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.moreCount && (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">+{order.moreCount}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
