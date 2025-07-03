"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../components/AdminLayout"
import { useAppSelector } from '../../../lib/store'
import { Search, Plus, Edit, Trash2, MoreHorizontal, Grid3X3 } from "lucide-react"
import * as LucideIcons from "lucide-react"
import toast from "react-hot-toast"

type Category = {
  _id?: string
  id?: string
  name: string
  description?: string
  productCount?: number
  status?: string
  createdDate?: string
  icon: string
  parentId?: string
  hide?: boolean
  popular?: boolean
  slug?: string
  sortOrder?: number
  thumbnail?: string
}

// Utility to sanitize icon input
function sanitizeIconInput(input: string) {
  // Remove angle brackets and slashes, trim whitespace
  return input.replace(/<|>|\//g, '').trim();
}

export default function AdminCategories() {
  const user = useAppSelector((state) => state.auth.user)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    parentId: "",
    icon: "Box",
    hide: false,
    popular: false,
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const router = useRouter()
  console.log(categories);


  const BackedUrl = process.env.NEXT_PUBLIC_API_URL

  // Fetch categories from backend
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }
    fetch(`${BackedUrl}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [user, router])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // // Add category via API
  // const handleAddCategory = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const payload = {
  //     name: newCategory.name,
  //     parentId: newCategory.parentId,
  //     icon: sanitizeIconInput(newCategory.icon || "Box"),
  //     hide: newCategory.hide,
  //     popular: newCategory.popular,
  //   }
  //   try {
  //     const res = await fetch(`${BackedUrl}/categories`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     })
  //     if (res.ok) {
  //       const created = await res.json()
  //       setCategories([created, ...categories])
  //       setShowModal(false)
  //       setNewCategory({ name: "", parentId: "", icon: "Box", hide: false, popular: false })
  //       toast.success(`Category ${created.name} was created successfully.`)
  //     } else {
  //       const error = await res.json()
  //       toast.error("Failed to create category.")
  //     }
  //   } catch (err) {
  //     toast.error("Network error. Could not create category.")
  //   }
  // }

  // Edit category via API
  const openEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      parentId: category.parentId || "",
      icon: category.icon || "Box",
      hide: category.hide || false,
      popular: category.popular || false,
    })
    setShowModal(true)
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory || !editingCategory._id) return
    const payload = {
      name: newCategory.name,
      parentId: newCategory.parentId,
      icon: sanitizeIconInput(newCategory.icon || "Box"),
      hide: newCategory.hide,
      popular: newCategory.popular,
    }
    try {
      const res = await fetch(`${BackedUrl}/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setCategories(categories.map(cat => (cat._id === editingCategory._id ? { ...cat, ...payload } : cat)))
        setShowModal(false)
        setEditingCategory(null)
        setNewCategory({ name: "", parentId: "", icon: "Box", hide: false, popular: false })
        toast.success("Category updated successfully.")
      } else {
        const error = await res.json()
        toast.error("Failed to update category.")
      }
    } catch (err) {
      toast.error("Network error. Could not update category.")
    }
  }

  // Delete category via API
  const handleDeleteCategory = async (id?: string) => {
    if (!id) return
    try {
      const res = await fetch(`${BackedUrl}/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCategories(categories.filter(cat => cat._id !== id))
        toast.success("Category was deleted successfully.")
      } else {
        toast.error("Failed to delete category.")
      }
    } catch (err) {
      toast.error("Network error. Could not delete category.")
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
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
            <h2 className="text-2xl font-bold text-text-primary">Categories Management</h2>
            <p className="text-text-secondary">Organize your products into categories</p>
          </div>
          <button
            className="bg-brand-primary hover:bg-brand-primary-dark text-text-inverse px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={() => router.push('/admin/categories/add')}
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats */}
        {(() => {
          const stats = [
            {
              label: "Total Categories",
              value: categories.length,
              valueClass: "text-text-primary",
              iconClass: "text-brand-info",
            },
            {
              label: "Active Categories",
              value: categories.filter((c) => !c.hide).length,
              valueClass: "text-brand-success",
              iconClass: "text-brand-success",
            },
            {
              label: "Inactive Categories",
              value: categories.filter((c) => c.hide).length,
              valueClass: "text-brand-error",
              iconClass: "text-brand-error",
            },
            {
              label: "Total Products",
              value: categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
              valueClass: "text-brand-primary",
              iconClass: "text-brand-primary",
            },
          ];
          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={stat.label} className="bg-surface-primary rounded-lg p-6 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</p>
                    </div>
                    <Grid3X3 className={`h-8 w-8 ${stat.iconClass}`} />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Search */}
        <div className="bg-surface-primary rounded-lg p-6 shadow-md">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l1.553-4.66A2 2 0 016.447 4h11.106a2 2 0 011.894 1.34L21 10m-9 4v6m-4 0h8" />
            </svg>
            <div className="text-lg text-gray-500 mb-2">No categories yet.</div>
            <div className="text-sm text-gray-400 mb-6">Click the button below to add your first category.</div>
            <button
              className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              onClick={() => router.push('/admin/categories/add')}
            >
              Add Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category: Category) => {
              const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons["Box"];
              return (
                <div key={category._id} className="bg-surface-primary rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center md:flex-row md:items-start gap-4 w-full max-w-md mx-auto">
                  {category.thumbnail && (
                    <img src={category.thumbnail} alt={category.name} className="w-24 h-24 object-cover rounded border shadow mb-2 md:mb-0" />
                  )}
                  <div className="flex-1 w-full flex flex-col items-center md:items-start">
                    <div className="flex flex-col items-center md:items-start w-full mb-2">
                      <div className="flex items-center gap-2 mb-2 w-full justify-center md:justify-start">
                        <IconComponent className="h-8 w-8 text-brand-primary" />
                        <h3 className="text-lg font-semibold text-text-primary">{category.name}</h3>
                        {/* {category.slug && <span className="ml-2 text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{category.slug}</span>} */}
                      </div>
                      <p className="text-text-secondary text-sm mb-2 text-center md:text-left w-full">{category.description}</p>
                      <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start text-xs mb-2 w-full">
                        <span className={`px-2 py-1 rounded-full font-medium ${category.hide ? 'bg-brand-error/10 text-brand-error' : 'bg-brand-success/10 text-brand-success'}`}>{category.hide ? 'Hidden' : 'Active'}</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${category.popular ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>{category.popular ? 'Popular' : 'Normal'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start text-sm text-text-tertiary w-full">
                        <span>{category.productCount || 0} products</span>
                        <span>•</span>
                        <span>Sort: {typeof category.sortOrder === 'number' ? category.sortOrder : 0}</span>
                        <span>•</span>
                        <span>Created {category.createdDate ? new Date(category.createdDate).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                    <div className="w-full pt-4 border-t border-border-primary flex flex-col gap-2 md:flex-row md:items-center md:gap-0">
                      <button className="bg-brand-primary hover:bg-brand-primary-dark text-text-inverse py-2 px-6 rounded text-sm transition-colors w-full md:w-auto md:mr-auto">View Products</button>
                      <div className="flex flex-row gap-2 w-full md:w-auto md:ml-4 justify-end">
                        <button
                          className="p-2 text-text-tertiary hover:text-brand-primary transition-colors w-full md:w-auto"
                          onClick={() => openEditCategory(category)}
                        >
                          <Edit className="h-4 w-4 mx-auto" />
                        </button>
                        <button
                          className="p-2 text-text-tertiary hover:text-brand-error transition-colors w-full md:w-auto"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// // --- CATEGORY MODAL COMPONENT ---
// const CategoryModal = ({
//   showModal,
//   setShowModal,
//   editingCategory,
//   setEditingCategory,
//   newCategory,
//   setNewCategory,
//   categories,
//   handleAddCategory,
//   handleEditCategory,
// }: any) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Slug auto-generation and sanitization
//   function slugify(str: string) {
//     return str
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '')
//       .replace(/--+/g, '-');
//   }

//   // Update slug when name changes (unless user has edited slug manually)
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const name = e.target.value;
//     setNewCategory((prev: any) => ({
//       ...prev,
//       name,
//       slug: prev.slugEdited ? prev.slug : slugify(name),
//     }));
//   };
//   const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewCategory((prev: any) => ({
//       ...prev,
//       slug: slugify(e.target.value),
//       slugEdited: true,
//     }));
//   };

//   // Handle thumbnail upload
//   const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         setNewCategory((prev: any) => ({ ...prev, thumbnail: ev.target?.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Cancel and reset
//   const handleCancel = () => {
//     setShowModal(false);
//     setEditingCategory(null);
//     setNewCategory({ name: "", slug: "", description: "", sortOrder: 0, parentId: "", icon: "Box", hide: false, popular: false, thumbnail: undefined });
//   };

//   // Icon preview
//   const IconComponent = (LucideIcons as any)[newCategory.icon] || LucideIcons["Box"];

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <form
//         className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
//         onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
//       >
//         <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//           {editingCategory ? "Edit Category" : "Add Category"}
//         </h3>
//         <div className="space-y-4">
//           {/* Name & Slug */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
//             <input
//               type="text"
//               required
//               value={newCategory.name}
//               onChange={handleNameChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Slug<span className="text-red-500">*</span></label>
//             <input
//               type="text"
//               required
//               value={newCategory.slug || slugify(newCategory.name)}
//               onChange={handleSlugChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary lowercase"
//             />
//           </div>
//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={newCategory.description || ""}
//               onChange={e => setNewCategory((prev: any) => ({ ...prev, description: e.target.value }))}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[60px]"
//               placeholder="Category description"
//             />
//           </div>
//           {/* 
//             Sort Order
//             This field lets you set the display order of categories in lists or menus.
//             Lower numbers appear first. For example, a category with sort order 1 will show before a category with sort order 2.
//             This is useful for controlling the sequence in which categories are shown to users.
//           */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Sort Order
//               <span className="text-xs text-gray-400 ml-2">(Lower numbers show first)</span>
//             </label>
//             <input
//               type="number"
//               value={typeof newCategory.sortOrder === 'number' ? newCategory.sortOrder : 0}
//               onChange={e => setNewCategory((prev: any) => ({ ...prev, sortOrder: Number(e.target.value) }))}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
//               placeholder="0"
//               min={0}
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Controls the order in which this category appears in lists. Lower numbers appear first.
//             </p>
//           </div>
//           {/* Icon Name & Preview */}
//           <div className="flex items-center gap-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">Icon Name</label>
//               <input
//                 type="text"
//                 value={newCategory.icon}
//                 onChange={e => setNewCategory((prev: any) => ({ ...prev, icon: e.target.value }))}
//                 className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
//                 placeholder="Box"
//               />
//             </div>
//             <div className="flex flex-col items-center justify-center mt-6">
//               <IconComponent className="h-8 w-8 text-brand-primary" />
//               <span className="text-xs text-gray-400 mt-1">Preview</span>
//             </div>
//           </div>
//           <div>
//             <a
//               href="https://lucide.dev/icons/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-brand-primary hover:underline text-sm inline-block"
//             >
//               Browse Categories Icons
//             </a>
//           </div>
//           {/* Thumbnail Upload */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleThumbnailChange}
//                 className="block"
//               />
//               {newCategory.thumbnail && (
//                 <img src={newCategory.thumbnail} alt="Thumbnail Preview" className="w-16 h-16 object-cover rounded border" />
//               )}
//             </div>
//           </div>
//           {/* Parent Category */}
//           <div>
//             <label className="block text-sm font-medium mb-1">Parent Category (optional)</label>
//             <select
//               value={newCategory.parentId}
//               onChange={e => setNewCategory((prev: any) => ({ ...prev, parentId: e.target.value }))}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
//             >
//               <option value="">None</option>
//               {categories.filter((cat: any) => !editingCategory || cat._id !== editingCategory._id).map((cat: any) => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </select>
//           </div>
//           {/* Hide & Popular Checkboxes (improved UX) */}
//           <div className="flex items-center gap-6 mt-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <span className="text-sm">Hide</span>
//               <input
//                 type="checkbox"
//                 checked={!!newCategory.hide}
//                 onChange={e => setNewCategory((prev: any) => ({ ...prev, hide: e.target.checked }))}
//                 className="form-checkbox h-5 w-5 text-brand-primary rounded focus:ring-brand-primary"
//               />
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <span className="text-sm">Popular</span>
//               <input
//                 type="checkbox"
//                 checked={!!newCategory.popular}
//                 onChange={e => setNewCategory((prev: any) => ({ ...prev, popular: e.target.checked }))}
//                 className="form-checkbox h-5 w-5 text-brand-primary rounded focus:ring-brand-primary"
//               />
//             </label>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 pt-4">
//           <button
//             type="button"
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 rounded bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold"
//           >
//             {editingCategory ? "Update Category" : "Add Category"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// // --- END CATEGORY MODAL COMPONENT ---
