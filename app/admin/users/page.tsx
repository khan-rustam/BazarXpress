"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../components/AdminLayout"
import { useAppSelector } from '../../../lib/store'
import { Search, Edit, Trash2, Eye, Loader2, Check, X } from "lucide-react"
import toast from 'react-hot-toast'

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  dateOfBirth?: string;
  address?: any;
};

type ReduxUser = User & { token?: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminUsers() {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const router = useRouter()


  useEffect(() => {
    if (!user || user.role !== "admin" || !token) {
      router.push("/")
    }
  }, [user, token, router])

  const fetchUsers = async () => {
    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true)
    setError("")
    try {
      console.log('Token being sent:', token);
      const res = await fetch(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      console.log('Response:', res);
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError("Could not load users.")
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => { if (token) fetchUsers() }, [token])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      if (!token) throw new Error("No authentication token found.");
      const res = await fetch(`${API_URL}/auth/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error("Delete failed")
      setUsers(users.filter(u => u.id !== id))
      toast.success("User deleted")
    } catch {
      toast.error("Failed to delete user")
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const handleRoleChange = async (id: string, newRole: 'admin' | 'user') => {
    setChangingRoleId(id)
    try {
      if (!token) throw new Error("No authentication token found.");
      const res = await fetch(`${API_URL}/auth/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      })
      if (!res.ok) throw new Error("Role update failed")
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u))
      toast.success("Role updated")
    } catch {
      toast.error("Failed to update role")
    } finally {
      setChangingRoleId(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || u.role === filterRole
    return matchesSearch && matchesRole
  })

  if (!user || user.role !== "admin" || !token) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-500">No authentication token found or you are not admin. Please log in again.</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-codGray">Users Management</h2>
            <p className="text-gray-600">Manage all registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin h-8 w-8 text-brand-primary" /></div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">User</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-inner" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-codGray">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                        {user.id !== u.id && (
                          <select
                            value={u.role}
                            disabled={changingRoleId === u.id}
                            onChange={e => handleRoleChange(u.id, e.target.value as 'admin' | 'user')}
                            className="ml-2 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                        {changingRoleId === u.id && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-brand-primary" />}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {/* <button className="p-1 text-text-tertiary hover:text-brand-primary transition-colors"><Eye className="h-4 w-4" /></button> */}
                          {u.role == 'admin' ? (<p className="text-brand-error">Cannot update admin</p>) : (
                            <button
                              className="p-1 text-text-tertiary hover:text-brand-error transition-colors"
                              onClick={() => setConfirmDelete(u.id)}
                              disabled={deletingId === u.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          {user.id !== u.id && u.role === 'admin' && (
                            <span className="text-xs text-gray-400 ml-2">No action can be taken on admin user</span>
                          )}
                          {deletingId === u.id && <Loader2 className="inline ml-2 h-4 w-4 animate-spin text-brand-error" />}
                        </div>
                        {/* Confirm Delete Modal */}
                        {confirmDelete === u.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                              <h3 className="text-lg font-bold mb-2">Delete User?</h3>
                              <p className="mb-4 text-gray-600">Are you sure you want to delete <span className="font-semibold">{u.name}</span>? This action cannot be undone.</p>
                              <div className="flex justify-center gap-4 mt-6">
                                <button
                                  className="bg-brand-error hover:bg-brand-error-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                  onClick={() => handleDelete(u.id)}
                                  disabled={deletingId === u.id}
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </button>
                                <button
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
                                  onClick={() => setConfirmDelete(null)}
                                >
                                  <X className="h-4 w-4" /> Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}