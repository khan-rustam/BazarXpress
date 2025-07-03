import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Clock } from "lucide-react";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img src={product.image} alt={product.name} className="w-full h-96 object-contain rounded-xl bg-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
          <span className="text-lg font-medium">{product.rating || "-"}</span>
          <span className="ml-4 text-gray-500">{product.unit}</span>
        </div>
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-700">Brand: {typeof product.brand === 'object' && product.brand ? product.brand.name : product.brand}</span><br/>
          <span className="text-gray-700">Category: {typeof product.category === 'object' && product.category ? product.category.name : product.category}</span>
        </div>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Product Details</h2>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Clock className="w-4 h-4 mr-1" />
            <span>Delivery: {product.deliveryTime || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 