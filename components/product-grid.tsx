"use client"

import { Plus, Star } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Fresh Bananas",
    price: 2.99,
    originalPrice: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 128,
    discount: 25,
    category: "fruits",
  },
  {
    id: 2,
    name: "Organic Spinach",
    price: 1.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 89,
    category: "vegetables",
  },
  {
    id: 3,
    name: "Whole Milk",
    price: 3.49,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 156,
    category: "dairy",
  },
  {
    id: 4,
    name: "Premium Bread",
    price: 2.79,
    originalPrice: 3.29,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    reviews: 67,
    discount: 15,
    category: "bakery",
  },
  {
    id: 5,
    name: "Fresh Tomatoes",
    price: 4.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 203,
    category: "vegetables",
  },
  {
    id: 6,
    name: "Greek Yogurt",
    price: 5.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 94,
    category: "dairy",
  },
  {
    id: 7,
    name: "Mixed Berries",
    price: 6.99,
    originalPrice: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.6,
    reviews: 112,
    discount: 22,
    category: "fruits",
  },
  {
    id: 8,
    name: "Chicken Breast",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    reviews: 78,
    category: "meat",
  },
]

interface ProductGridProps {
  onAddToCart: (product: any) => void
  searchQuery: string
}

export default function ProductGrid({ onAddToCart, searchQuery }: ProductGridProps) {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-surface-secondary rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
        >
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {product.discount && (
              <span className="absolute top-2 left-2 bg-brand-warning text-text-inverse text-xs px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-text-primary font-medium mb-2 line-clamp-2">{product.name}</h3>

            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-text-secondary ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-text-tertiary line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-accent text-inverse py-2 rounded-lg hover:bg-brand-primary transition duration-200 flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
