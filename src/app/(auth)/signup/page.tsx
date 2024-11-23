"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [errors, setErrors] = useState<{ fullname?: string; username?: string; email?: string; password?: string; avatar?: string }>({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      const file = files[0];
      if (file && !file.type.startsWith("image/")) {
        setErrors({ ...errors, avatar: "Only image files are allowed." });
      } else {
        setErrors({ ...errors, avatar: null });
      }
      setFormData({ ...formData, avatar: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: { fullname?: string; username?: string; email?: string; password?: string; avatar?: string } = {};
    if (!formData.fullname) newErrors.fullname = "Full name is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email is required.";
    if (
      !formData.password ||
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password)
    )
      newErrors.password =
        "Password must be at least 6 characters long and include an uppercase letter.";
    if (formData.avatar && !formData.avatar.type.startsWith("image/"))
      newErrors.avatar = "Only image files are allowed.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const response = await axios.post("/api/user/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("User registered successfully!");
      router.push("/signin");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-black bg-opacity-50 p-10 rounded-xl backdrop-filter backdrop-blur-lg shadow-2xl"
      >
        <div>
          <h2 className="text-center text-4xl font-extrabold text-white">
            Join Us
          </h2>
          <p className="text-center text-sm text-gray-300 mt-2">
            Create your account and start collecting testimonials
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { name: "fullname", label: "Full Name", type: "text" },
            { name: "username", label: "Username", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "password", label: "Password", type: "password" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm text-gray-400">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-md text-sm border ${
                  errors[name] ? "border-red-500" : "border-gray-700"
                } bg-gray-800 placeholder-gray-400 text-white focus:ring-2 ${
                  errors[name]
                    ? "focus:ring-red-500 focus:border-red-500"
                    : "focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder={`Enter your ${label}`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="avatar" className="block text-sm text-gray-400">
              Avatar
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-md text-sm border border-gray-700 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Create Account"}
          </motion.button>
        </form>
        <div className="text-center">
          <Link
            href="/signin"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
};

export default Signup;
