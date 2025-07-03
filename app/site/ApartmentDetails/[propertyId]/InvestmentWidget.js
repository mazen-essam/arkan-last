"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaChartLine, FaLock, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

export default function InvestmentWidget({
  downPaymentPerPerson,
  installmentPerPerson,
  totalInstallmentPerPerson,
  maxShares,
  formatCurrency,
  remainingShares,
  numberOfInstallmentMonths,
  propertyId
}) {
  const [selectedShares, setSelectedShares] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const token =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  const investmentDownPayment = downPaymentPerPerson * selectedShares;
  const investmentMonthlyInstallment = installmentPerPerson * selectedShares;
  const investmentTotalCost =
    (downPaymentPerPerson + totalInstallmentPerPerson) * selectedShares;
  const percentageOwned =
    (selectedShares / (remainingShares + selectedShares)) * 100;

  const handleShareChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxShares) {
      setIsCalculating(true);
      setSelectedShares(value);
      setTimeout(() => setIsCalculating(false), 200);
    }
  };

  const incrementShares = () => {
    if (selectedShares < maxShares) {
      setIsCalculating(true);
      setSelectedShares((prev) => prev + 1);
      setTimeout(() => setIsCalculating(false), 200);
    }
  };

  const decrementShares = () => {
    if (selectedShares > 1) {
      setIsCalculating(true);
      setSelectedShares((prev) => prev - 1);
      setTimeout(() => setIsCalculating(false), 200);
    }
  };

  if (!hasMounted) return null;
  const handleInvestClick = async () => {
  const token = localStorage.getItem("userToken");

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You are about to proceed with this investment.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, review details",
  });

  if (!result.isConfirmed) return;

  const finalResult = await Swal.fire({
    title: "Review Your Investment",
    html: `
      <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
        <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <p style="margin: 0; font-weight: 600;">Selected Shares</p>
          <p style="margin: 0;">${selectedShares}</p>
        </div>
        <div style="padding: 12px; border: 1px solid #cbd5e0; border-radius: 8px; background: #ebf8ff;">
          <p style="margin: 0; font-weight: 600;">Down Payment</p>
          <p style="margin: 0;">${formatCurrency(investmentDownPayment)}</p>
        </div>
        <div style="padding: 12px; border: 1px solid #c6f6d5; border-radius: 8px; background: #f0fff4;">
          <p style="margin: 0; font-weight: 600;">Monthly Installment</p>
          <p style="margin: 0;">${formatCurrency(investmentMonthlyInstallment)}</p>
        </div>
        <div style="padding: 12px; border: 1px solid #e9d8fd; border-radius: 8px; background: #faf5ff;">
          <p style="margin: 0; font-weight: 600;">Total Investment</p>
          <p style="margin: 0;">${formatCurrency(investmentTotalCost)}</p>
        </div>
      </div>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Confirm Purchase",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#10b981",
  });

  if (!finalResult.isConfirmed) return;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties/sale`,
      {
        property_id: propertyId,
        number_of_shares: selectedShares,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apiKey: "1234",
          "Content-Type": "application/json",
        },
      }
    );

    const resData = response.data;
console.log(resData)
    if (resData.status === true) {
      Swal.fire({
  icon: "success",
  title: "Purchase Confirmed",
  html: `
    <div style="display: flex; flex-direction: column; gap: 12px; text-align: left; margin-top: 10px;">

      <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
        <p style="margin: 0; font-weight: 600;">Number of Shares</p>
        <p style="margin: 0;">${resData.data.number_of_shares}</p>
      </div>

      <div style="padding: 12px; border: 1px solid #ebf4ff; border-radius: 8px; background: #ebf8ff;">
        <p style="margin: 0; font-weight: 600;">Share Price</p>
        <p style="margin: 0;">${formatCurrency(resData.data.share_price)}</p>
      </div>

      <div style="padding: 12px; border: 1px solid #d1fae5; border-radius: 8px; background: #f0fff4;">
        <p style="margin: 0; font-weight: 600;">Advance Payment</p>
        <p style="margin: 0;">${formatCurrency(resData.data.advancement_payment)}</p>
      </div>

      <div style="padding: 12px; border: 1px solid #ede9fe; border-radius: 8px; background: #faf5ff;">
        <p style="margin: 0; font-weight: 600;">Total Amount</p>
        <p style="margin: 0;">${formatCurrency(resData.data.total_amount)}</p>
      </div>

      <div style="padding: 12px; border: 1px solid #cbd5e0; border-radius: 8px; background: #f7fafc;">
        <p style="margin: 0; font-weight: 600;">Payment Status</p>
        <p style="margin: 0;">${resData.data.payment_status}</p>
      </div>

      <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #edf2f7;">
        <p style="margin: 0; font-weight: 600;">Purchase Date</p>
        <p style="margin: 0;">${new Date(resData.data.purchase_date).toLocaleString()}</p>
      </div>

    </div>
  `,
  confirmButtonText: "Done",
  confirmButtonColor: "#10b981",
});


      // Optional: Reset shares or redirect
      // setSelectedShares(1);
      // router.push('/confirmation');
    } else {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: resData.message || "Failed to complete your purchase.",
      });
    }
  } catch (error) {
    console.error("Investment request failed:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Server error. Please try again later.",
    });
  }
};


  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaCoins className="text-yellow-500" />
          Investment Calculator
        </h3>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
          {remainingShares} shares left
        </span>
      </div>

      {/* Shares Selector */}
      <div className="mb-8">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <label htmlFor="shares">Number of Shares</label>
          <span className="text-xs">Max: {maxShares} per investor</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={decrementShares}
            disabled={selectedShares <= 1}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>

          <input
            type="range"
            min="1"
            max={maxShares}
            value={selectedShares}
            onChange={handleShareChange}
            className="flex-1 appearance-none h-2 bg-gray-300 rounded-lg outline-none cursor-pointer"
          />

          <button
            onClick={incrementShares}
            disabled={selectedShares >= maxShares}
            className="w-9 h-9 flex items-center justify-center text-lg font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-500">Min: 1 share</span>
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full font-medium">
            {selectedShares} share{selectedShares !== 1 ? "s" : ""} selected
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 uppercase mb-4 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Investment Breakdown
        </h4>

        <AnimatePresence mode="wait">
          <motion.div
            key={`shares-${selectedShares}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 w-full">
              <div className="text-xs text-blue-600 mb-1">Down Payment</div>
              <div className="text-xl font-bold text-blue-800">
                {formatCurrency(investmentDownPayment)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(
                  (downPaymentPerPerson /
                    (downPaymentPerPerson + totalInstallmentPerPerson)) *
                  100
                ).toFixed(0)}
                % of total
              </div>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100 w-full">
              <div className="text-xs text-green-600 mb-1">
                Monthly Installment
              </div>
              <div className="text-xl font-bold text-green-800">
                {formatCurrency(investmentMonthlyInstallment)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                For {numberOfInstallmentMonths} months
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 w-full">
              <div className="text-xs text-purple-600 mb-1">
                Total Investment
              </div>
              <div className="text-xl font-bold text-purple-800">
                {formatCurrency(investmentTotalCost)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedShares} share{selectedShares !== 1 ? "s" : ""}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      {isLoggedIn ? (
        <motion.button
          onClick={handleInvestClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          Invest Now <FaArrowRight />
        </motion.button>
      ) : (
        <Link href="/auth/signin" className="block w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <FaLock className="mr-2" />
            Login to Invest <FaArrowRight />
          </motion.div>
        </Link>
      )}

      <p className="text-xs text-gray-500 mt-4 text-center">
        By investing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
