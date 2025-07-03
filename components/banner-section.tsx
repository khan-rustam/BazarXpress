export default function BannerSection() {
  const banners = [
    {
      id: 1,
      title: "Fruits & Vegetables",
      subtitle: "Upto 60% OFF",
      image: "/placeholder.svg?height=200&width=400",
      bgColor: "bg-gradient-to-r from-green-400 to-green-600",
    },
    {
      id: 2,
      title: "Dairy Products",
      subtitle: "Starting ₹99",
      image: "/placeholder.svg?height=200&width=400",
      bgColor: "bg-gradient-to-r from-blue-400 to-blue-600",
    },
    {
      id: 3,
      title: "Snacks & Beverages",
      subtitle: "Buy 2 Get 1 Free",
      image: "/placeholder.svg?height=200&width=400",
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-600",
    },
  ]

  return (
    <section className="py-8 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`${banner.bgColor} rounded-2xl p-6 text-white relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200`}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                <p className="text-lg opacity-90">{banner.subtitle}</p>
                <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                  Shop Now
                </button>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 opacity-20">
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
