import React, { useEffect, useState } from "react";
import Select from "react-select";
import http from "../service/http";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../service/api";
import { Trash } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [oemOptions, setOemOptions] = useState([]);
  const [activeOemIndex, setActiveOemIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // const [form, setForm] = useState({
  //   product_category_id: "",
  //   name: "",
  //   description: "",
  //   price: "",
  //   stock: "",
  //   status: true,
  //   images: [], // new images
  //   existingImages: [], // existing db images
  //   deleteImageIds: [], // ids to delete
  //   oems: [{ name: "", email: "" }],
  // });

  const [form, setForm] = useState({
    product_category_id: "",
    product_sub_category_id: "",
    name: "",
    description: "",
    modelNumber: "",
    partNumber: "",
    price: "",
    stock: "",
    status: true,
    images: [],
    existingImages: [],
    deleteImageIds: [],
    additionalDoc: null,
    name_plate_text: "",
    name_plate_image: null,
    oems: [
      {
        name: "",
        email: "",
        phone: "",
        oem_id: "",
        head_office_address: "",
      },
    ],
  });

  const [preview, setPreview] = useState([]);

  /* ================= FETCH CATEGORIES ================= */
  // useEffect(() => {
  //   http.get("/product-categories").then((res) => {
  //     if (res.data.status) setCategories(res.data.data);
  //   });
  // }, []);

  const [subCategories, setSubCategories] = useState([]);
  const [namePlateType, setNamePlateType] = useState("text");

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await http.get("/equipments");

        if (res.data?.status) {
          const options = res.data.data.map((item) => ({
            value: item.id,
            label: item.equipment_name,
            children: item.children || [],
          }));

          setCategories(options);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchEquipments();
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

        // setForm({
        //   product_category_id: product.product_category_id || "",
        //   name: product.name || "",
        //   description: product.description || "",
        //   price: product.price || "",
        //   stock: product.stock || "",
        //   status: product.status === 1,
        //   images: [],
        //   existingImages: product.images || [],
        //   deleteImageIds: [],
        //   oems:
        //     Array.isArray(product.oems) && product.oems.length
        //       ? product.oems.map((o) => ({
        //           name: o.name || "",
        //           email: o.email || "",
        //         }))
        //       : [{ name: "", email: "" }],
        // });

        setForm({
          product_category_id: product.product_category_id || "",
          product_sub_category_id: product.product_sub_category_id || "",
          name: product.name || "",
          description: product.description || "",
          modelNumber: product.modelNumber || "",
          partNumber: product.partNumber || "",
          price: product.price || "",
          stock: product.stock || "",
          status: product.status === 1,
          images: [],
          existingImages: product.images || [],
          deleteImageIds: [],
          additionalDoc: null,

          name_plate_type: product.name_plate_type || "text",

          name_plate_text: product.name_plate_text || "",

          name_plate_image: product.name_plate_image || null,

          oems:
            product.oems?.length > 0
              ? product.oems.map((o) => ({
                  name: o.name || "",
                  email: o.email || "",
                  phone: o.phone || "",
                  oem_id: o.oem_id || "",
                  head_office_address: o.address || "",
                }))
              : [
                  {
                    name: "",
                    email: "",
                    phone: "",
                    oem_id: "",
                    head_office_address: "",
                  },
                ],
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
    updated[index] = {
      name: oem.full_name,
      email: oem.email,
      phone: oem.mobile_number,
      oem_id: oem.id,
      head_office_address: oem.head_office_address,
    };
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

  useEffect(() => {
    if (form.product_category_id && categories.length) {
      const selectedCategory = categories.find(
        (c) => c.value === form.product_category_id,
      );

      if (selectedCategory?.children) {
        const subOptions = selectedCategory.children.map((sub) => ({
          value: sub.id,
          label: sub.equipment_name,
        }));

        setSubCategories(subOptions);
      }
    }
  }, [form.product_category_id, categories]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("product_category_id", form.product_category_id);
    formData.append("product_sub_category_id", form.product_sub_category_id);

    formData.append("modelNumber", form.modelNumber);
    formData.append("partNumber", form.partNumber);

    // NamePlate
    if (namePlateType === "text") {
      formData.append("name_plate_type", "text");
      formData.append("name_plate_text", form.name_plate_text || "");
    } else {
      formData.append("name_plate_type", "image");
      if (form.name_plate_image instanceof File) {
        formData.append("name_plate_image", form.name_plate_image);
      }
    }

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

    // Additional Doc
    if (form.additionalDoc) {
      formData.append("additionalDoc", form.additionalDoc);
    }

    // OEM FULL DATA
    form.oems.forEach((oem, i) => {
      formData.append(`oems[${i}][name]`, oem.name);
      formData.append(`oems[${i}][email]`, oem.email);
      formData.append(`oems[${i}][phone]`, oem.phone);
      formData.append(`oems[${i}][oem_id]`, oem.oem_id);
      formData.append(
        `oems[${i}][head_office_address]`,
        oem.head_office_address,
      );
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
        navigate("/dashboard/manage-products");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  console.log("subcategory:-", subCategories);

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
            options={categories}
            value={categories.find(
              (opt) => opt.value === form.product_category_id,
            )}
            components={{ IndicatorSeparator: () => null }}
            onChange={(selected) => {
              setForm({
                ...form,
                product_category_id: selected?.value || "",
                product_sub_category_id: "",
              });

              if (selected?.children) {
                const subOptions = selected.children.map((sub) => ({
                  value: sub.id,
                  label: sub.equipment_name,
                }));
                setSubCategories(subOptions);
              } else {
                setSubCategories([]);
              }
            }}
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Sub Category
          </label>
          <Select
            options={subCategories}
            value={subCategories.find(
              (opt) => opt.value === form.product_sub_category_id,
            )}
            components={{ IndicatorSeparator: () => null }}
            onChange={(selected) =>
              setForm({
                ...form,
                product_sub_category_id: selected?.value || "",
              })
            }
          />
        </div>

        {/* NAME */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Equipment Name
          </label>
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
        {/* <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div> */}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Model Number
          </label>
          <input
            type="text"
            name="modelNumber"
            value={form.modelNumber}
            onChange={handleChange}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Part Number
          </label>
          <input
            type="text"
            name="partNumber"
            value={form.partNumber}
            onChange={handleChange}
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-2">Name Plate</label>

          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => setNamePlateType("text")}
              className={`px-4 py-1 rounded ${
                namePlateType === "text"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setNamePlateType("image")}
              className={`px-4 py-1 rounded ${
                namePlateType === "image"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Image
            </button>
          </div>

          {namePlateType === "text" ? (
            <input
              type="text"
              value={form.name_plate_text}
              placeholder="Name Plate Text"
              onChange={(e) =>
                setForm({ ...form, name_plate_text: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name_plate_image: e.target.files[0],
                  })
                }
              />

              {typeof form.name_plate_image === "string" && (
                <img
                  src={`${baseURL}/${form.name_plate_image}`}
                  className="w-24 mt-2"
                />
              )}
            </>
          )}
        </div>

        <div className="mt-4">
          <label>Additional Document</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setForm({ ...form, additionalDoc: e.target.files[0] })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* OEM UI (same style kept) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Manufacturers
          </label>
          <div className="space-y-3">
            {form.oems.map((oem, i) => {
              const suggestions =
                activeOemIndex === i ? filterOems(oem.name || oem.email) : [];

              return (
                <div key={i} className="relative flex flex-col gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={oem.name}
                      onFocus={() => setActiveOemIndex(i)}
                      onChange={(e) =>
                        handleOemChange(i, "name", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Manufacturer Name"
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
                    placeholder="Manufacturer Email"
                  />

                  <div className="flex-1">
                    <input
                      type="tel"
                      placeholder="Manufacturer Phone"
                      value={oem.phone}
                      onFocus={() => setActiveOemIndex(i)}
                      onChange={(e) =>
                        handleOemChange(i, "phone", e.target.value)
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Manufacturer Address"
                      value={oem.head_office_address}
                      onFocus={() => setActiveOemIndex(i)}
                      onChange={(e) =>
                        handleOemChange(
                          i,
                          "head_office_address",
                          e.target.value,
                        )
                      }
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>

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
              + Add Manufacturer
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

        <label className="block text-gray-700 font-medium mb-2">
          Product Images (Optional)
        </label>
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
