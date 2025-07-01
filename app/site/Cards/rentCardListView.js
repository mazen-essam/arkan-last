"use client";
import Image from "next/image";
import Link from "next/link";
import FavouriteButton from "../home/FavouriteButton";
import {
  FaBed,
  FaBuilding,
  FaCouch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useMemo } from "react";

export default function RentCardList({ property }) {
  // 🧠 Parse and extract amenities safely
  const amenitiesArr = useMemo(() => {
    if (!property?.amenities) return [];

    try {
      const parsed =
        typeof property.amenities === "string"
          ? JSON.parse(property.amenities)
          : property.amenities;

      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "object") return Object.values(parsed);

      return [];
    } catch (err) {
      console.error("Invalid amenities JSON:", err);
      return [];
    }
  }, [property?.amenities]);

  return (
    <div className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200">
      <Link href={`/site/ApartmentDetails/${property.id}`} className="block">
        <div className="flex flex-col md:flex-row h-full">
          {/* Property Image */}
          <div className="relative w-full md:w-2/5 h-64 md:h-auto">
            <Image
              src={property.imageUrl || "/placeholder-property.jpg"}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="absolute top-4 right-4">
              <FavouriteButton property={property} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium text-lg">
                {`${property.price?.toLocaleString() || "0"} EGP`}
              </p>
            </div>
          </div>

          {/* Property Details */}
          <div className="w-full md:w-3/5 p-6 flex flex-col">
            {/* Location */}
            <div className="flex items-center text-blue-600 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <span className="text-sm font-medium">
                {property.location || "Downtown, Cairo"}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
              {property.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < (property.rating || 4)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-2">
                ({property.reviews || 12} reviews)
              </span>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center text-gray-600">
                <FaBed className="mr-2 text-blue-500" />
                <span>
                  {property.bedrooms || 0}{" "}
                  {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBuilding className="mr-2 text-blue-500" />
                <span>{property.type || "Apartment"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCouch className="mr-2 text-blue-500" />
                <span>{property.furnished ? "Furnished" : "Unfurnished"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <span>{property.paymentPlan || "Available"}</span>
              </div>
            </div>

            {/* Amenities */}
            {amenitiesArr.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {amenitiesArr.slice(0, 4).map((item, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
                {amenitiesArr.length > 4 && (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                    +{amenitiesArr.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-6 line-clamp-2">
              {property.description ||
                "A modern and spacious property located in a prime area, perfect for families and professionals."}
            </p>

            {/* Footer with CTA */}
            <div className="mt-auto flex justify-between items-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors">
                View details <IoIosArrowForward className="ml-1" />
              </button>
              <a
                href={`/site/ApartmentDetails/${property.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
