"use client"

import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      id: 1,
      category: "Orders & Delivery",
      question: "How fast is the delivery?",
      answer:
        "We deliver groceries in 8-12 minutes on average. Our delivery partners are strategically located to ensure quick delivery to your doorstep.",
    },
    {
      id: 2,
      category: "Orders & Delivery",
      question: "What are the delivery charges?",
      answer: "Delivery is free on orders above ₹99. For orders below ₹99, a delivery charge of ₹25 applies.",
    },
    {
      id: 3,
      category: "Payment",
      question: "What payment methods do you accept?",
      answer:
        "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery.",
    },
    {
      id: 4,
      category: "Account",
      question: "How do I change my delivery address?",
      answer:
        "You can change your delivery address by going to 'Saved Addresses' in your account settings and adding or editing addresses.",
    },
    {
      id: 5,
      category: "Returns & Refunds",
      question: "What is your return policy?",
      answer:
        "We offer easy returns for damaged or incorrect items. Contact our support team within 24 hours of delivery for assistance.",
    },
    {
      id: 6,
      category: "App & Website",
      question: "Is there a mobile app available?",
      answer:
        "Yes! Download the BazarXpress app from Google Play Store or Apple App Store for a better shopping experience.",
    },
  ]

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = [...new Set(faqs.map((faq) => faq.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about BazarXpress</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-green-50 hover:border-green-300 transition"
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl transition"
              >
                <div>
                  <span className="text-xs text-green-600 font-medium">{faq.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-1">{faq.question}</h3>
                </div>
                {expandedItems.includes(faq.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-green-50 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">Our support team is here to help you 24/7</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
