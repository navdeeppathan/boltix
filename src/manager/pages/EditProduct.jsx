import React, { useEffect, useState } from "react";
import Select from "react-select";
import http from "../../service/http";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../service/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    product_category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    status: true,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await http.get("/product-categories");
        if (res.data.status) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await http.get(`/products/edit/${id}`);
        const product = response.data.data || response.data;

        setForm({
          product_category_id: product.product_category_id || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          image: null, // file input must remain null (we handle preview separately)
          status: product.status === 1 ? true : false,
        });

        if (product.image) {
          setPreview(`${baseURL}/${product.image}`);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("product_category_id", form.product_category_id);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("status", form.status ? 1 : 0);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await http.post(`/products/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message || "Product updated successfully");
        navigate("/manager/dashboard/manage-products");
      } else {
        toast.error(res.data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <Select
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={
              form.product_category_id
                ? categories
                    .map((cat) => ({ value: cat.id, label: cat.name }))
                    .find((opt) => opt.value === form.product_category_id)
                : null
            }
            onChange={(selected) =>
              setForm({ ...form, product_category_id: selected?.value || "" })
            }
            placeholder="Select Category"
            components={{ IndicatorSeparator: () => null }}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#60a5fa" },
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#e0f2fe" : "white",
              }),
            }}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Product Image
          </label>

          <div className="flex flex-col items-start gap-3">
            <button
              type="button"
              onClick={() =>
                document.getElementById("productImageInput").click()
              }
              className="bg-[#0088FF] hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-colors duration-200"
            >
              Upload Image
            </button>

            <input
              id="productImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 sm:mt-0 w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600"
          />
          <label className="text-gray-700 font-medium">Active</label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-[#0088FF] text-white font-semibold rounded-[10px] px-6 py-2 transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading && (
              <RotatingLines
                strokeColor="#FFFFFF"
                strokeWidth="5"
                animationDuration="0.75"
                width="20"
                height={20}
                visible={true}
              />
            )}
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
