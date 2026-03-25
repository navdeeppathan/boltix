import React, { useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";

import { baseURL } from "../service/api";
import http from "../service/http";

const ProductList = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingdelete, setLoadingdelete] = useState(null);

  const user = JSON.parse(localStorage.getItem("userData"));
  const user_id = user?.id;
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/products/user/${user_id}`);
      if (response.data.status && Array.isArray(response.data.data)) {
        console.log("products:-", response.data.data);
        setProducts(response.data.data);
      } else {
        console.error("Unexpected API structure", response.data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoadingdelete(id);
      try {
        const res = await http.delete(`/products/${id}`);
        if (res.data.status) {
          Swal.fire(
            "Deleted!",
            res.data.message || "Product has been deleted.",
            "success",
          );
          fetchProducts();
          // Optionally redirect
          // navigate("/products");
        }
      } catch (err) {
        Swal.fire(
          "Error!",
          err?.response?.data?.error || "Something went wrong",
          "error",
        );
      } finally {
        setLoadingdelete(null);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Product List</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/dashboard/add-products")}
        >
          Add Product
        </button>
      </div>
      <div className="w-full max-w-sm sm:max-w-3xl md:max-w-4xl lg:max-w-5xl  bg-gray-50">
        {/* Table View (Always visible on desktop, toggleable on mobile) */}
        <div className={`w-full bg-white rounded-lg shadow overflow-hidden`}>
          <div
            className="overflow-x-auto overflow-y-auto max-h-screen relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            style={{
              scrollbarWidth: "thin", // Firefox
            }}
          >
            <style>
              {`
            /* Chrome, Edge, Safari */
            ::-webkit-scrollbar {
                width: 3px;
                height: 2px;
            }
            ::-webkit-scrollbar-track {
                background: #f3f4f6; /* Tailwind gray-100 */
                border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb {
                background-color: #9ca3af; /* Tailwind gray-400 */
                border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: #6b7280; /* Tailwind gray-500 */
            }
            `}
            </style>

            <table className="w-full min-w-max">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-200 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    No
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Price (£)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="inline-flex items-center justify-center">
                        <RotatingLines
                          strokeColor="#1E1E1E"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="20"
                          visible={true}
                        />
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {index + 1}
                      </td>

                      {/* Image */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {/* {product.image ? (
                              <img
                                src={`${baseURL}/${product.image}`}
                                alt={product.name}
                                className="w-10 h-10 rounded-full object-cover border"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                No Image
                              </div>
                            )} */}
                            <div className="flex-shrink-0">
                              <ProductImageAuto
                                images={product.images}
                                name={product.name}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      {/* <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      
                    </td> */}

                      {/* Category */}
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {product.category?.name || "N/A"}
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">
                        {product.description?.length > 40
                          ? product.description.slice(0, 40) + "..."
                          : product.description || "N/A"}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        £{product.price}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {product.stock}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/edit-products/${product.id}`)
                            }
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 h-6 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 flex items-center justify-center gap-2"
                            disabled={loadingdelete === product.id}
                          >
                            {loadingdelete === product.id && (
                              <RotatingLines
                                strokeColor="#fff"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="16"
                                visible={true}
                              />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Scroll indicator for mobile */}
          <div className="lg:hidden bg-gray-100 py-2 text-center text-xs text-gray-500">
            ← Swipe to see more columns →
          </div>
        </div>
      </div>
    </>
  );
};

const ProductImageAuto = ({ images = [], name }) => {
  const [index, setIndex] = useState(0);

  // reset index if images length changes
  useEffect(() => {
    setIndex(0);
  }, [images?.length]);

  // auto slider
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [images?.length]); // IMPORTANT: only length

  const img = images?.[index]?.image;

  if (!img) {
    return (
      <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
        No Image
      </div>
    );
  }

  return (
    <img
      src={`${baseURL}/${img}`}
      alt={name}
      className="w-10 h-10 rounded-full object-cover border transition-all duration-300"
    />
  );
};

export default ProductList;
