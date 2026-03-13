import React, { useEffect, useState } from "react";
import Select from "react-select";
import http from "../../service/http";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../service/api";
import { Trash } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [oemOptions, setOemOptions] = useState([]);
  const [activeOemIndex, setActiveOemIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    product_category_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    status: true,
    images: [], // new images
    existingImages: [], // existing db images
    deleteImageIds: [], // ids to delete
    oems: [{ name: "", email: "" }],
  });

  const [preview, setPreview] = useState([]);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    http.get("/product-categories").then((res) => {
      if (res.data.status) setCategories(res.data.data);
    });
  }, []);

  /* ================= FETCH OEM OPTIONS ================= */
  useEffect(() => {
    http.get("/oems").then((res) => {
      if (res.data.status) setOemOptions(res.data.data);
    });
  }, []);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await http.get(`/products/edit/${id}`);
        const product = res.data.data;

        setForm({
          product_category_id: product.product_category_id || "",
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          status: product.status === 1,
          images: [],
          existingImages: product.images || [],
          deleteImageIds: [],
          oems:
            Array.isArray(product.oems) && product.oems.length
              ? product.oems.map((o) => ({
                  name: o.name || "",
                  email: o.email || "",
                }))
              : [{ name: "", email: "" }],
        });
      } catch {
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= BASIC CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  /* ================= OEM ================= */
  const filterOems = (value) => {
    if (!value) return [];
    return oemOptions.filter(
      (o) =>
        o.full_name?.toLowerCase().includes(value.toLowerCase()) ||
        o.email?.toLowerCase().includes(value.toLowerCase()),
    );
  };

  const selectOem = (index, oem) => {
    const updated = [...form.oems];
    updated[index] = { name: oem.full_name, email: oem.email };
    setForm((p) => ({ ...p, oems: updated }));
    setActiveOemIndex(null);
  };

  const handleOemChange = (index, field, value) => {
    const updated = [...form.oems];
    updated[index][field] = value;
    setForm((p) => ({ ...p, oems: updated }));
  };

  const addOem = () => {
    setForm((p) => ({ ...p, oems: [...p.oems, { name: "", email: "" }] }));
  };

  const removeOem = (index) => {
    setForm((p) => ({ ...p, oems: p.oems.filter((_, i) => i !== index) }));
  };

  /* ================= NEW IMAGES ================= */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((p) => ({ ...p, images: files }));
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  /* ================= DELETE EXISTING IMAGE ================= */
  const removeExistingImage = (imgId) => {
    setForm((p) => ({
      ...p,
      existingImages: p.existingImages.filter((i) => i.id !== imgId),
      deleteImageIds: [...p.deleteImageIds, imgId],
    }));
  };

  /* ================= SUBMIT ================= */
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

    form.images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images[]", file);
      }
    });
    form.deleteImageIds.forEach((id) =>
      formData.append("delete_image_ids[]", id),
    );

    form.oems.forEach((oem, i) => {
      formData.append(`oems[${i}][name]`, oem.name);
      formData.append(`oems[${i}][email]`, oem.email);
    });

    try {
      // const res = await http.put(`/products/${id}`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      const res = await http.post(`/products/${id}?_method=PUT`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status) {
        toast.success("Product updated successfully");
        navigate("/manager/dashboard/manage-products");
      }
    } catch {
      toast.error("Update failed");
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
        {/* CATEGORY */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          <Select
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={
              form.product_category_id
                ? categories
                    .map((c) => ({ value: c.id, label: c.name }))
                    .find((o) => o.value === form.product_category_id)
                : null
            }
            onChange={(s) =>
              setForm({ ...form, product_category_id: s?.value || "" })
            }
          />
        </div>

        {/* NAME */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* OEM UI (same style kept) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">OEMs</label>
          <div className="space-y-3">
            {form.oems.map((oem, i) => {
              const suggestions =
                activeOemIndex === i ? filterOems(oem.name || oem.email) : [];

              return (
                <div key={i} className="relative flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={oem.name}
                      onFocus={() => setActiveOemIndex(i)}
                      onChange={(e) =>
                        handleOemChange(i, "name", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded"
                      placeholder="OEM Name"
                    />

                    {suggestions.length > 0 && (
                      <div className="absolute z-20 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-auto">
                        {suggestions.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => selectOem(i, s)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <div className="font-medium">{s.full_name}</div>
                            <div className="text-gray-500 text-xs">
                              {s.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="email"
                    value={oem.email}
                    onFocus={() => setActiveOemIndex(i)}
                    onChange={(e) =>
                      handleOemChange(i, "email", e.target.value)
                    }
                    className="flex-1 border px-3 py-2 rounded"
                    placeholder="OEM Email"
                  />

                  {form.oems.length > 1 && (
                    <button type="button" onClick={() => removeOem(i)}>
                      <Trash size={20} />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addOem}
              className="text-blue-600  cursor-pointer text-sm font-medium"
            >
              + Add OEM
            </button>
          </div>
        </div>

        {/* EXISTING IMAGES */}
        <div className="flex gap-2 flex-wrap">
          {form.existingImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`${baseURL}/${img.image}`}
                className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="bg-[#0088FF] hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-colors duration-200"
        />

        {preview?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {preview.map((p, i) => (
              <img
                key={i}
                src={p}
                className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
              />
            ))}
          </div>
        )}

        {/* STATUS */}
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

        {/* SUBMIT */}
        <div className="flex justify-end h-10">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-[#0088FF] text-white font-semibold rounded-[10px] px-6 py-2 transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading && <RotatingLines strokeColor="#FFFFFF" width="20" />}
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
