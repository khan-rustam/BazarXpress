"use client"

import AdminLayout from "@/components/AdminLayout"
import { Trash2, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function PrivacyPage() {
  const [showFullPolicy, setShowFullPolicy] = useState(false)

  return (
    <AdminLayout >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Account privacy and policy</h1>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed mb-4">
              We i.e. "Blink Commerce Private Limited", are committed to protecting the privacy and security of your
              personal information. Your privacy is important to us and maintaining your trust is paramount.
            </p>

            <button
              onClick={() => setShowFullPolicy(!showFullPolicy)}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
            >
              <span>Read more</span>
              {showFullPolicy ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {showFullPolicy && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm leading-relaxed">
                  This Privacy Policy describes how we collect, use, process, and disclose your information, including
                  personal information, in conjunction with your access to and use of the BazarXpress platform. We collect
                  and use personal information to provide, understand, improve, and develop the BazarXpress platform, create
                  and maintain a trusted and safer environment, and comply with our legal obligations.
                </p>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Request to delete account</h3>
                  <p className="text-sm text-gray-500">Request to closure of your account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
