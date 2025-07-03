"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length > 0) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await axios.get(`/api/search?q=${encodeURIComponent(value)}`);
          setSuggestions(res.data);
        } catch {
          setSuggestions({ products: [], categories: [] });
        }
        setLoading(false);
        setShowDropdown(true);
      }, 300);
    } else {
      setSuggestions({ products: [], categories: [] });
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: any, type: "product" | "category") => {
    setShowDropdown(false);
    setQuery("");
    if (type === "product") {
      router.push(`/products/${item.id}`);
    } else {
      router.push(`/categories/${item.id}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 0) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Search products or categories"
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      {loading && <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">Loading...</span>}
      {showDropdown && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-80 overflow-y-auto">
          {suggestions.categories.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500">Categories</div>
              {suggestions.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => handleSelect(cat, "category")}
                >
                  {cat.name}
                </div>
              ))}
            </>
          )}
          {suggestions.products.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500">Products</div>
              {suggestions.products.map((prod) => (
                <div
                  key={prod.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => handleSelect(prod, "product")}
                >
                  {prod.name}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </form>
  );
} 