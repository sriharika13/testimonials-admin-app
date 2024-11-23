"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TestimonialCard from "../../../components/TestimonialCard";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalTestimonials = testimonials.length;

  const handleLogout = async () => {
    try {
      await axios.get("/api/user/logout");
      toast.success("User logged out successfully!");
      router.push("/signin");
    } catch (error) {
      toast.error("Failed to logout user!");
      console.error("Error:", error.message);
    } finally {
      router.push("/signin");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/user/profile");
        setUser(response.data.user);
        setTestimonials(response.data.testimonials);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const generateEmbedCode = (testimonialId) => {
    const embedCode = `<iframe src="${process.env.NEXT_PUBLIC_BASE_URL}/embed/testimonial/${testimonialId}" width="100%" height="200" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black">
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gradient bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Your Profile
        </h2>

        {user && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg mb-10">
            <div className="flex items-center space-x-6">
              <Image
                src={user.avatarUrl}
                alt="User Photo"
                width={150}
                height={150}
                className="rounded-full border-4 border-gray-600"
              />
              <div className="flex-grow">
                <h3 className="text-3xl font-bold text-white">
                  {user.fullname}
                </h3>
                <p className="text-gray-300 mt-1">{user.email}</p>
                <p className="text-gray-400 mt-2">
                  Total Reviews: {totalTestimonials}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <FaFacebook className="text-blue-500 text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer" />
                  <FaLinkedinIn className="text-blue-700 text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer" />
                  <FaTwitter className="text-blue-400 text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/getTestimonials">
            <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
              Get Testimonials
            </button>
          </Link>
          <Link href="/getWallOfLove">
            <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
              Wall of Love
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-12"></div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-gradient bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Toaster />
    </div>
  );
}

export default ProfilePage;