"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Aos from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";

export default function SigninValidation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Aos.init({ duration: 700, once: true });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationError = {};

      if (!formData.email.trim()) {
        validationError.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        validationError.email = "Invalid email format";
      }

      if (!formData.password.trim()) {
        validationError.password = "Password is required";
      } else if (formData.password.length < 6) {
        validationError.password = "Password must be at least 6 characters";
      }

      setErrors(validationError);

      if (Object.keys(validationError).length === 0) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              email: formData.email,
              password: formData.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                apiKey: process.env.NEXT_API_KEY, // your custom header
              },
            }
          );

          const result = response.data;

          if (result.status === true) {
            localStorage.setItem("userToken", result.data);
            router.push("/site/home");
          } else {
            setErrors({ general: result.message });
          }
        } catch (error) {
          console.error("Login error:", error);
          const message =
            error.response?.data?.message || "Login failed. Please try again.";
          setErrors({ general: message });
        }
      }
    },
    [formData, router]
  );

  return (
    <div
      className="w-full mx-auto p-8 bg-gradient-to-b from-[rgba(75,2,75,0.655)] to-[rgba(213,56,213,0.852)] rounded-lg shadow-lg"
      data-aos="fade-in"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-center">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-white font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-white/70"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-300 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-white font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-white/70"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-300 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-white text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-all duration-300 flex items-center justify-center"
        >
          Continue <i className="fa fa-arrow-right ml-2" />
        </button>
      </form>
    </div>
  );
}
