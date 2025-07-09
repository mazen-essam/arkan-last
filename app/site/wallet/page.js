"use client";
import { useState } from "react";
import MoneyManagement from "./MoneyManagment";
import Payment from "./Payment";

function Page() {
  const [activeTab, setActiveTab] = useState("moneyManagement"); // Default to money management

  const renderTabContent = () => {
    switch (activeTab) {
      case "payment":
        return <Payment />;
      case "moneyManagement":
        return <MoneyManagement />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="pt-32 container mx-auto pb-12">
        <div className="text-center mb-12">
          {/* Updated to blue text */}
          <h1 className="text-5xl font-semibold text-blue-700">Wallet</h1>
          <p className="mt-4 text-2xl font-semibold text-blue-700">
            Track your payments and manage your investments
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab("payment")}
            className={`px-6 py-2 text-lg font-semibold ${
              activeTab === "payment"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-blue-700"
            } rounded-l-lg transition-colors duration-300`}
          >
            Payment
          </button>
          <button
            onClick={() => setActiveTab("moneyManagement")}
            className={`px-6 py-2 text-lg font-semibold ${
              activeTab === "moneyManagement"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-blue-700"
            } rounded-r-lg transition-colors duration-300`}
          >
            Investments
          </button>
        </div>

        {/* Tab Content */}
        <div className="">{renderTabContent()}</div>
      </div>
    </section>
  );
}

export default Page;