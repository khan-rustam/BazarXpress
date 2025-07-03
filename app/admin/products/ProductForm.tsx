"use client";
import React, { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { Switch } from "@headlessui/react";
import { Image as ImageIcon, ChevronDown, Layers, DollarSign, Ruler, Package, Camera, Globe, Truck, Shield, Star, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// Add VariantType
interface VariantType {
  sku: string;
  barcode?: string;
  price?: string | number;
  stock?: string | number;
  image?: string;
  [key: string]: any; // Add index signature for dynamic keys
}

// --- NEW VARIANT TABLE COMPONENT ---
interface VariantTableProps {
  attributes: { name: string; values: string[] }[];
  combos: string[][];
  variants: { [key: string]: any };
  setVariants: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  autoSku: boolean;
  setAutoSku: (v: boolean) => void;
  bulkPrice: string;
  setBulkPrice: (v: string) => void;
  bulkStock: string;
  setBulkStock: (v: string) => void;
}
const VariantTable: React.FC<VariantTableProps> = ({
  attributes,
  combos,
  variants,
  setVariants,
  autoSku,
  setAutoSku,
  bulkPrice,
  setBulkPrice,
  bulkStock,
  setBulkStock,
}) => {
  // Bulk set handlers
  const handleBulkSet = (field: 'price' | 'stock') => {
    setVariants(prev => {
      const updated: { [key: string]: any } = {};
      Object.keys(prev).forEach(key => {
        updated[key] = { ...prev[key], [field]: field === 'price' ? bulkPrice : bulkStock };
      });
      return updated;
    });
  };
  // Auto SKU generator
  const generateSku = (combo: string[]) => combo.map(v => v.replace(/\s+/g, '').toUpperCase()).join('-');
  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={autoSku} onChange={e => setAutoSku(e.target.checked)} />
          Auto-generate SKUs
        </label>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Bulk Price" value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} className="border px-2 py-1 rounded text-sm w-24" />
          <button type="button" className="bg-brand-primary text-white px-2 py-1 rounded text-xs" onClick={() => handleBulkSet('price')}>Set All Prices</button>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Bulk Stock" value={bulkStock} onChange={e => setBulkStock(e.target.value)} className="border px-2 py-1 rounded text-sm w-24" />
          <button type="button" className="bg-brand-primary text-white px-2 py-1 rounded text-xs" onClick={() => handleBulkSet('stock')}>Set All Stock</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {attributes.map(attr => (
                <th key={attr.name} className="px-3 py-2 font-semibold text-gray-700 border-b">{attr.name}</th>
              ))}
              <th className="px-3 py-2 font-semibold text-gray-700 border-b">SKU</th>
              <th className="px-3 py-2 font-semibold text-gray-700 border-b">Price</th>
              <th className="px-3 py-2 font-semibold text-gray-700 border-b">Stock</th>
              <th className="px-3 py-2 font-semibold text-gray-700 border-b">Image</th>
            </tr>
          </thead>
          <tbody>
            {combos.map(combo => {
              const key = combo.join('::');
              const variant = variants[key] || { sku: '', price: '', stock: '', image: null };
              return (
                <tr key={key} className="hover:bg-gray-50">
                  {combo.map((val, i) => (
                    <td key={val + i} className="px-3 py-2 border-b">{val}</td>
                  ))}
                  {/* SKU */}
                  <td className="px-3 py-2 border-b">
                    <input
                      type="text"
                      value={autoSku ? generateSku(combo) : variant.sku}
                      disabled={autoSku}
                      onChange={e => setVariants(prev => ({ ...prev, [key]: { ...variant, sku: e.target.value } }))}
                      className={`w-24 border rounded px-1 py-0.5 ${autoSku ? 'bg-gray-100 text-gray-400' : ''}`}
                    />
                  </td>
                  {/* Price */}
                  <td className="px-3 py-2 border-b">
                    <input
                      type="number"
                      value={variant.price || ''}
                      min={0}
                      onChange={e => setVariants(prev => ({ ...prev, [key]: { ...variant, price: e.target.value } }))}
                      className="w-20 border rounded px-1 py-0.5"
                    />
                  </td>
                  {/* Stock */}
                  <td className="px-3 py-2 border-b">
                    <input
                      type="number"
                      value={variant.stock || ''}
                      min={0}
                      onChange={e => setVariants(prev => ({ ...prev, [key]: { ...variant, stock: e.target.value } }))}
                      className="w-16 border rounded px-1 py-0.5"
                    />
                  </td>
                  {/* Image */}
                  <td className="px-3 py-2 border-b">
                    <div className="flex flex-col items-start gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        aria-label={`Upload image for ${key}`}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => {
                              setVariants(prev => ({ ...prev, [key]: { ...variant, image: ev.target?.result as string } }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {variant.image && (
                        <div className="mt-1 flex items-center gap-2">
                          <img src={variant.image} alt="Variant" className="w-10 h-10 object-cover rounded border" />
                          <button
                            type="button"
                            className="text-red-500 text-xs"
                            onClick={() => setVariants(prev => ({ ...prev, [key]: { ...variant, image: '' } }))}
                          >Remove</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// --- END VARIANT TABLE COMPONENT ---

// Add a reserved words list at the top of the component
const RESERVED_ATTRIBUTE_WORDS = [
  'sku', 'image', 'price', 'stock', 'barcode', 'mrp', 'cost', 'weight', 'quantity', 'qty', 'id', '_id', 'variant', 'variants', 'picture', 'photo', 'photos', 'gallery', 'mainimage', 'main_image'
];

// Utility to convert base64 to File
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function ProductForm({ onSave, onCancel, initialData }: any) {
  const [showInventory, setShowInventory] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showPhysical, setShowPhysical] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);

  // Product state
  const [product, setProduct] = useState<any>(initialData || {
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    category: "",
    subCategory: "",
    brand: "",
    tags: [],
    productType: "Simple",
    sku: "",
    hsn: "",
    stockStatus: true,
    quantity: 0,
    allowBackorders: false,
    lowStockThreshold: 0,
    warehouseLocation: "",
    mrp: 0,
    sellingPrice: 0,
    costPrice: 0,
    taxClass: "",
    priceIncludesTax: false,
    weight: 0,
    weightUnit: "kg",
    dimensions: { l: 0, w: 0, h: 0 },
    shippingClass: "",
    returnable: true,
    returnWindow: 0,
    codAvailable: true,
    variants: [],
    mainImage: null,
    galleryImages: [],
    video: "",
    model3d: null,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    canonicalUrl: "",
    fulfillmentCenter: "",
    handlingTime: 0,
    packagingType: "",
    legal: {
      hsn: "",
      batchNumber: "",
      manufacturer: "",
      warranty: "",
      certifications: [],
      safetyInfo: "",
    },
    translations: {},
    featured: false,
    bestseller: false,
    launchDate: "",
    expiryDate: "",
    linkedProducts: [],
  });

  // Category state
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Image upload/preview
  const [mainImage, setMainImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add after category/subcategory/brand state
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [autoGenerateBarcodes, setAutoGenerateBarcodes] = useState<Record<string, boolean>>({});

  // --- NEW STATE FOR DYNAMIC VARIANT MANAGEMENT ---
  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]); // [{name: 'Color', values: ['Red','Blue']}]
  const [attributeInput, setAttributeInput] = useState("");
  const [attributeValueInputs, setAttributeValueInputs] = useState<{ [attr: string]: string }>({});
  const [variants, setVariants] = useState<{ [key: string]: any }>({}); // key: 'Red::M', value: {sku, price, ...}
  const [autoSku, setAutoSku] = useState(true);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  // --- ATTRIBUTE MANAGEMENT HANDLERS ---
  const handleAddAttribute = () => {
    const name = attributeInput.trim();
    if (!name || attributes.some(a => a.name.toLowerCase() === name.toLowerCase())) return;
    setAttributes([...attributes, { name, values: [] }]);
    setAttributeInput("");
  };
  const handleRemoveAttribute = (name: string) => {
    setAttributes(attributes.filter(a => a.name !== name));
    // Remove from variants as well
    regenerateVariants(attributes.filter(a => a.name !== name));
  };
  const handleAddAttributeValue = (attr: string) => {
    const value = (attributeValueInputs[attr] || "").trim();
    if (!value) return;
    setAttributes(attrs => attrs.map(a => a.name === attr ? { ...a, values: Array.from(new Set([...a.values, ...value.split(",").map(v => v.trim()).filter(Boolean)])) } : a));
    setAttributeValueInputs(inputs => ({ ...inputs, [attr]: "" }));
  };
  const handleRemoveAttributeValue = (attr: string, value: string) => {
    setAttributes(attrs => attrs.map(a => a.name === attr ? { ...a, values: a.values.filter(v => v !== value) } : a));
    // Remove from variants as well
    regenerateVariants(attributes.map(a => a.name === attr ? { ...a, values: a.values.filter(v => v !== value) } : a));
  };

  // --- VARIANT GENERATION ---
  function cartesian(arr: string[][]): string[][] {
    return arr.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]] as string[][]);
  }
  function getVariantKey(combo: string[]): string {
    return combo.join("::");
  }
  function regenerateVariants(newAttributes = attributes) {
    const combos = cartesian(newAttributes.map(a => a.values.length ? a.values : [""]));
    setVariants(prev => {
      const newVariants: { [key: string]: any } = {};
      combos.forEach(combo => {
        const key = getVariantKey(combo);
        newVariants[key] = prev[key] || { sku: "", price: "", stock: "", image: null };
      });
      return newVariants;
    });
  }
  useEffect(() => {
    regenerateVariants();
    // eslint-disable-next-line
  }, [attributes]);

  // Fetch categories, brands, and warehouses from backend on mount
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch("http://localhost:4000/api/brands")
      .then(res => res.json())
      .then(data => setBrands(data));
    fetch("http://localhost:4000/api/warehouses")
      .then(res => res.json())
      .then(data => setWarehouses(data));
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const selected = categories.find((cat) => cat._id === product.category);
    if (selected && categories.some((cat) => cat.parentId === selected._id)) {
      setSubcategories(categories.filter((cat) => cat.parentId === selected._id));
    } else {
      setSubcategories([]);
    }
  }, [product.category, categories]);

  // On open, reset image if editing
  useEffect(() => {
    if (initialData && initialData.mainImage) setMainImage(initialData.mainImage);
    else setMainImage(null);
  }, [initialData]);

  // Validation
  const validate = () => {
    const errs: any = {};
    if (!product.name) errs.name = "Product name is required.";
    if (!product.slug) errs.slug = "Slug is required.";
    if (!product.description) errs.description = "Description is required.";
    if (!product.category) errs.category = "Category is required.";
    if (!product.brand) errs.brand = "Brand is required.";
    return errs;
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length !== 0) return;

    let imageUrl = mainImage;
    if (mainImage && mainImage.startsWith("data:")) {
      const folder = `products/${product.category}/${product.slug}`;
      const file = base64ToFile(mainImage, `${product.slug || "product"}.jpg`);
      imageUrl = await uploadToCloudinary(file, folder);
    }

    // Prepare payload for backend
    const payload: any = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.sellingPrice || 0,
      unit: product.unit || "1 kg",
      image: imageUrl,
      brand: product.brand,
      category: product.category,
      warehouse: product.warehouseLocation,
      sku: product.sku,
      // Add other required fields as needed
    };
    onSave(payload);
  };

  // Slug auto-generation logic
  useEffect(() => {
    function slugify(str: string) {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/--+/g, '-');
    }
    let base = product.name || '';
    if (product.variantAttributes && product.variantAttributes.length > 0 && product.variantValues) {
      const firstAttr = product.variantAttributes[0];
      const firstVal = product.variantValues[firstAttr]?.[0];
      if (firstVal) base += '-' + firstVal;
      if (product.variantAttributes.length > 1) {
        const secondAttr = product.variantAttributes[1];
        const secondVal = product.variantValues[secondAttr]?.[0];
        if (secondVal) base += '-' + secondVal;
      }
    }
    setProduct((prev: any) => ({ ...prev, slug: slugify(base) }));
    // eslint-disable-next-line
  }, [product.name, product.variantAttributes, product.variantValues]);

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-codGray">{initialData ? "Edit Product" : "Add Product"}</h2>
      {/* Basic Details Section */}
      <section className="rounded-xl bg-gradient-to-br from-white via-gray-50 to-brand-primary/5 p-6 shadow-md border border-brand-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-6 bg-brand-primary rounded-full" />
          <h3 className="font-bold text-lg text-brand-primary tracking-wide">Basic Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Floating label input */}
          <div className="relative">
            <input id="product-name" type="text" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} className={`peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all ${errors.name ? 'border-red-400' : 'border-gray-300'}`} placeholder=" " required />
            <label htmlFor="product-name" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Product Name <span className="text-red-500">*</span></label>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div className="relative">
            <input id="slug" type="text" value={product.slug} readOnly className={`peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all ${errors.slug ? 'border-red-400' : 'border-gray-300'}`} placeholder=" " required />
            <label htmlFor="slug" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Slug / URL <span className="text-red-500">*</span></label>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>
          <div className="md:col-span-2 relative">
            <textarea id="desc" value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} className={`peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all resize-none min-h-[80px] ${errors.description ? 'border-red-400' : 'border-gray-300'}`} placeholder=" " required />
            <label htmlFor="desc" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Description <span className="text-red-500">*</span></label>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="relative">
            <select id="category" value={product.category} onChange={e => setProduct({ ...product, category: e.target.value, subCategory: "" })} className={`w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all appearance-none ${errors.category ? 'border-red-400' : 'border-gray-300'}`} required>
              <option value="">Select Category</option>
              {categories.filter(cat => !cat.parentId).map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <label htmlFor="category" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Category <span className="text-red-500">*</span></label>
            <ChevronDown className="absolute right-2 top-8 text-gray-400 pointer-events-none" />
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div className="relative">
            <select id="subcategory" value={product.subCategory} onChange={e => setProduct({ ...product, subCategory: e.target.value })} className="w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all appearance-none" disabled={subcategories.length === 0}>
              <option value="">{subcategories.length === 0 ? "No subcategories" : "Select Subcategory"}</option>
              {subcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
            <label htmlFor="subcategory" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Sub-Category</label>
            <ChevronDown className="absolute right-2 top-8 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <div className="flex gap-2 items-center">
              <select id="brand" value={product.brand} onChange={e => {
                if (e.target.value === "__add__") setShowAddBrand(true);
                else { setProduct({ ...product, brand: e.target.value }); setShowAddBrand(false); }
              }} className={`w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all appearance-none ${errors.brand ? 'border-red-400' : 'border-gray-300'}`} required>
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
                <option value="__add__">+ Add new brand</option>
              </select>
              {showAddBrand && (
                <input className="border rounded p-2 mt-1 w-32" placeholder="New brand" value={newBrand} onChange={e => setNewBrand(e.target.value)} onBlur={() => {
                  if (newBrand.trim()) {
                    setBrands([...brands, { name: newBrand.trim() }]);
                    setProduct({ ...product, brand: newBrand.trim() });
                  }
                  setShowAddBrand(false); setNewBrand("");
                }} autoFocus />
              )}
            </div>
            <label htmlFor="brand" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Brand <span className="text-red-500">*</span></label>
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
          </div>
          <div className="relative md:col-span-2">
            <input id="tags" type="text" value={product.tags.join(", ")} onChange={e => setProduct({ ...product, tags: e.target.value.split(",").map((t: string) => t.trim()) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
            <label htmlFor="tags" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Tags (comma separated)</label>
          </div>
          <div className="relative">
            <select id="ptype" value={product.productType} onChange={e => setProduct({ ...product, productType: e.target.value })} className="w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all appearance-none">
              <option value="Simple">Simple</option>
              <option value="Variable">Variable</option>
              <option value="Digital">Digital</option>
              <option value="Subscription">Subscription</option>
            </select>
            <label htmlFor="ptype" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Product Type</label>
          </div>
        </div>
      </section>

      {/* INVENTORY & SKU */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Inventory & SKU</h3>
          <Switch checked={showInventory} onChange={setShowInventory} className={`${showInventory ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Inventory</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showInventory ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showInventory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn">
            {/* Inventory fields here (SKU, Barcode, HSN, Stock, etc.) */}
            <div className="relative">
              <input id="sku" type="text" value={product.sku} onChange={e => setProduct({ ...product, sku: e.target.value })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="sku" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">SKU</label>
            </div>
            <div className="relative">
              <input id="hsn" type="text" value={product.hsn} onChange={e => setProduct({ ...product, hsn: e.target.value })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="hsn" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">HSN Code</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={product.stockStatus} onChange={v => setProduct({ ...product, stockStatus: v })} className={`${product.stockStatus ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className="sr-only">Stock Status</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.stockStatus ? 'translate-x-6' : 'translate-x-1'}`} />
              </Switch>
              <span className="text-sm">{product.stockStatus ? "In Stock" : "Out of Stock"}</span>
            </div>
            <div className="relative">
              <input id="quantity" type="number" value={product.quantity} onChange={e => setProduct({ ...product, quantity: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="quantity" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Quantity</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={product.allowBackorders} onChange={v => setProduct({ ...product, allowBackorders: v })} className={`${product.allowBackorders ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className="sr-only">Allow Backorders</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.allowBackorders ? 'translate-x-6' : 'translate-x-1'}`} />
              </Switch>
              <span className="text-sm">Allow Backorders</span>
            </div>
            <div className="relative">
              <input id="lowStock" type="number" value={product.lowStockThreshold} onChange={e => setProduct({ ...product, lowStockThreshold: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="lowStock" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Low Stock Threshold</label>
            </div>
            <div className="relative">
              <select
                id="warehouseLocation"
                value={product.warehouseLocation}
                onChange={e => setProduct({ ...product, warehouseLocation: e.target.value })}
                className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                required
              >
                <option value="">Select Warehouse</option>
                {Array.isArray(warehouses) && warehouses.map((w: any) => (
                  <option key={w._id} value={w._id}>{w.name} ({w.address})</option>
                ))}
              </select>
              <label htmlFor="warehouseLocation" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Warehouse Location <span className="text-red-500">*</span></label>
            </div>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Pricing</h3>
          <Switch checked={showPricing} onChange={setShowPricing} className={`${showPricing ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Pricing</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPricing ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showPricing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn">
            {/* Pricing fields here (MRP, Selling Price, Discount, etc.) */}
            <div className="relative">
              <input id="mrp" type="number" value={product.mrp} onChange={e => setProduct({ ...product, mrp: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="mrp" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">MRP</label>
            </div>
            <div className="relative">
              <input id="sellingPrice" type="number" value={product.sellingPrice} onChange={e => setProduct({ ...product, sellingPrice: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="sellingPrice" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Selling Price</label>
            </div>
            <div className="relative">
              <input id="discount" type="text" value={product.mrp && product.sellingPrice ? `${Math.round(100 - (product.sellingPrice / product.mrp) * 100)}%` : ""} readOnly className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all text-gray-400" placeholder=" " />
              <label htmlFor="discount" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Discount (Auto)</label>
            </div>
            <div className="relative">
              <input id="costPrice" type="number" value={product.costPrice} onChange={e => setProduct({ ...product, costPrice: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="costPrice" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Cost Price</label>
            </div>
            <div className="relative">
              <select id="taxClass" value={product.taxClass} onChange={e => setProduct({ ...product, taxClass: e.target.value })} className="w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all appearance-none">
                <option value="">Select Tax</option>
                <option value="0">GST 0%</option>
                <option value="5">GST 5%</option>
                <option value="12">GST 12%</option>
                <option value="18">GST 18%</option>
                <option value="28">GST 28%</option>
              </select>
              <label htmlFor="taxClass" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Tax Class</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={product.priceIncludesTax} onChange={v => setProduct({ ...product, priceIncludesTax: v })} className={`${product.priceIncludesTax ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className="sr-only">Price Includes Tax</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.priceIncludesTax ? 'translate-x-6' : 'translate-x-1'}`} />
              </Switch>
              <span className="text-sm">Price Includes Tax</span>
            </div>
          </div>
        )}
      </section>

      {/* PHYSICAL ATTRIBUTES */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Physical Attributes</h3>
          <Switch checked={showPhysical} onChange={setShowPhysical} className={`${showPhysical ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Physical Attributes</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPhysical ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showPhysical && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn">
            {/* Physical fields here (Weight, Dimensions, Shipping Class, etc.) */}
            <div className="relative">
              <input id="weight" type="number" value={product.weight} onChange={e => setProduct({ ...product, weight: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="weight" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Weight</label>
            </div>
            <div className="flex gap-2">
              <input id="dimL" type="number" value={product.dimensions.l} onChange={e => setProduct({ ...product, dimensions: { ...product.dimensions, l: Number(e.target.value) } })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <input id="dimW" type="number" value={product.dimensions.w} onChange={e => setProduct({ ...product, dimensions: { ...product.dimensions, w: Number(e.target.value) } })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <input id="dimH" type="number" value={product.dimensions.h} onChange={e => setProduct({ ...product, dimensions: { ...product.dimensions, h: Number(e.target.value) } })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
            </div>
            <div className="relative">
              <input id="shippingClass" type="text" value={product.shippingClass} onChange={e => setProduct({ ...product, shippingClass: e.target.value })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="shippingClass" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Shipping Class</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={product.returnable} onChange={v => setProduct({ ...product, returnable: v })} className={`${product.returnable ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className="sr-only">Returnable</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.returnable ? 'translate-x-6' : 'translate-x-1'}`} />
              </Switch>
              <span className="text-sm">Returnable</span>
            </div>
            <div className="relative">
              <input id="returnWindow" type="number" value={product.returnWindow} onChange={e => setProduct({ ...product, returnWindow: Number(e.target.value) })} className="peer w-full border-b-2 bg-transparent px-2 pt-6 pb-2 text-base focus:outline-none focus:border-brand-primary transition-all" placeholder=" " />
              <label htmlFor="returnWindow" className="absolute left-2 top-2 text-gray-500 text-xs transition-all peer-focus:text-brand-primary peer-focus:top-0 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 pointer-events-none">Return Window (days)</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Switch checked={product.codAvailable} onChange={v => setProduct({ ...product, codAvailable: v })} className={`${product.codAvailable ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className="sr-only">COD Available</span>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.codAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
              </Switch>
              <span className="text-sm">COD Available</span>
            </div>
          </div>
        )}
      </section>

      {/* VARIANTS (Conditional) */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Variants (Conditional)</h3>
          <Switch checked={showVariants} onChange={setShowVariants} className={`${showVariants ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Variants</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showVariants ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showVariants && (
          <div className="bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn space-y-6">
            {/* Attribute Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attributes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {attributes.map(attr => (
                  <span key={attr.name} className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                    {attr.name}
                    <button type="button" onClick={() => handleRemoveAttribute(attr.name)} className="ml-1 text-xs text-red-500">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={attributeInput}
                  onChange={e => setAttributeInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "," || e.key === "Enter") { e.preventDefault(); handleAddAttribute(); } }}
                  className="border-b-2 border-brand-primary px-2 py-1 text-base focus:outline-none min-w-[80px]"
                  placeholder="Add attribute"
                />
                <button type="button" onClick={handleAddAttribute} className="ml-1 px-2 py-1 bg-brand-primary text-white rounded">+</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Add attributes (e.g. Color, Size, Material). Comma, Enter, or + to add.</p>
            </div>
            {/* Attribute Values */}
            {attributes.map(attr => (
              <div key={attr.name} className="mb-2">
                <span className="w-24 text-gray-600">{attr.name} values:</span>
                <div className="flex flex-wrap gap-1">
                  {attr.values.map(val => (
                    <span key={val} className="bg-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1 text-sm">
                      {val}
                      <button type="button" onClick={() => handleRemoveAttributeValue(attr.name, val)} className="ml-1 text-xs text-red-500">×</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={attributeValueInputs[attr.name] || ""}
                    onChange={e => setAttributeValueInputs(inputs => ({ ...inputs, [attr.name]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "," || e.key === "Enter") { e.preventDefault(); handleAddAttributeValue(attr.name); } }}
                    className="border-b-2 border-brand-primary px-2 py-1 text-base focus:outline-none min-w-[60px]"
                    placeholder={`Add ${attr.name}`}
                  />
                  <button type="button" onClick={() => handleAddAttributeValue(attr.name)} className="ml-1 px-2 py-1 bg-brand-primary text-white rounded">+</button>
                </div>
              </div>
            ))}
            {/* Variant Table */}
            {attributes.length > 0 && cartesian(attributes.map(a => a.values.length ? a.values : [""])).length > 0 && (
              <VariantTable
                attributes={attributes}
                combos={cartesian(attributes.map(a => a.values.length ? a.values : [""]))}
                variants={variants}
                setVariants={setVariants}
                autoSku={autoSku}
                setAutoSku={setAutoSku}
                bulkPrice={bulkPrice}
                setBulkPrice={setBulkPrice}
                bulkStock={bulkStock}
                setBulkStock={setBulkStock}
              />
            )}
          </div>
        )}
      </section>

      {/* MEDIA */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Media</h3>
          <Switch checked={showMedia} onChange={setShowMedia} className={`${showMedia ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Media</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMedia ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showMedia && (
          <div className="bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn space-y-4">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image (optional)</label>
              <div className="relative group cursor-pointer w-28 h-28" onClick={() => fileInputRef.current?.click()}>
                <div className={`w-28 h-28 rounded-xl border-2 border-dashed flex items-center justify-center bg-gray-50 overflow-hidden shadow ${mainImage ? '' : 'hover:border-brand-primary/60 hover:bg-brand-primary/5 transition-colors'}`}>
                  {mainImage ? (
                    <img src={mainImage} alt="Product" className="object-cover w-full h-full rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon className="h-10 w-10 mb-1" />
                      <span className="text-xs">Upload Image</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setMainImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {mainImage && (
                  <button type="button" className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-red-100" onClick={e => { e.stopPropagation(); setMainImage(null); }}>
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                )}
              </div>
            </div>
            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images (optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  const readers = files.map(file => {
                    return new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = ev => resolve(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    });
                  });
                  Promise.all(readers).then(imgs => setProduct({ ...product, galleryImages: imgs }));
                }}
                className="block mt-1"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {product.galleryImages && product.galleryImages.map((img: string, idx: number) => (
                  <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border">
                    <img src={img} alt="Gallery" className="object-cover w-full h-full" />
                    <button type="button" className="absolute top-0 right-0 bg-white/80 rounded-bl px-1 text-xs text-red-500" onClick={() => {
                      setProduct({ ...product, galleryImages: product.galleryImages.filter((_: any, i: number) => i !== idx) });
                    }}>x</button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Upload multiple images for gallery.</p>
            </div>
            {/* Video */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Video (YouTube URL or Embed, optional)</label>
              <input
                type="text"
                value={product.video || ""}
                onChange={e => setProduct({ ...product, video: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="e.g. https://youtube.com/watch?v=..."
              />
              {product.video && product.video.includes("youtube") && (
                <div className="mt-2">
                  <iframe
                    width="320"
                    height="180"
                    src={`https://www.youtube.com/embed/${product.video.split("v=")[1]}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SEO (Optional) */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">SEO (Optional)</h3>
          <Switch checked={showSEO} onChange={setShowSEO} className={`${showSEO ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable SEO</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showSEO ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showSEO && (
          <div className="bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={product.metaTitle || product.name}
                onChange={e => setProduct({ ...product, metaTitle: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="SEO Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={product.metaDescription || ""}
                onChange={e => setProduct({ ...product, metaDescription: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all min-h-[60px]"
                placeholder="SEO Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
              <input
                type="text"
                value={product.metaKeywords ? product.metaKeywords.join(", ") : ""}
                onChange={e => setProduct({ ...product, metaKeywords: e.target.value.split(",").map((k: string) => k.trim()).filter(Boolean) })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="Comma separated keywords"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={product.canonicalUrl || ""}
                onChange={e => setProduct({ ...product, canonicalUrl: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="https://example.com/product"
              />
            </div>
          </div>
        )}
      </section>

      {/* SHIPPING & FULFILLMENT (Optional) */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Shipping & Fulfillment (Optional)</h3>
          <Switch checked={showShipping} onChange={setShowShipping} className={`${showShipping ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Shipping</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showShipping ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showShipping && (
          <div className="bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment Center</label>
              <input
                type="text"
                value={product.fulfillmentCenter || ""}
                onChange={e => setProduct({ ...product, fulfillmentCenter: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="Warehouse name or ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handling Time (days)</label>
              <input
                type="number"
                value={product.handlingTime || 0}
                onChange={e => setProduct({ ...product, handlingTime: Number(e.target.value) })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
              <select
                value={product.packagingType || ""}
                onChange={e => setProduct({ ...product, packagingType: e.target.value })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              >
                <option value="">Select Packaging</option>
                <option value="Box">Box</option>
                <option value="Pouch">Pouch</option>
                <option value="Envelope">Envelope</option>
                <option value="Tube">Tube</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* LEGAL & COMPLIANCE (Optional) */}
      <section className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-brand-primary" />
          <h3 className="font-bold text-base text-brand-primary flex-1">Legal & Compliance (Optional)</h3>
          <Switch checked={showLegal} onChange={setShowLegal} className={`${showLegal ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className="sr-only">Enable Legal</span>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showLegal ? 'translate-x-6' : 'translate-x-1'}`} />
          </Switch>
        </div>
        {showLegal && (
          <div className="bg-gray-50 rounded-xl p-6 border border-brand-primary/10 mt-2 animate-fadeIn space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
              <input
                type="text"
                value={product.legal?.hsn || product.hsn || ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, hsn: e.target.value } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                type="text"
                value={product.legal?.batchNumber || ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, batchNumber: e.target.value } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Details</label>
              <input
                type="text"
                value={product.legal?.manufacturer || ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, manufacturer: e.target.value } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
              <input
                type="text"
                value={product.legal?.warranty || ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, warranty: e.target.value } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
              <input
                type="text"
                value={product.legal?.certifications ? product.legal.certifications.join(", ") : ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, certifications: e.target.value.split(",").map((c: string) => c.trim()).filter(Boolean) } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
                placeholder="e.g. BIS, ISO, FSSAI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Safety Info</label>
              <input
                type="text"
                value={product.legal?.safetyInfo || ""}
                onChange={e => setProduct({ ...product, legal: { ...product.legal, safetyInfo: e.target.value } })}
                className="w-full border-b-2 bg-transparent px-2 py-2 text-base focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors" onClick={() => onCancel?.()}>Cancel</button>
        <button type="submit" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors">Save Product</button>
      </div>
    </form>
  );
} 