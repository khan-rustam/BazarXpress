"use client"

import { useEffect, useRef, useState } from "react";

// Add this at the top for TypeScript global declaration
declare global {
    interface Window {
        google: any;
    }
}

interface GoogleMapsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: {
        lat: number;
        lng: number;
        address: string;
        city: string;
        state: string;
        country: string;
        pin: string;
    }) => void;
}

// Replace the API key with the provided one
const GOOGLE_MAPS_API_KEY = "AIzaSyCy5Os4x-EW5A3KcgowpH44uib4X_I_AHk";

export default function GoogleMapsModal({ isOpen, onClose, onLocationSelect }: GoogleMapsModalProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number } | null>(null);

    // Load Google Maps script
    useEffect(() => {
        if (!isOpen) return;
        if (window.google && window.google.maps) {
            initMap();
            return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
        // eslint-disable-next-line
    }, [isOpen]);

    // Initialize map
    function initMap() {
        if (!mapRef.current || !window.google || !window.google.maps) return;
        const center = { lat: 28.6139, lng: 77.2090 }; // Default: New Delhi
        const _map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 12,
        });
        setMap(_map);

        // Add marker
        const _marker = new window.google.maps.Marker({
            position: center,
            map: _map,
            draggable: true,
        });
        setMarker(_marker);
        setSelectedLatLng(center);
        fetchAddress(center.lat, center.lng);

        // Add Places Autocomplete
        if (inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
            autocomplete.bindTo("bounds", _map);
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return;
                _map.panTo(place.geometry.location);
                _map.setZoom(16);
                _marker.setPosition(place.geometry.location);
                setSelectedLatLng({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                fetchAddress(place.geometry.location.lat(), place.geometry.location.lng());
            });
        }

        // Listen for marker drag
        _marker.addListener("dragend", () => {
            const pos = _marker.getPosition();
            setSelectedLatLng({ lat: pos.lat(), lng: pos.lng() });
            fetchAddress(pos.lat(), pos.lng());
        });

        // Listen for map click
        _map.addListener("click", (e: any) => {
            _marker.setPosition(e.latLng);
            setSelectedLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            fetchAddress(e.latLng.lat(), e.latLng.lng());
        });
    }

    // Fetch address from lat/lng
    async function fetchAddress(lat: number, lng: number) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.status === "OK" && data.results.length > 0) {
                const result = data.results[0];
                setSelectedAddress(result.formatted_address);
            } else {
                setSelectedAddress("");
                setError("Could not fetch address.");
            }
        } catch (e) {
            setError("Could not fetch address.");
        }
        setLoading(false);
    }

    // Parse address components
    function parseAddressComponents(address: string, components: any[]): any {
        let city = "", state = "", country = "", pin = "";
        for (const comp of components) {
            if (comp.types.includes("locality")) city = comp.long_name;
            if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
            if (comp.types.includes("country")) country = comp.long_name;
            if (comp.types.includes("postal_code")) pin = comp.long_name;
        }
        return { city, state, country, pin };
    }

    // Confirm location
    async function handleConfirm() {
        if (!marker) return;
        const pos = marker.getPosition();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat()},${pos.lng()}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.status === "OK" && data.results.length > 0) {
                const result = data.results[0];
                const { city, state, country, pin } = parseAddressComponents(result.formatted_address, result.address_components);
                onLocationSelect({
                    lat: pos.lat(),
                    lng: pos.lng(),
                    address: result.formatted_address,
                    city,
                    state,
                    country,
                    pin,
                });
                onClose();
            } else {
                setError("Could not fetch address.");
            }
        } catch (e) {
            setError("Could not fetch address.");
        }
        setLoading(false);
    }

    // Use My Location
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                if (map && window.google && window.google.maps) {
                    map.setCenter({ lat, lng });
                    map.setZoom(16);
                    marker.setPosition({ lat, lng });
                    setSelectedLatLng({ lat, lng });
                    fetchAddress(lat, lng);
                }
                setLoading(false);
            },
            (err) => {
                setError("Unable to retrieve your location.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">Select Warehouse Location</div>
                    <button onClick={onClose} className="text-2xl text-gray-400 hover:text-red-500">&times;</button>
                </div>
                <div className="mb-4 flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="Search location..."
                    />
                    <button
                        type="button"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        onClick={handleUseMyLocation}
                    >
                        Use My Location
                    </button>
                </div>
                <div className="mb-4" style={{ height: 400, borderRadius: 8, overflow: 'hidden' }}>
                    <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
                </div>
                <div className="mb-4">
                    <div className="font-medium">Selected Address:</div>
                    <div className="text-gray-700 text-sm mt-1 min-h-[24px]">{selectedAddress || (loading ? "Loading..." : "No address selected.")}</div>
                </div>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleConfirm} disabled={loading || !selectedAddress} className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Location</button>
                </div>
            </div>
        </div>
    );
} 