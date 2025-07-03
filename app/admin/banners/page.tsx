"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useAppSelector } from '../../../lib/store';
import { useRouter } from 'next/navigation';

const mockBanners = [
  { id: "1", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", headline: "Big Sale!", subheadline: "Up to 50% Off", buttonText: "Shop Now", buttonLink: "/shop", highlight: "Get up to 30% off on your first $150 purchase" },
]

export default function AdminBanner() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spectra mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const [banners, setBanners] = useState(mockBanners)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    image: "",
    headline: "",
    subheadline: "",
    buttonText: "",
    buttonLink: "",
    highlight: "",
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ image: "", headline: "", subheadline: "", buttonText: "", buttonLink: "", highlight: "" })
    setImagePreview(null)
    setShowModal(true)
  }
  const openEdit = (b: any) => {
    setEditing(b)
    setForm({ image: b.image, headline: b.headline, subheadline: b.subheadline, buttonText: b.buttonText, buttonLink: b.buttonLink, highlight: b.highlight })
    setImagePreview(b.image)
    setShowModal(true)
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const newBanner = { ...form, image: imagePreview || "" }
    if (editing) {
      setBanners(banners.map(b => b.id === editing.id ? { ...newBanner, id: editing.id } : b))
    } else {
      setBanners([{ ...newBanner, id: Date.now().toString() }, ...banners])
    }
    setShowModal(false)
  }
  const handleDelete = (id: string) => setBanners(banners.filter(b => b.id !== id))

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Banners</h1>
          <button className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors" onClick={openAdd}>
            <Plus className="h-5 w-5" /> Add Banner
          </button>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-lg p-0 overflow-x-auto">
          <table className="min-w-[900px] w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3.5 px-6 font-semibold text-sm">Image</th>
                <th className="py-3.5 px-6 font-semibold text-sm">Headline</th>
                <th className="py-3.5 px-6 font-semibold text-sm">Subheadline</th>
                <th className="py-3.5 px-6 font-semibold text-sm">Button</th>
                <th className="py-3.5 px-6 font-semibold text-sm">Highlight</th>
                <th className="py-3.5 px-6 font-semibold text-sm text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <div className="text-lg text-gray-500 mb-2">No banners yet.</div>
                      <div className="text-sm text-gray-400 mb-6">Click the + button or the button below to add your first banner.</div>
                      <button
                        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        onClick={openAdd}
                      >
                        Add Banner
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {banners.map(b => (
                <tr key={b.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 align-middle text-sm">
                    <img src={b.image} alt="Banner" className="h-20 w-36 object-cover rounded-lg shadow" />
                  </td>
                  <td className="py-4 px-6 align-middle text-sm">
                    <span className="text-brand-primary font-semibold">{b.headline}</span>
                  </td>
                  <td className="py-4 px-6 align-middle text-sm">
                    <span className="text-text-secondary">{b.subheadline}</span>
                  </td>
                  <td className="py-4 px-6 align-middle text-center text-sm">
                    <span className="inline-block px-4 py-2 rounded-full bg-brand-primary text-white font-semibold text-xs shadow-sm text-center min-w-[90px] whitespace-nowrap">{b.buttonText}</span>
                  </td>
                  <td className="py-4 px-6 align-middle text-sm">
                    <span className="text-brand-success font-semibold">{b.highlight}</span>
                  </td>
                  <td className="py-4 px-6 align-middle text-center text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors" onClick={() => openEdit(b)} aria-label="Edit">
                        <Pencil className="h-6 w-6" />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-brand-error text-white hover:bg-brand-error-dark transition-colors" onClick={() => handleDelete(b.id)} aria-label="Delete">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative border-4 border-brand-primary/20">
              <div className="text-2xl font-bold mb-4 text-brand-primary">{editing ? "Edit" : "Add"} Banner</div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-medium mb-1">Image</label>
                  <div className="border-2 border-dashed border-brand-primary/40 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:border-brand-primary transition-colors" onClick={() => document.getElementById('banner-image-input')?.click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain mb-2 rounded shadow" />
                    ) : (
                      <>
                        <svg width="40" height="40" fill="none" stroke="currentColor" className="text-brand-primary" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="8" rx="2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
                        <div className="font-medium text-text-primary mt-2">Upload Banner Image</div>
                        <div className="text-text-secondary text-sm">Upload jpg, png images</div>
                      </>
                    )}
                    <input
                      id="banner-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">Headline</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Subheadline</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.subheadline} onChange={e => setForm({ ...form, subheadline: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">Button Text</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Button Link</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.buttonLink} onChange={e => setForm({ ...form, buttonLink: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Highlight</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.highlight} onChange={e => setForm({ ...form, highlight: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-transform">Save</button>
                  <button type="button" className="bg-surface-secondary hover:bg-surface-tertiary text-text-primary font-semibold py-2 px-6 rounded-lg transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
              <button className="absolute top-3 right-3 text-text-secondary hover:text-brand-error text-2xl" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 