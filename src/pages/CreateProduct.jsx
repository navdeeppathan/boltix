import React, { useEffect, useState } from "react";
import Select from "react-select";
import http from "../service/http";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const [namePlateType, setNamePlateType] = useState("text"); // "text" or "image"
  const [form, setForm] = useState({
    product_category_id: "",
    product_sub_category_id: "",
    name: "",
    description: "",
    modelNumber: "",
    partNumber: "",
    price: "",
    stock: "",
    images: [],
    additionalDoc: null,
    status: true,
    oems: [{ name: "", email: "", oem_id: "", phone: "" }],
  });

  const [subCategories, setSubCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oemOptions, setOemOptions] = useState([]);

  useEffect(() => {
    const fetchOems = async () => {
      try {
        const res = await http.get("/oems");
        console.log("res:-", res);

        if (res.data.status) {
          setOemOptions(res.data.data);
        }
      } catch (e) {
        console.log("OEM fetch error", e);
      }
    };

    fetchOems();
  }, []);

  const filterOems = (value) => {
    if (!value) return [];

    return oemOptions.filter(
      (o) =>
        o.full_name?.toLowerCase().includes(value.toLowerCase()) ||
        o.email?.toLowerCase().includes(value.toLowerCase()),
    );
  };

  const [activeOemIndex, setActiveOemIndex] = useState(null);

  const selectOem = (index, oem) => {
    const updated = [...form.oems];

    updated[index] = {
      name: oem.full_name,
      email: oem.email,
      oem_id: oem.id,
      phone: oem.mobile_number,
      head_office_address: oem.head_office_address,
    };

    setForm((prev) => ({ ...prev, oems: updated }));
    setActiveOemIndex(null);
  };
  const handleOemChange = (index, field, value) => {
    const updated = [...form.oems];
    updated[index][field] = value;

    setForm((prev) => ({ ...prev, oems: updated }));
  };

  const addOem = () => {
    setForm((prev) => ({
      ...prev,
      oems: [
        ...prev.oems,
        { name: "", email: "", oem_id: "", phone: "", head_office_address: "" },
      ],
    }));
  };

  const removeOem = (index) => {
    const updated = form.oems.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, oems: updated }));
  };

  // Fetch categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await http.get("/products-categories");
  //       console.log(res.data);
  //       if (res.data.status) {
  //         setCategories(res.data.data);
  //       }
  //     } catch (err) {
  //       console.error("Error loading categories:", err);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await http.get("/equipments");

        if (response.data?.status && Array.isArray(response.data.data)) {
          const data = response.data.data;

          // setEquipmentData(data);

          // Category options
          const categoryOptions = data.map((item) => ({
            value: item.id,
            label: item.equipment_name,
            children: item.children || [],
          }));

          setCategories(categoryOptions);
        }
      } catch (error) {
        console.error("Error fetching equipment data:", error);
      }
    };

    fetchEquipments();
  }, []);
  // Handle text/number/checkbox change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      images: files,
    }));

    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const updatedPreview = [...preview];
    updatedPreview.splice(index, 1);

    const updatedImages = [...form.images];
    updatedImages.splice(index, 1);

    setPreview(updatedPreview);
    setForm((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("product_category_id", form.product_category_id);
    formData.append("product_sub_category_id", form.product_sub_category_id);
    formData.append("parent_id", user.parent_id);
    formData.append("user_id", user.id);
    formData.append("parent_id", user.parent_id);

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("modelNumber", form.modelNumber);
    formData.append("partNumber", form.partNumber);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("status", form.status ? 1 : 0);
    form.images.forEach((file) => {
      formData.append("images[]", file);
    });

    if (form.additionalDoc) {
      formData.append("additionalDoc", form.additionalDoc);
    }

    // Name Plate Logic
    if (namePlateType === "text") {
      formData.append("name_plate_type", "text");
      formData.append("name_plate_text", form.name_plate_text || "");
    } else {
      formData.append("name_plate_type", "image");
      formData.append("name_plate_image", form.name_plate_image);
    }
    form.oems.forEach((oem, i) => {
      formData.append(`oems[${i}][name]`, oem.name);
      formData.append(`oems[${i}][email]`, oem.email);
      formData.append(`oems[${i}][oem_id]`, oem.oem_id);
      formData.append(`oems[${i}][phone]`, oem.phone);
      formData.append(
        `oems[${i}][head_office_address]`,
        oem.head_office_address,
      );
    });

    try {
      const res = await http.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status) {
        toast.success(res.data.message);
        setForm({
          product_category_id: "",
          name: "",
          description: "",
          price: "",
          stock: "",
          images: [],
          oems: [{ name: "", email: "" }],
          status: true,
        });
        navigate("/dashboard/manage-products");
        setPreview(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add Your Plant Existing Equipment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Category
          </label>
          {/*<Select
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
          />*/}
          <Select
            options={categories}
            value={categories.find(
              (opt) => opt.value === form.product_category_id,
            )}
            onChange={(selected) => {
              setForm({
                ...form,
                product_category_id: selected?.value || "",
                product_sub_category_id: "", // reset subcategory
              });

              // Set subcategories based on selected category
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
            placeholder="Select Category"
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
            onChange={(selected) =>
              setForm({
                ...form,
                product_sub_category_id: selected?.value || "",
              })
            }
            placeholder="Select Sub Category"
            isDisabled={!subCategories.length}
            components={{ IndicatorSeparator: () => null }}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#60a5fa" },
              }),
            }}
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Equipment Name
          </label>
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
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* <div>
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
          </div> */}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
            Name Plate (Optional)
          </label>

          {/* Toggle Buttons */}
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

          {/* Conditional Field */}
          {namePlateType === "text" ? (
            <input
              type="text"
              name="name_plate_text"
              value={form.name_plate_text || ""}
              onChange={handleChange}
              placeholder="Enter Name Plate Text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  name_plate_image: e.target.files[0],
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          )}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-1">
            Additional Document (PDF) (optional)
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setForm({
                ...form,
                additionalDoc: e.target.files[0],
              })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Preview */}
          {form.additionalDoc && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {form.additionalDoc.name}
            </p>
          )}
        </div>

        {/* OEMs */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Manufacturers
          </label>

          <div className="space-y-3">
            {form.oems.map((oem, i) => {
              const suggestions =
                activeOemIndex === i ? filterOems(oem.name || oem.email) : [];

              return (
                <div key={i} className="space-y-1">
                  <div className="relative flex flex-col gap-2">
                    {/* NAME */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Manufacturer Name"
                        value={oem.name}
                        onFocus={() => setActiveOemIndex(i)}
                        onChange={(e) =>
                          handleOemChange(i, "name", e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded"
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

                    {/* EMAIL */}
                    <div className="flex-1">
                      <input
                        type="email"
                        placeholder="Manufacturer Email"
                        value={oem.email}
                        onFocus={() => setActiveOemIndex(i)}
                        onChange={(e) =>
                          handleOemChange(i, "email", e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>

                    {/* PHONE */}
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

                  {/* DISCLAIMER */}
                  {(oem.name || oem.email || oem.phone || oem.address) &&
                    !oem.oem_id && (
                      <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded">
                        ⚠ This manufacturer is not registered with the system,
                        request them to register.
                      </p>
                    )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addOem}
              className="text-blue-600 cursor-pointer text-sm font-medium"
            >
              + Add Manufacturer
            </button>
          </div>
        </div>

        {/* Image upload */}
        {/* Product Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Product Image (optional)
          </label>

          <div className="flex flex-col  items-start  gap-3">
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
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* {preview?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {preview.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    className="mt-3 sm:mt-0 w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                ))}
              </div>
            )} */}
            {preview?.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {preview.map((p, i) => (
                  <div key={i} className="relative">
                    <img
                      src={p}
                      className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />

                    {/* Remove Icon */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                    >
                      <Trash size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
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
            {loading ? "Submitting..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
