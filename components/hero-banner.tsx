export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-brand-secondary to-brand-primary text-inverse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Groceries delivered in
            <span className="block text-yellow-300">10 minutes</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 opacity-90">Fresh vegetables, fruits & more. Order now!</p>
          <button className="bg-surface-primary text-brand-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-surface-secondary transition duration-200 shadow-lg">
            Start Shopping
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>
    </section>
  )
}
