"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import TestimonialCard from "../../../components/TestimonialCard";

function WallOfLovePage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      const userId = queryParams.get("user");

      if (!userId) {
        toast.error("User ID is required");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/testimonials/read`, {
          params: { userId },
        });
        setTestimonials(response.data.testimonials);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <ClipLoader size={60} color="#ffffff" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white px-6 md:px-12 py-10 relative overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-l from-green-400 to-blue-500 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center relative z-10"
      >
        <h1 className="text-5xl font-extrabold text-gradient bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-red-500">
          Wall of Love ❤️
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          See why creators, entrepreneurs, and teams love us!
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative z-10"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-xl shadow-lg transform transition duration-300 ${getGradientBackground(
              index
            )}`}
          >
            <TestimonialCard {...testimonial} />
          </motion.div>
        ))}
      </motion.div>

      {/* Toaster */}
      <Toaster />
    </div>
  );
}

// Function to get unique gradient backgrounds for testimonials
const getGradientBackground = (index) => {
  const gradients = [
    "bg-gradient-to-br from-pink-400 to-red-500",
    "bg-gradient-to-br from-blue-400 to-indigo-500",
    "bg-gradient-to-br from-green-400 to-teal-500",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
    "bg-gradient-to-br from-purple-400 to-fuchsia-500",
    "bg-gradient-to-br from-gray-400 to-gray-600",
  ];
  return gradients[index % gradients.length];
};

export default WallOfLovePage;
