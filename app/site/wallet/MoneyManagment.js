import Image from "next/image";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchInvestments } from "../../store/investmentsSlice";
import { fetchUserProfile } from "../../store/profileSlice";
import { useDispatch } from "react-redux";
import { format } from 'date-fns';

function MoneyManagement() {
  const dispatch = useDispatch();
  const { data: investments, loading: investmentsLoading } = useSelector((state) => state.investments);
  const { user, loading: profileLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchInvestments());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (investmentsLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[rgb(0,48,85)] mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800">Loading Your Financial Data</h3>
          <p className="text-gray-500 mt-2">We're gathering your investments and account information...</p>
          
          {/* Skeleton Loaders */}
          <div className="mt-8 space-y-4">
            <div className="bg-gray-100 rounded-lg h-4 w-full animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-4 w-3/4 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-4 w-5/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Investments Column */}
        <div className="lg:col-span-2 col-span-1 bg-white p-6 rounded-2xl shadow-md">
          <p className="text-xl font-semibold">My Investments</p>

          {/* Investments Table */}
          <div className="mt-6 overflow-x-auto">
            {investments && investments.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left">Property</th>
                    <th className="px-3 py-3 text-left">Purchase Date</th>
                    <th className="px-3 py-3 text-left">Shares</th>
                    <th className="px-3 py-3 text-left">Total Amount</th>
                    <th className="px-3 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4">{investment.property.title}</td>
                      <td className="px-3 py-4">
                        {format(new Date(investment.purchase_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-3 py-4">{investment.number_of_shares}</td>
                      <td className="px-3 py-4">{formatCurrency(investment.total_amount)}</td>
                      <td className="px-3 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          investment.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <Image
                  src="https://shares.nawy.com/_next/static/media/building-07.b3b45ba9.svg"
                  alt="No investments"
                  width={120}
                  height={120}
                  className="mx-auto opacity-70"
                />
                <p className="text-lg text-gray-600 mt-4">No investments found</p>
                <p className="text-gray-400 mt-2">Start investing to see your portfolio here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 mt-6 lg:mt-0">
          {/* Updated Balance Card to blue gradient */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl mb-6">
            <h1 className="font-semibold text-xl">My Balance</h1>
            <p className="mt-4 text-3xl">
              {user?.balance ? formatCurrency(user.balance) : '--'}
            </p>
            <div className="flex gap-4 justify-between mt-6">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 px-4 py-2 rounded-lg font-semibold w-full transition-colors">
                Deposit
              </button>
              <button className="bg-white hover:bg-gray-100 text-blue-700 px-4 py-2 rounded-lg font-semibold w-full transition-colors">
                Withdraw
              </button>
            </div>
          </div>
          
          {/* Summary Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-xl font-semibold">Investment Summary</p>
            {investments && investments.length > 0 ? (
              <div className="mt-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Total Investments:</span>
                  <span className="font-semibold">
                    {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0))}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Properties Owned:</span>
                  <span className="font-semibold">
                    {new Set(investments.map(inv => inv.property_id)).size}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Total Shares:</span>
                  <span className="font-semibold">
                    {investments.reduce((sum, inv) => sum + inv.number_of_shares, 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <Image
                  src="https://shares.nawy.com/_next/static/media/building-07.b3b45ba9.svg"
                  alt="No investments"
                  width={80}
                  height={80}
                  className="mx-auto opacity-50"
                />
                <p className="mt-4 text-gray-500">No investments yet</p>
              </div>
            )}
          </div>

          {/* Help Card */}
           <div className="p-6 rounded-lg text-white mt-6  bg-blue-600">
            <h3 className="text-xl font-semibold">Need help?</h3>
            <p className="mt-2 opacity-90">Our team is here to support you</p>
            <button className="bg-white px-4 py-2 rounded-lg mt-4 font-semibold text-blue-600 flex items-center gap-2 hover:bg-opacity-90 transition-all">
              <HiChatBubbleLeftRight className="text-xl" />
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoneyManagement;