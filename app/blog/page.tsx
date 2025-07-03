"use client"

import { useState } from "react"
import Footer from "@/components/footer"
import { Calendar, User, ArrowRight, Search } from "lucide-react"

export default function BlogPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const isLoggedIn = true
  const user = { name: "John Doe", email: "user@BazarXpress.com" }

  const blogPosts = [
    {
      id: 1,
      title: "10 Minute Grocery Delivery: How We Make It Possible",
      excerpt:
        "Discover the technology and logistics behind our lightning-fast delivery system that brings groceries to your doorstep in just 10 minutes.",
      author: "BazarXpress Team",
      date: "January 15, 2024",
      category: "Technology",
      image: "/placeholder.svg?height=200&width=400",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Fresh Produce: Tips for Selecting the Best Fruits and Vegetables",
      excerpt:
        "Learn how to choose the freshest fruits and vegetables for your family. Our expert tips will help you make the best selections every time.",
      author: "Nutrition Expert",
      date: "January 12, 2024",
      category: "Health & Nutrition",
      image: "/placeholder.svg?height=200&width=400",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Sustainable Packaging: Our Commitment to the Environment",
      excerpt:
        "Explore our eco-friendly packaging initiatives and how we're working to reduce our environmental footprint while delivering your groceries.",
      author: "Sustainability Team",
      date: "January 10, 2024",
      category: "Sustainability",
      image: "/placeholder.svg?height=200&width=400",
      readTime: "4 min read",
    },
  ]

  const categories = ["All", "Technology", "Health & Nutrition", "Sustainability", "Company News"]

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BazarXpress Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, tips, and insights from the world of instant grocery delivery
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-green-50 hover:border-green-300 transition"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h2>

                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User size={16} />
                    <span>{post.author}</span>
                    <span>•</span>
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                    <span>Read More</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition">
            Load More Articles
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
