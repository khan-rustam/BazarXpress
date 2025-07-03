"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { Plus, Pencil, Trash2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { useAppSelector } from '../../../lib/store'
import { useRouter } from 'next/navigation'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Dynamically import the RichTextEditor to ensure it's only rendered on the client
const RichTextEditor = dynamic(() => import('../../../components/RichTextEditor'), { ssr: false })

const mockBlogs = [
  {
    id: "1",
    title: "10 Must-Have Gadgets for 2024",
    date: "2024-05-01",
    status: "published",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    content: "Discover the latest technology trends and gadgets that will revolutionize your daily life.",
  },
]

export default function AdminBlog() {
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()
  const [blogs, setBlogs] = useState(mockBlogs)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: "",
    date: "",
    status: "published",
    image: "",
    content: "", // Content will be a string (HTML)
  })

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

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

  const openAdd = () => {
    setEditing(null)
    setForm({
      title: "",
      date: "",
      status: "published",
      image: "",
      content: "", // Empty HTML string for new blog
    })
    setImagePreview(null)
    setShowModal(true)
  }
  const openEdit = (b: any) => {
    setEditing(b)
    setForm({
      title: b.title,
      date: b.date,
      status: b.status,
      image: b.image,
      content: b.content, // Content is already HTML string
    })
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
    const newBlog = { ...form, image: imagePreview || "" }
    if (editing) {
      setBlogs(blogs.map(b => b.id === editing.id ? { ...newBlog, id: editing.id } : b))
    } else {
      setBlogs([{ ...newBlog, id: Date.now().toString() }, ...blogs])
    }
    setShowModal(false)
  }
  const handleDelete = (id: string) => setBlogs(blogs.filter(b => b.id !== id))

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Blogs</div>
          <button
            className="bg-surface-primary hover:bg-brand-primary hover:text-text-inverse text-text-primary rounded p-2 transition-colors"
            onClick={openAdd}
            aria-label="Add Blog"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 font-semibold">Image</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                      <div className="text-lg text-gray-500 mb-2">No blogs yet.</div>
                      <div className="text-sm text-gray-400 mb-6">Click the + button or the button below to add your first blog post.</div>
                      <button
                        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        onClick={openAdd}
                      >
                        Add Blog
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {blogs.map(b => (
                <tr key={b.id} className="bg-white border-b">
                  <td className="py-3 px-4 align-top"><img src={b.image} alt="Blog" className="h-16 w-24 object-cover rounded shadow" /></td>
                  <td className="py-3 px-4 align-middle font-medium text-text-primary">{b.title}</td>
                  <td className="py-3 px-4 align-middle">{b.date}</td>
                  <td className="py-3 px-4 align-middle">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === "published" ? "bg-brand-primary text-white" : "bg-brand-error text-white"}`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                  </td>
                  <td className="py-3 px-4 align-middle text-center">
                    <button
                      className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary-dark text-white rounded p-2 mr-2"
                      onClick={() => openEdit(b)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center bg-brand-error hover:bg-brand-error-dark text-white rounded p-2"
                      onClick={() => handleDelete(b.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 relative border-4 border-brand-primary">
              <div className="text-2xl font-bold mb-4 text-brand-primary">{editing ? "Edit" : "Add"} Blog</div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-medium mb-1">Image</label>
                  <div className="border-2 border-dashed border-brand-primary rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer hover:border-brand-primary transition-colors" onClick={() => document.getElementById('blog-image-input')?.click()}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-32 object-contain mb-2 rounded shadow" />
                    ) : (
                      <>
                        <svg width="40" height="40" fill="none" stroke="currentColor" className="text-icon-accent" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="8" rx="2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
                        <div className="font-medium text-codGray mt-2">Upload Blog Image</div>
                        <div className="text-gray-400 text-sm">Upload jpg, png images</div>
                      </>
                    )}
                    <input
                      id="blog-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Title</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Content</label>
                  <div className="bg-white border border-gray-300 rounded-lg min-h-[120px] p-2 ">
                    {showModal && (
                      <ReactQuill
                        key={editing ? editing.id : "new"}
                        value={form.content}
                        onChange={(html) => setForm({ ...form, content: html })}
                        placeholder="Write your blog content here..."
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "blockquote", "code-block"],
                            [{ align: [] }],
                            ["clean"],
                          ],
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg">Save</button>
                  <button type="button" className="bg-surface-tertiary hover:bg-surface-tertiary-dark text-text-primary font-semibold py-2 px-6 rounded-lg transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 