"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../../components/AdminLayout"
import { Eye, Trash2, CheckCircle2 } from "lucide-react"
import { useAppSelector } from '../../../lib/store';
import { useRouter } from 'next/navigation';

const mockEnquiries = [
  { id: "1", name: "John Doe", email: "john@example.com", subject: "Order Issue", message: "I have an issue with my order.", date: "2024-05-01", read: false },
]

export default function AdminEnquiry() {
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

  const [enquiries, setEnquiries] = useState(mockEnquiries)
  const [viewing, setViewing] = useState<any | null>(null)
  const handleDelete = (id: string) => setEnquiries(enquiries.filter(e => e.id !== id))
  const markAsRead = (id: string) => setEnquiries(enquiries.map(e => e.id === id ? { ...e, read: true } : e))

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Enquiries</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z" />
                      </svg>
                      <div className="text-lg text-gray-500 mb-2">No enquiries yet.</div>
                      <div className="text-sm text-gray-400 mb-6">All customer enquiries will appear here.</div>
                    </div>
                  </td>
                </tr>
              )}
              {enquiries.map(e => (
                <tr key={e.id} className="bg-white border-b">
                  <td className="py-3 px-4 align-middle font-semibold text-brand-primary">{e.name}</td>
                  <td className="py-3 px-4 align-middle">{e.email}</td>
                  <td className="py-3 px-4 align-middle">{e.subject}</td>
                  <td className="py-3 px-4 align-middle">{e.date}</td>
                  <td className="py-3 px-4 align-middle">
                    {e.read ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Read</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Unread</span>
                    )}
                  </td>
                  <td className="py-3 px-4 align-middle text-center flex gap-2 justify-center">
                    <button className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-primary-dark text-white rounded p-2" onClick={() => setViewing(e)} aria-label="View"><Eye className="h-5 w-5" /></button>
                    <button className="inline-flex items-center justify-center bg-brand-error hover:bg-brand-error-dark text-white rounded p-2" onClick={() => handleDelete(e.id)} aria-label="Delete"><Trash2 className="h-5 w-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* View Modal */}
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 relative border-4 border-brand-primary">
              <div className="text-2xl font-bold mb-4 text-brand-primary">Enquiry Details</div>
              <div className="mb-2"><span className="font-semibold">Name:</span> {viewing.name}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {viewing.email}</div>
              <div className="mb-2"><span className="font-semibold">Subject:</span> {viewing.subject}</div>
              <div className="mb-2"><span className="font-semibold">Date:</span> {viewing.date}</div>
              <div className="mb-4"><span className="font-semibold">Message:</span><div className="bg-gray-50 rounded p-3 mt-1 text-codGray whitespace-pre-line">{viewing.message}</div></div>
              <div className="flex gap-2 mt-4">
                {!viewing.read && <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors" onClick={() => { markAsRead(viewing.id); setViewing(null) }}>Mark as Read</button>}
                <button className="bg-surface-tertiary hover:bg-surface-tertiary-dark text-text-primary font-semibold py-2 px-6 rounded-lg transition-colors" onClick={() => setViewing(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 