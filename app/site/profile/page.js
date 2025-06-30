"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ;
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [investment , setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    setLoading(false);
    return;
  }

  const fetchData = async () => {
    try {
      const [investmentsRes, profileRes] = await Promise.all([
        axios.get(`${NEXT_PUBLIC_API_URL}/api/properties/sale/my-investments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            apiKey: "1234",
          },
        }),
        axios.get(`${NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            apiKey: "1234",
          },
        }),
      ]);

      setInvestment(investmentsRes.data);
      setUser(profileRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setInvestment(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 mt-6">You're not signed in</h2>
        <p className="text-gray-500 mt-2">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <Image
          src={user.image || "/default (1).png"}
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full mx-auto border-4 border-purple-500 shadow-md"
        />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">{user.first_name + " " + user.last_name || "Unknown User"}</h1>
        <p className="text-gray-600 text-sm mt-1">{user.email || "No email provided"}</p>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500">Thanks for being part of our platform.</p>
        </div>
      </div>
    </div>
  );
}
