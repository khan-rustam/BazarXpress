"use client"

import { MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="py-8 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Banner */}
        <div className="mb-6">
          <Link href="/paan-corner">
            <img
              src="/banner.png"
              alt="Paan Corner"
              className="w-full h-56 md:h-64 object-cover rounded-2xl shadow-lg cursor-pointer hover:scale-[1.01] transition-transform duration-200"
            />
          </Link>
        </div>
        {/* Three Small Banners */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          <Link href="/pharmacy">
            <img
              src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/pharmacy-WEB.jpg"
              alt="Pharmacy at your doorstep"
              className="w-[720px] h-[215px] object-cover rounded-2xl shadow cursor-pointer hover:scale-[1.01] transition-transform duration-200"
            />
          </Link>
          <Link href="/pet-care">
            <img
              src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/Pet-Care_WEB.jpg"
              alt="Pet Care supplies in minutes"
              className="w-[720px] h-[215px] object-cover rounded-2xl shadow cursor-pointer hover:scale-[1.01] transition-transform duration-200"
            />
          </Link>
          <Link href="/baby-care">
            <img
              src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-03/babycare-WEB.jpg"
              alt="No time for a diaper run?"
              className="w-[720px] h-[215px] object-cover rounded-2xl shadow cursor-pointer hover:scale-[1.01] transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
