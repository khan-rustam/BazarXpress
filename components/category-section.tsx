import { Apple, Carrot, Milk, Cookie, Coffee, Beef, Pill, Baby, Smartphone, Home } from "lucide-react"

const categories = [
  { name: "Vegetables & Fruits", icon: Apple, color: "bg-green-100", textColor: "text-green-700" },
  { name: "Dairy & Breakfast", icon: Milk, color: "bg-blue-100", textColor: "text-blue-700" },
  { name: "Munchies", icon: Cookie, color: "bg-yellow-100", textColor: "text-yellow-700" },
  { name: "Cold Drinks & Juices", icon: Coffee, color: "bg-purple-100", textColor: "text-purple-700" },
  { name: "Instant & Frozen Food", icon: Beef, color: "bg-red-100", textColor: "text-red-700" },
  { name: "Tea, Coffee & Health Drink", icon: Coffee, color: "bg-orange-100", textColor: "text-orange-700" },
  { name: "Bakery & Biscuits", icon: Cookie, color: "bg-pink-100", textColor: "text-pink-700" },
  { name: "Sweet Tooth", icon: Cookie, color: "bg-indigo-100", textColor: "text-indigo-700" },
  { name: "Atta, Rice & Dal", icon: Carrot, color: "bg-amber-100", textColor: "text-amber-700" },
  { name: "Masala, Oil & More", icon: Carrot, color: "bg-lime-100", textColor: "text-lime-700" },
  { name: "Chicken, Meat & Fish", icon: Beef, color: "bg-rose-100", textColor: "text-rose-700" },
  { name: "Paan Corner", icon: Apple, color: "bg-emerald-100", textColor: "text-emerald-700" },
  { name: "Pharma & Wellness", icon: Pill, color: "bg-cyan-100", textColor: "text-cyan-700" },
  { name: "Cleaning Essentials", icon: Home, color: "bg-teal-100", textColor: "text-teal-700" },
  { name: "Baby Care", icon: Baby, color: "bg-violet-100", textColor: "text-violet-700" },
  { name: "Electronics", icon: Smartphone, color: "bg-slate-100", textColor: "text-slate-700" },
]

export default function CategorySection() {
  return (
    <section className="py-8 bg-surface-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <button
                key={index}
                className="flex flex-col items-center p-3 rounded-xl hover:bg-surface-hover transition duration-200 group"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className={`w-8 h-8 ${category.textColor}`} />
                </div>
                <span className="text-xs font-medium text-text-primary text-center leading-tight">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
