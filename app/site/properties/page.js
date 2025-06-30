"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProperties } from "../../store/propertiesSlice";
import PropertyCard from "../Cards/propertyCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function PropertiesPage() {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.properties);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchProperties());
   
  }, [dispatch]);
 console.log("Fetching properties...");
    console.log("Properties data in page:", properties);
  // Get unique statuses for tabs
  const uniqueStatuses = [
    "all",
    ...new Set(
      properties
        .map((p) => p.status?.toLowerCase().trim())
        .filter(Boolean)
        .sort()
    ),
  ];

  // Filter properties based on active tab
  const filteredProperties =
    activeTab === "all"
      ? properties
      : properties.filter(
          (property) => property.status?.toLowerCase().trim() === activeTab
        );

  // Loading state with skeleton screens
  if (loading) {
    return (
      <section className="pt-32 pb-20 px-4 container mx-auto">
        <div className="text-center mb-16">
          <Skeleton height={60} width={300} className="mx-auto" />
          <Skeleton height={30} width={500} className="mx-auto mt-4" />
        </div>

        {/* Skeleton tabs */}
        <div className="flex justify-center mb-12 flex-wrap gap-2">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} height={40} width={100} className="rounded-lg" />
          ))}
        </div>

        {/* Skeleton property grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-xl overflow-hidden shadow-md">
              <Skeleton height={200} />
              <div className="p-6">
                <Skeleton height={24} width="80%" />
                <Skeleton height={20} width="60%" className="mt-2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Skeleton height={16} count={3} />
                  <Skeleton height={16} count={3} />
                </div>
                <Skeleton height={40} className="mt-6 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="pt-32 pb-20 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[rgb(0,48,85)]">
            Properties
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium text-[rgb(0,48,85)] opacity-90">
            Explore investment opportunities, and own a piece of the property you like.
          </p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading properties
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || error.toString()}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => dispatch(fetchProperties())}
                  className="text-sm font-medium text-red-800 hover:text-red-700 focus:outline-none"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <section className="pt-32 pb-20 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[rgb(0,48,85)]">
            Properties
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium text-[rgb(0,48,85)] opacity-90">
            Explore investment opportunities, and own a piece of the property you like.
          </p>
        </div>
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No properties available
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Currently there are no properties listed. Please check back later or
            contact us for more information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-20 px-4 container mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[rgb(0,48,85)]">
          Properties
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-medium text-[rgb(0,48,85)] opacity-90">
          Explore investment opportunities, and own a piece of the property you
          like.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12 flex-wrap gap-2">
        {uniqueStatuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === status
                ? "bg-[rgb(0,48,85)] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } capitalize`}
            onClick={() => setActiveTab(status)}
          >
            {status === "all" ? "All" : status.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      {/* Property Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No properties match your filter
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try selecting a different status or check back later for new listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
  const firstImage =
    property.images && property.images.length > 0
      ? `${API_URL}/storage${property.images[0].image_path}`
      : "/placeholder.jpg"; // fallback image

  return (
    <PropertyCard
      key={property.id}
      id={property.id}
      title={property.title}
      price={property.price}
      type={property.type}
      location={property.location}
      bedrooms={property.bedrooms}
      bathrooms={property.bathrooms}
      furnished={property.furnished}
      amenities={property.amenities}
      image={firstImage}
      status={property.status}
      rent_amount={property.rent_amount}
      area={property.area}
    />
  );
})}

        </div>
      )}
    </section>
  );
}

export default PropertiesPage;