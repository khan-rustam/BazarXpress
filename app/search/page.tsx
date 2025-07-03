"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length > 0) {
      setLoading(true);
      axios.get(`/api/search?q=${encodeURIComponent(q)}`).then((res) => {
        setResults(res.data);
        setLoading(false);
      });
    }
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Search results for "{q}"</h1>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Categories</h2>
            {results.categories.length === 0 ? (
              <div className="text-gray-500">No categories found.</div>
            ) : (
              <ul>
                {results.categories.map((cat) => (
                  <li key={cat.id}>{cat.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Products</h2>
            {results.products.length === 0 ? (
              <div className="text-gray-500">No products found.</div>
            ) : (
              <ul>
                {results.products.map((prod) => (
                  <li key={prod.id}>{prod.name}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
} 