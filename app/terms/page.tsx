"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FileText, Calendar } from "lucide-react"

export default function TermsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const isLoggedIn = true
  const user = { name: "John Doe", email: "user@BazarXpress.com" }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={() => {}}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar size={16} />
              <span>Last updated: January 1, 2024</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing and using the BazarXpress platform, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on BazarXpress's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Delivery Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BazarXpress strives to deliver orders within 10-15 minutes. However, delivery times may vary based on:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Product availability</li>
                <li>Weather conditions</li>
                <li>Traffic conditions</li>
                <li>High demand periods</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All payments must be made at the time of placing the order. We accept various payment methods including
                credit cards, debit cards, UPI, and cash on delivery (where available).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Return and Refund Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We offer returns for damaged or incorrect items. Please contact our customer support within 24 hours of
                delivery for assistance with returns or refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: support@BazarXpress.com</p>
                <p className="text-gray-700">Phone: 1800-123-4567</p>
                <p className="text-gray-700">Address: BazarXpress Technologies Pvt Ltd, New Delhi, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
