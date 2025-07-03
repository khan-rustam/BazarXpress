"use client"

import { Plus, Star, Clock } from "lucide-react"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

const productSections = [
  {
    title: "Vegetables & Fruits",
    products: [
      {
        id: 1,
        name: "Onion",
        price: 23,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.1,
        deliveryTime: "8 MINS",
      },
      {
        id: 2,
        name: "Potato",
        price: 17,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
      {
        id: 3,
        name: "Tomato",
        price: 35,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.3,
        deliveryTime: "8 MINS",
      },
      {
        id: 4,
        name: "Capsicum",
        price: 45,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.0,
        deliveryTime: "8 MINS",
      },
      {
        id: 5,
        name: "Banana",
        price: 55,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.4,
        deliveryTime: "8 MINS",
      },
      {
        id: 6,
        name: "Apple",
        price: 185,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.5,
        deliveryTime: "8 MINS",
      },
      {
        id: 7,
        name: "Cucumber",
        price: 30,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
      {
        id: 8,
        name: "Carrot",
        price: 40,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.3,
        deliveryTime: "8 MINS",
      },
      {
        id: 9,
        name: "Mango",
        price: 120,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.6,
        deliveryTime: "8 MINS",
      },
      {
        id: 10,
        name: "Papaya",
        price: 60,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.1,
        deliveryTime: "8 MINS",
      },
      {
        id: 11,
        name: "Grapes",
        price: 90,
        unit: "1 kg",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.4,
        deliveryTime: "8 MINS",
      },
      {
        id: 12,
        name: "Pineapple",
        price: 80,
        unit: "1 pc",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
    ],
  },
  {
    title: "Dairy & Breakfast",
    products: [
      {
        id: 13,
        name: "Amul Taza Toned Fresh Milk",
        price: 27,
        unit: "500 ml",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.3,
        deliveryTime: "8 MINS",
      },
      {
        id: 14,
        name: "Amul Butter",
        price: 56,
        unit: "100 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.4,
        deliveryTime: "8 MINS",
      },
      {
        id: 15,
        name: "Britannia Bread",
        price: 25,
        unit: "400 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.1,
        deliveryTime: "8 MINS",
      },
      {
        id: 16,
        name: "Eggs",
        price: 84,
        unit: "12 pieces",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
      {
        id: 17,
        name: "Mother Dairy Curd",
        price: 30,
        unit: "400 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.3,
        deliveryTime: "8 MINS",
      },
      {
        id: 18,
        name: "Amul Cheese Slices",
        price: 145,
        unit: "200 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.5,
        deliveryTime: "8 MINS",
      },
      {
        id: 19,
        name: "Amul Diced Cheese",
        price: 125,
        unit: "200 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.4,
        deliveryTime: "8 MINS",
      },
      {
        id: 20,
        name: "English Oven Bread",
        price: 30,
        unit: "350 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
      {
        id: 21,
        name: "Amul Paneer",
        price: 80,
        unit: "200 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.5,
        deliveryTime: "8 MINS",
      },
      {
        id: 22,
        name: "Amul Masti Dahi",
        price: 25,
        unit: "200 g",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.3,
        deliveryTime: "8 MINS",
      },
      {
        id: 23,
        name: "Amul Gold Milk",
        price: 32,
        unit: "500 ml",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.4,
        deliveryTime: "8 MINS",
      },
      {
        id: 24,
        name: "Amul Lassi",
        price: 20,
        unit: "200 ml",
        image: "/placeholder.svg?height=150&width=150",
        rating: 4.2,
        deliveryTime: "8 MINS",
      },
    ],
  },
]

interface ProductSectionProps {
  onAddToCart: (product: any) => void
  searchQuery: string
}

export default function ProductSection({ onAddToCart, searchQuery }: ProductSectionProps) {
  return (
    <section className="py-8 bg-surface-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {productSections.map((section) => (
          <div key={section.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">{section.title}</h2>
              <button className="text-brand-primary font-medium hover:text-brand-primary-dark">see all</button>
            </div>

            <div className="relative">
              <Carousel className="w-full">
                <CarouselPrevious />
                <CarouselContent>
                  {section.products.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer min-h-[280px]">
                          <div className="w-full flex flex-col items-center mb-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-28 h-28 object-contain mb-2"
                            />
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <Clock className="w-4 h-4 mr-1 text-green-600" />
                              <span>12 MINS</span>
                            </div>
                          </div>
                          <div className="w-full flex-1 flex flex-col items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900 text-center mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.unit}</p>
                            <div className="flex items-center justify-between w-full mt-auto">
                              <span className="text-base font-semibold text-gray-900">₹{product.price}</span>
                              <button
                                onClick={e => { e.preventDefault(); onAddToCart(product); }}
                                className="ml-2 px-6 py-1.5 rounded border border-green-600 text-green-600 font-semibold bg-white hover:bg-green-50 transition text-sm"
                              >
                                ADD
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
