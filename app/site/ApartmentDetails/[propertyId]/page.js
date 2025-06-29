"use client";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import ImgGallery from "../../../componenets/img-gallary/imgGallary";
import Link from "next/link";
import Rent from "../../home/Rent";
import {
  fetchApartmentDetails,
  clearApartmentDetails,
} from "../../../store/apartmentDetailsSlice";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaShareAlt,
  FaHeart,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
// import ShareModal from "../../../componenets/ShareModal";
// import FavoriteButton from "../../../componenets/FavoriteButton";
// import ProgressBar from "../../../componenets/ProgressBar";
import InvestmentWidget from "./InvestmentWidget";
export default function PropertyDetails() {
  const params = useParams();
  const propertyId = params.propertyId;
  const dispatch = useDispatch();
  const {
    apartment: property,
    loading,
    error,
  } = useSelector((state) => state.apartmentDetails);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  console.log(
    "PropertyDetails component initialized with propertyId:",
    property
  );
  useEffect(() => {
    if (propertyId && propertyId !== "undefined") {
      dispatch(fetchApartmentDetails(propertyId));
    } else {
      console.warn("Invalid propertyId", propertyId);
    }

    return () => {
      dispatch(clearApartmentDetails());
    };
  }, [propertyId, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-44">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p>Error loading property details: {error}</p>
          <button
            onClick={() => dispatch(fetchApartmentDetails(propertyId))}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="text-center py-44">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md mx-auto">
          <p>Property not found.</p>
          <Link
            href="/properties"
            className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );

  // Financial calculations
  const totalPrice = property.price ?? 0;
  const totalDownPayment =
    ((property.advancement ?? 0) / 100) * (property.price ?? 0);
  const totalInstallment = totalPrice - totalDownPayment;
  const downPaymentPerPerson = property.total_shares
    ? totalDownPayment / property.total_shares
    : 0;
  const totalInstallmentPerPerson = property.total_shares
    ? totalInstallment / property.total_shares
    : 0;
  const installmentPerPerson = property.number_of_share_installment
    ? totalInstallmentPerPerson / property.number_of_share_installment
    : 0;
  const maxShares = property.is_completed
    ? property.remaining_shares ?? 0
    : property.max_shares_per_user ?? 0;
  const sharesSold = property.total_shares
    ? property.total_shares - (property.remaining_shares ?? 0)
    : 0;
  const sharePercentage = property.total_shares
    ? (sharesSold / property.total_shares) * 100
    : 0;

  const amenities =
    typeof property.amenities === "string"
      ? JSON.parse(property.amenities || "{}")
      : property.amenities || {};
  const features =
    typeof property.features === "string"
      ? JSON.parse(property.features || "{}")
      : property.features || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString("en-US", {
      style: "currency",
      currency: property.price_unit || "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <IoIosArrowForward className="mx-2" />
        <Link href="/properties" className="hover:text-blue-600">
          Properties
        </Link>
        <IoIosArrowForward className="mx-2" />
        <span className="text-gray-800 font-medium">{property.title}</span>
      </div>

      {/* Image Gallery with Floating Actions */}
      <div className="relative">
        <ImgGallery
          imgs={property.images?.map((img) => img.image_path) || []}
        />
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {/* <FavoriteButton propertyId={property.id} /> */}
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            aria-label="Share property"
          >
            <FaShareAlt className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Property Header */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-center text-gray-600 mt-1">
            <FaMapMarkerAlt className="mr-1" />
            <span>{property.location || "Location not specified"}</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {formatCurrency(property.price)}
          {property.rent_amount && (
            <span className="text-sm font-normal text-gray-500 block">
              or {formatCurrency(property.rent_amount)}/month
            </span>
          )}
        </div>
      </div>

      {/* Key Features Bar */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <FaBed className="text-blue-600 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Bedrooms</div>
            <div className="font-semibold">{property.beds || "N/A"}</div>
          </div>
        </div>
        <div className="flex items-center">
          <FaBath className="text-blue-600 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Bathrooms</div>
            <div className="font-semibold">{property.bathrooms || "N/A"}</div>
          </div>
        </div>
        <div className="flex items-center">
          <FaRulerCombined className="text-blue-600 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Area</div>
            <div className="font-semibold">
              {property.land_space || "N/A"} sqft
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-600 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Year Built</div>
            <div className="font-semibold">{property.year_built || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "features"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Features & Amenities
          </button>
          <button
            onClick={() => setActiveTab("financial")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "financial"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Financial Details
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "location"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Location
          </button>
          {property.documents?.length > 0 && (
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documents
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Property Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description || "No description available."}
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Basic Information
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>
                        <strong>Property Type:</strong>{" "}
                        {property.property_type || "N/A"}
                      </li>
                      <li>
                        <strong>Status:</strong>{" "}
                        <span className="capitalize">{property.status}</span>
                      </li>
                      <li>
                        <strong>Completion:</strong>{" "}
                        {property.is_completed
                          ? "Completed"
                          : "Under Construction"}
                      </li>
                      <li>
                        <strong>Furnished:</strong>{" "}
                        {property.is_furnished ? "Yes" : "No"}
                      </li>
                      <li>
                        <strong>Unit Number:</strong>{" "}
                        {property.unit_number || "N/A"}
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Room Information
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>
                        <strong>Rooms:</strong> {property.rooms || "N/A"}
                      </li>
                      <li>
                        <strong>Bedrooms:</strong> {property.beds || "N/A"}
                      </li>
                      <li>
                        <strong>Bathrooms:</strong>{" "}
                        {property.bathrooms || "N/A"}
                      </li>
                      <li>
                        <strong>Parking Spaces:</strong>{" "}
                        {features.parking || "N/A"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaPhone className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {property.phone || "+971500000000"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <a
                      href={`tel:${property.phone || "+971500000000"}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2"
                    >
                      <FaPhone /> Call Now
                    </a>
                    <a
                      href={`https://wa.me/${
                        property.phone || "+971500000000"
                      }`}
                      target="_blank"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp /> WhatsApp
                    </a>
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg">
                      Request More Information
                    </button>
                  </div>

                  {property.share_price && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Shares Available</h4>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{sharesSold} sold</span>
                        <span>{property.remaining_shares} remaining</span>
                      </div>

                      <InvestmentWidget
                        downPaymentPerPerson={downPaymentPerPerson}
                        installmentPerPerson={installmentPerPerson}
                        totalInstallmentPerPerson={totalInstallmentPerPerson}
                        maxShares={maxShares}
                        formatCurrency={formatCurrency}
                        propertyId={property.id}
                        
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features & Amenities Tab */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {Object.keys(features).length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3">
                    {Object.entries(features).map(([key, value]) => (
                      <li
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {Object.keys(amenities).length > 0 ? (
                  <ul className="grid grid-cols-1 gap-3">
                    {Object.entries(amenities).map(([key, value]) => (
                      <li
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No amenities listed</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Financial Details Tab */}
        {activeTab === "financial" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Pricing Details</h3>
              <ul className="space-y-3">
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Property Price</span>
                  <span className="font-medium">
                    {formatCurrency(property.price)}
                  </span>
                </li>
                {property.rent_amount && (
                  <li className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Rent Amount</span>
                    <span className="font-medium">
                      {formatCurrency(property.rent_amount)}
                    </span>
                  </li>
                )}
                {property.share_price && (
                  <li className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Share Price</span>
                    <span className="font-medium">
                      {formatCurrency(property.share_price)}
                    </span>
                  </li>
                )}
                {property.total_shares && (
                  <li className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Shares</span>
                    <span className="font-medium">{property.total_shares}</span>
                  </li>
                )}
                {property.max_shares_per_user && (
                  <li className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Max Shares</span>
                    <span className="font-medium">
                      {property.max_shares_per_user}
                    </span>
                  </li>
                )}
                {property.remaining_shares && (
                  <li className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Remaining Shares</span>
                    <span className="font-medium">
                      {property.remaining_shares}
                    </span>
                  </li>
                )}
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">ROI</span>
                  <span className="font-medium">{property.roi}%</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">
                Investment Breakdown
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-medium">
                    {formatCurrency(totalPrice)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">
                    Down Payment ({property.advancement}%)
                  </span>
                  <span className="font-medium">
                    {formatCurrency(totalDownPayment)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Installment Amount</span>
                  <span className="font-medium">
                    {formatCurrency(totalInstallment)}
                  </span>
                </li>
                {property.total_shares && (
                  <>
                    <li className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        Down Payment Per Share
                      </span>
                      <span className="font-medium">
                        {formatCurrency(downPaymentPerPerson)}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        Total Installment Per Share
                      </span>
                      <span className="font-medium">
                        {formatCurrency(totalInstallmentPerPerson)}
                      </span>
                    </li>
                    <li className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">
                        Monthly Installment Per Share
                      </span>
                      <span className="font-medium">
                        {formatCurrency(installmentPerPerson)}
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* {property.share_installment_amount && (
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Installment Plan</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: property.number_of_share_installment }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Installment {i + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(property.share_installment_amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {i === 0 ? 'Upon Signing' : `After ${i * property.share_installment_frequency} months`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}
          </div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Map Location</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-96">
                {property.latitude && property.longitude ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${property.latitude},${property.longitude}&zoom=15`}
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Location map not available
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Neighborhood</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-medium mb-2">Nearby Amenities</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Schools: 1.2km</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Shopping Mall: 0.8km</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Hospital: 2.5km</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Public Transport: 0.3km</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && property.documents?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Property Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.documents.map((doc, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {doc.name || `Document ${index + 1}`}
                      </h4>
                      <p className="text-xs text-gray-500">
                        PDF • {Math.round(doc.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.path}
                    target="_blank"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    View Document
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {/* <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        propertyTitle={property.title}
        propertyId={property.id}
      /> */}

      {/* Fixed CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 md:hidden z-50 border-t border-gray-200">
        <div className="flex gap-3">
          <a
            href={`tel:${property.phone || "+971500000000"}`}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-center flex items-center justify-center gap-2"
          >
            <FaPhone /> Call
          </a>
          <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2">
            <FaWhatsapp /> WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}
