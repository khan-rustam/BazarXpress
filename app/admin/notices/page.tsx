"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useAppSelector } from '../../../lib/store';
import { useRouter } from 'next/navigation';

interface Notice {
  id?: number
  message: string // rich text or plain text
  startDate: string // ISO string
  endDate: string // ISO string
  bgColor?: string
  textColor?: string
}

const defaultNotice: Notice = {
  id: undefined,
  message: "",
  startDate: "",
  endDate: "",
  bgColor: "bg-brand-notice-bg",
  textColor: "text-brand-notice-text"
}

export default function AdminNotices() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([])
  const [editing, setEditing] = useState<Notice | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const saved = localStorage.getItem("siteNotices")
    if (saved) {
      try {
        setNotices(JSON.parse(saved))
      } catch {
        setNotices([])
      }
    }
  }, [])

  const saveNotices = (arr: Notice[]) => {
    setNotices(arr)
    localStorage.setItem("siteNotices", JSON.stringify(arr))
  }

  const handleEdit = (notice: Notice) => {
    setEditing(notice)
    setShowForm(true)
  }

  const handleDelete = (id: any) => {
    const arr = notices.filter(n => n.id !== id)
    saveNotices(arr)
    setSuccess("Notice deleted.")
    setTimeout(() => setSuccess(""), 1500)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    let arr
    if (editing.id) {
      arr = notices.map(n => n.id === editing.id ? editing : n)
      setSuccess("Notice updated!")
    } else {
      const newNotice = { ...editing, id: Date.now() }
      arr = [...notices, newNotice]
      setSuccess("Notice created!")
    }
    saveNotices(arr)
    setEditing(null)
    setShowForm(false)
    setTimeout(() => setSuccess(""), 1500)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editing) return
    setEditing({ ...editing, [e.target.name]: e.target.value })
  }

  // Date formatting for table
  const formatDate = (iso: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
  }

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-codGray">Notice</h2>
            <p className="text-gray-600">Manage all site notices</p>
          </div>
          <button
            className="bg-surface-primary hover:bg-brand-primary hover:text-text-inverse text-text-primary rounded p-2 transition-colors"
            onClick={() => { setEditing({ ...defaultNotice }); setShowForm(true) }}
            aria-label="Add Notice"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 font-semibold">Notice</th>
                <th className="py-3 px-4 font-semibold">Start date</th>
                <th className="py-3 px-4 font-semibold">End date</th>
                <th className="py-3 px-4 font-semibold text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <div className="text-lg text-gray-500 mb-2">No notices yet.</div>
                      <div className="text-sm text-gray-400 mb-6">Click the + button or the button below to add your first notice.</div>
                      <button
                        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        onClick={() => { setEditing({ ...defaultNotice }); setShowForm(true) }}
                      >
                        Add Notice
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {notices.map(notice => (
                <tr key={notice.id} className="bg-white border-b">
                  <td className="py-3 px-4 align-middle max-w-xl whitespace-pre-line">{notice.message}</td>
                  <td className="py-3 px-4 align-middle">{formatDate(notice.startDate)}</td>
                  <td className="py-3 px-4 align-middle">{formatDate(notice.endDate)}</td>
                  <td className="py-3 px-4 align-middle text-center">
                    <button
                      className="inline-flex items-center justify-center rounded-full p-2 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors mr-2"
                      onClick={() => handleEdit(notice)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-full p-2 text-brand-error hover:bg-brand-error hover:text-white transition-colors"
                      onClick={() => handleDelete(notice.id)}
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
        {/* Notice Form Modal */}
        {showForm && editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-8 relative">
              <div className="text-xl font-semibold mb-4">{editing.id ? "Edit notice" : "Create notice"}</div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Your message here...</label>
                  {/* Replace with Froala or other rich text editor if needed */}
                  <textarea
                    className="w-full border border-border-primary rounded-lg p-3 focus:ring-2 focus:ring-brand-primary min-h-[120px]"
                    name="message"
                    placeholder="Type something"
                    value={editing.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full border border-border-primary rounded-lg p-3 focus:ring-2 focus:ring-brand-primary"
                      value={editing.startDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      className="w-full border border-border-primary rounded-lg p-3 focus:ring-2 focus:ring-brand-primary"
                      value={editing.endDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-medium mb-1">Background Color</label>
                    <input
                      type="color"
                      name="bgColor"
                      className="w-12 h-12 p-0 border-0 bg-transparent cursor-pointer"
                      value={editing.bgColor || "bg-brand-notice-bg"}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-medium mb-1">Text Color</label>
                    <input
                      type="color"
                      name="textColor"
                      className="w-12 h-12 p-0 border-0 bg-transparent cursor-pointer"
                      value={editing.textColor || "text-brand-notice-text"}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primary-dark text-text-inverse font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-surface-tertiary hover:bg-surface-tertiary-dark text-text-primary font-semibold py-2 px-6 rounded-lg transition-colors"
                    onClick={() => { setEditing(null); setShowForm(false) }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              <button
                className="absolute top-3 right-3 text-text-secondary hover:text-brand-error text-2xl"
                onClick={() => { setEditing(null); setShowForm(false) }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 