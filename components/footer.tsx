import { Smartphone, Download, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">BazarXpress</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-md">
              India's last minute app. Get groceries, medicines, pet supplies, electronics & more delivered to your
              doorstep in minutes.
            </p>

            {/* Download App */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white mb-3">Download App</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <Smartphone size={20} />
                  <div className="text-left">
                    <p className="text-xs">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </button>
                <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <Download size={20} />
                  <div className="text-left">
                    <p className="text-xs">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Useful Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Blog", href: "/blog" },
                { name: "Press", href: "#" },
                { name: "Lead", href: "#" },
                { name: "Value", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 text-sm hover:text-white transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Help & Support</h4>
            <ul className="space-y-2">
              {[
                { name: "Pricing", href: "#" },
                { name: "Terms", href: "/terms" },
                { name: "Privacy", href: "/privacy" },
                { name: "FAQs", href: "/faq" },
                { name: "Security", href: "/security" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 text-sm hover:text-white transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 BazarXpress. All rights reserved.</p>
              
          </div>
        </div>
      </div>
    </footer>
  )
}
