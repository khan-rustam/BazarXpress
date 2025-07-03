"use client";
import ProductForm from "../ProductForm";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProductPage() {
  const router = useRouter();

  async function handleSave(product: any) {
    let imageUrl = product.mainImage;
    // If mainImage is a base64 string, upload to Cloudinary
    if (imageUrl && imageUrl.startsWith("data:")) {
      const folder = `products/${product.category}/${product.slug}`;
      const file = base64ToFile(imageUrl, `${product.slug || "product"}.jpg`);
      imageUrl = await uploadToCloudinary(file, folder);
    }
    // Map frontend fields to backend fields
    const payload = {
      ...product,
      image: imageUrl || "/placeholder.png",
      warehouse: product.warehouseLocation,
      tax: product.taxClass, // Only if you have tax ObjectId, otherwise remove
    };
    delete payload.mainImage;
    delete payload.galleryImages;
    delete payload.warehouseLocation;
    delete payload.taxClass;
    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create product");
      toast.success("Product created successfully!");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (err) {
      toast.error("Error creating product: " + (err.message || "Unknown error"));
    }
  }

  return (
    <AdminLayout>
      <ProductForm
        onSave={handleSave}
        onCancel={() => router.push("/admin/products")}
        initialData={null}
      />
      <toast.Container position="top-right" autoClose={2000} />
    </AdminLayout>
  );
} 