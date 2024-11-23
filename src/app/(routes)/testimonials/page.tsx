"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

function Page() {
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPosition: "",
    customerCompany: "",
    customerSocialId: "",
    customerReview: "",
    testimonialGivenTo: "",
    rating: "",
    avatar: null,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const testimonialGivenTo = queryParams.get("testimonialGivenTo");
    setFormData((prevFormData) => ({
      ...prevFormData,
      testimonialGivenTo: testimonialGivenTo || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCustomerReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation for required fields
    if (
      !formData.customerName ||
      !formData.customerPosition ||
      !formData.customerCompany ||
      !formData.customerReview ||
      +formData.rating < 1 ||
      +formData.rating > 5
    ) {
      toast.error("Please fill all fields and ensure rating is between 1 and 5.");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      await axios.post("/api/testimonials/create", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your review submitted successfully!");
      setCustomerReviews([...customerReviews, formData]);
      setFormData({
        customerName: "",
        customerPosition: "",
        customerCompany: "",
        customerSocialId: "",
        customerReview: "",
        testimonialGivenTo: "",
        rating: "",
        avatar: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit customer review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-8"
      >
        <h2 className="text-center text-3xl font-bold text-blue-400 mb-6">
          Share Your Experience
        </h2>
        <form onSubmit={handleCustomerReviewSubmit} className="space-y-6">
          {[
            { name: "customerName", label: "Name", type: "text" },
            { name: "customerPosition", label: "Position", type: "text" },
            { name: "customerCompany", label: "Company", type: "text" },
            { name: "customerSocialId", label: "Online Presence", type: "text" },
            { name: "customerReview", label: "Your Review", type: "textarea" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-blue-300 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-3"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-3"
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Upload Avatar
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-white/5 border border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              min="1"
              max="5"
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Submit Review"}
          </button>
        </form>
      </motion.div>
      <Toaster />
    </div>
  );
}

export default Page;
