"use client"

import { useState } from "react"
import { X, MapPin, Search, Navigation } from "lucide-react"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: any) => void
  currentLocation: string
}

export default function LocationModal({ isOpen, onClose, onLocationSelect, currentLocation }: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  // Mock location suggestions
  const popularLocations = [
    {
      id: 1,
      name: "Connaught Place",
      address: "Connaught Place, Central Delhi, New Delhi",
      deliveryTime: "8-12 mins",
    },
    {
      id: 2,
      name: "Karol Bagh",
      address: "Karol Bagh, Central Delhi, New Delhi",
      deliveryTime: "10-15 mins",
    },
    {
      id: 3,
      name: "Lajpat Nagar",
      address: "Lajpat Nagar, South Delhi, New Delhi",
      deliveryTime: "12-18 mins",
    },
    {
      id: 4,
      name: "Dwarka",
      address: "Dwarka, South West Delhi, New Delhi",
      deliveryTime: "15-20 mins",
    },
  ]

  const handleDetectLocation = async () => {
    setIsDetecting(true)

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          })
        })

        // Mock reverse geocoding
        const detectedLocation = {
          name: "Current Location",
          address: "124, Sachivalaya Vihar, Kalyanpuri, New Delhi",
          deliveryTime: "8-12 mins",
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }

        onLocationSelect(detectedLocation)
        onClose()
      } catch (error) {
        console.error("Error detecting location:", error)
        alert("Unable to detect location. Please search manually.")
      }
    } else {
      alert("Geolocation is not supported by this browser.")
    }

    setIsDetecting(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      // Mock search results
      const filtered = popularLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.address.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }

  const handleLocationSelect = (location: any) => {
    onLocationSelect(location)
    onClose()
    setSearchQuery("")
    setSearchResults([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Change Location</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition" aria-label="Close modal">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location Detection and Search */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isDetecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation size={20} />
                  <span>Detect my location</span>
                </>
              )}
            </button>

            <div className="flex items-center text-gray-400 font-medium">
              <span>OR</span>
            </div>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="search delivery location"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Search Results</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <p className="text-xs text-green-600 mt-1">Delivery in {location.deliveryTime}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          {searchQuery.length === 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Locations</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {popularLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <p className="text-xs text-green-600 mt-1">Delivery in {location.deliveryTime}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Location Display */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Current Location</p>
                <p className="text-sm text-green-600">{currentLocation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
