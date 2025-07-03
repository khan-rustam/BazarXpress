"use client";
import React, { useEffect, useState } from "react";
import { BadgeCheck, Edit, Trash2, Plus, X, Loader2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/AdminLayout";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import ConfirmDeleteModal from '../../../components/ui/ConfirmDeleteModal';

interface Brand {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  bannerImage?: string;
  isPopular: boolean;
  showOnHome: boolean;
  status: "active" | "inactive";
  productCount?: number;
}

const defaultBrand: Brand = {
  name: "",
  slug: "",
  description: "",
  logo: "",
  bannerImage: "",
  isPopular: false,
  showOnHome: false,
  status: "active",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

export default function BrandManagementPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState<Brand>(defaultBrand);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [confirmDeleteBrand, setConfirmDeleteBrand] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch brands
  useEffect(() => {
    fetchBrands(true);
  }, []);

  async function fetchBrands(showToast = true) {
    setLoading(true);
    const toastId = toast.loading("Loading brands...");
    try {
      const res = await fetch(`${API_URL}/brands`);
      const data = await res.json();
      setBrands(data);
      if (showToast) toast.success("Brands loaded", { id: toastId });
    } catch (e) {
      toast.error("Failed to load brands", { id: toastId });
    }
    setLoading(false);
  }

  // Stats
  const total = brands.length;
  const active = brands.filter(b => b.status === "active").length;
  const inactive = brands.filter(b => b.status === "inactive").length;
  const home = brands.filter(b => b.showOnHome).length;
  const popular = brands.filter(b => b.isPopular).length;

  // Filtered brands
  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = [
    {
      label: "Total Brands",
      value: total,
      color: "text-codGray",
      iconColor: "text-brand-primary",
    },
    {
      label: "Active Brands",
      value: active,
      color: "text-green-600",
      iconColor: "text-green-500",
    },
    {
      label: "Inactive Brands",
      value: inactive,
      color: "text-red-500",
      iconColor: "text-red-400",
    },
    {
      label: "Brands on Home",
      value: home,
      color: "text-blue-500",
      iconColor: "text-blue-400",
    },
    {
      label: "Popular Brands",
      value: popular,
      color: "text-pink-500",
      iconColor: "text-pink-400",
    },
  ];

  // Modal open/close
  function openAddModal() {
    setEditingBrand(null);
    setNewBrand(defaultBrand);
    setLogoPreview("");
    setBannerPreview("");
    setShowModal(true);
  }
  function openEditModal(brand: Brand) {
    setEditingBrand(brand);
    setNewBrand({ ...brand });
    setLogoPreview(brand.logo || "");
    setBannerPreview(brand.bannerImage || "");
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setEditingBrand(null);
    setNewBrand(defaultBrand);
    setLogoPreview("");
    setBannerPreview("");
  }

  // Handle form changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === "checkbox") {
      if (name === "status") {
        fieldValue = (e.target as HTMLInputElement).checked ? "active" : "inactive";
      } else {
        fieldValue = (e.target as HTMLInputElement).checked;
      }
    }
    setNewBrand(prev => ({
      ...prev,
      [name]: fieldValue,
      slug: name === "name" ? slugify(value) : prev.slug,
    }));
    if (name === "name") {
      setNewBrand(prev => ({ ...prev, slug: slugify(value) }));
    }
  }

  // Image upload/preview
  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setLogoPreview(ev.target?.result as string);
        setNewBrand(prev => ({ ...prev, logo: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }
  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setBannerPreview(ev.target?.result as string);
        setNewBrand(prev => ({ ...prev, bannerImage: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Add/Edit Brand
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newBrand.name || !newBrand.slug) {
      toast.error("Name and slug are required");
      return;
    }
    setLoading(true);
    const toastId = toast.loading(editingBrand ? "Updating brand..." : "Adding brand...");
    try {
      let logoUrl = newBrand.logo;
      let bannerUrl = newBrand.bannerImage;
      if (logoPreview && logoPreview.startsWith("data:")) {
        const file = dataURLtoFile(logoPreview, "logo.png");
        logoUrl = await uploadToCloudinary(file, "brands");
      }
      if (bannerPreview && bannerPreview.startsWith("data:")) {
        const file = dataURLtoFile(bannerPreview, "banner.png");
        bannerUrl = await uploadToCloudinary(file, "brands");
      }
      const payload = {
        ...newBrand,
        name: newBrand.name.trim(),
        slug: newBrand.slug.trim(),
        logo: logoUrl,
        bannerImage: bannerUrl,
        status: newBrand.status, // already 'active' or 'inactive'
      };
      let res;
      if (editingBrand && editingBrand._id) {
        res = await fetch(`${API_URL}/brands/${editingBrand._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/brands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error();
      toast.success(editingBrand ? "Brand updated" : "Brand added", { id: toastId });
      closeModal();
      fetchBrands();
    } catch {
      toast.error("Failed to save brand", { id: toastId });
    }
    setLoading(false);
  }

  // Helper to convert dataURL to File
  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // Delete Brand
  async function handleDelete(brand: Brand) {
    setConfirmDeleteBrand(brand);
  }

  async function deleteImageFromCloudinary(imageUrl: string) {
    if (!imageUrl) return true;
    const res = await fetch(`${API_URL}/brands/delete-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });
    return res.ok;
  }

  async function confirmDeleteBrandAction() {
    if (!confirmDeleteBrand) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting brand...");

    try {
      // 1. Delete logo and banner images first
      const logoDeleted = await deleteImageFromCloudinary(confirmDeleteBrand.logo || "");
      const bannerDeleted = await deleteImageFromCloudinary(confirmDeleteBrand.bannerImage || "");

      if (!logoDeleted || !bannerDeleted) {
        toast.error("Failed to delete brand images. Brand not deleted.", { id: toastId });
        setDeleting(false);
        return;
      }

      // 2. Delete the brand from the database
      const res = await fetch(`${API_URL}/brands/${confirmDeleteBrand._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Brand deleted", { id: toastId });
      fetchBrands();
      setConfirmDeleteBrand(null);
    } catch {
      toast.error("Failed to delete brand", { id: toastId });
    }
    setDeleting(false);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-codGray mb-1">Brands Management</h2>
            <p className="text-gray-500 text-base mb-2">Manage your store's brands, logos, and homepage highlights</p>
          </div>
          <button
            className="bg-brand-primary hover:bg-brand-primary-dark text-text-inverse px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            onClick={openAddModal}
          >
            <Plus className="h-4 w-4" />
            <span>Add Brands</span>
          </button>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow p-6 flex items-center justify-between border border-gray-100">
              <div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <Tag className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
          ))}
        </div>
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-gray-400"><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></span>
            <input
              type="text"
              placeholder="Search brands..."
              className="flex-1 border-none outline-none bg-transparent text-base"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Brand Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-brand-primary" />
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">No brands found.</div>
          ) : (
            filteredBrands.map(brand => (
              <div
                key={brand._id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-gray-100 relative group transition-all duration-200 w-full max-w-xs mx-auto sm:max-w-none sm:p-5 hover:shadow-lg focus-within:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-50 border flex items-center justify-center overflow-hidden">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="object-contain w-full h-full aspect-square" />
                    ) : (
                      <BadgeCheck className="h-8 w-8 text-brand-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg text-codGray flex items-center gap-2 truncate">
                      {brand.name}
                      {brand.isPopular && <BadgeCheck className="h-4 w-4 text-pink-500" />}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{brand.slug}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{brand.description}</div>
                <div className="flex gap-2 items-center text-xs flex-wrap">
                  <span className="bg-gray-100 rounded px-2 py-0.5">{brand.productCount || 0} products</span>
                  <span className={`rounded px-2 py-0.5 ${brand.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-400"}`}>{brand.status === "active" ? "Active" : "Inactive"}</span>
                  {brand.isPopular && <span className="bg-pink-100 text-pink-600 rounded px-2 py-0.5">Popular</span>}
                </div>
                <div className="flex gap-2 absolute top-3 right-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  <button className="p-2 rounded-full hover:bg-brand-primary/10 focus:bg-brand-primary/10" onClick={() => openEditModal(brand)}><Edit className="h-4 w-4" /></button>
                  <button className="p-2 rounded-full hover:bg-red-100 focus:bg-red-100" onClick={() => handleDelete(brand)}><Trash2 className="h-4 w-4 text-red-500" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-md mx-2 md:mx-0 p-0 relative flex flex-col max-h-[95vh] overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-primary/90 to-brand-primary/60">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-6 w-6 text-white/80" />
                  <span className="text-lg font-bold text-white tracking-wide">{editingBrand ? "Edit Brand" : "Add Brand"}</span>
                </div>
                <button onClick={closeModal} className="rounded-full p-2 hover:bg-white/20 transition-colors"><X className="h-6 w-6 text-white" /></button>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={newBrand.name}
                      onChange={handleChange}
                      className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="slug"
                      value={newBrand.slug}
                      onChange={handleChange}
                      className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newBrand.description}
                      onChange={handleChange}
                      className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all min-h-[60px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo <span className="text-red-500">*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block mt-1 w-full"
                    />
                    {logoPreview && (
                      <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 object-cover rounded border" />
                        <button type="button" className="text-red-500 text-xs" onClick={() => { setLogoPreview(""); setNewBrand(prev => ({ ...prev, logo: "" })); }}>Remove</button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="block mt-1 w-full"
                    />
                    {bannerPreview && (
                      <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <img src={bannerPreview} alt="Banner Preview" className="w-32 h-16 object-cover rounded border" />
                        <button type="button" className="text-red-500 text-xs" onClick={() => { setBannerPreview(""); setNewBrand(prev => ({ ...prev, bannerImage: "" })); }}>Remove</button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="isPopular" checked={newBrand.isPopular} onChange={handleChange} />
                      <span>Popular</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="status" checked={newBrand.status === "active"} onChange={handleChange} />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="showOnHome" checked={newBrand.showOnHome} onChange={handleChange} />
                      <span>Show on Home Page</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingBrand ? "Update Brand" : "Add Brand")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        <ConfirmDeleteModal
          open={!!confirmDeleteBrand}
          title="Delete Brand?"
          description={
            <div>
              <div className="font-semibold">{confirmDeleteBrand?.name}</div>
              {confirmDeleteBrand?.logo && (
                <img src={confirmDeleteBrand.logo} alt={confirmDeleteBrand.name} className="mx-auto my-2 w-16 h-16 object-cover rounded" />
              )}
              <div className="text-gray-500 text-sm">{confirmDeleteBrand?.description}</div>
              <div className="mt-2 text-red-600 font-medium">
                You must delete the brand images first. This action cannot be undone.
              </div>
            </div>
          }
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleting}
          onConfirm={confirmDeleteBrandAction}
          onCancel={() => setConfirmDeleteBrand(null)}
        />
      </div>
    </AdminLayout>
  );
} 