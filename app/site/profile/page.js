"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../../store/profileSlice";
import { fetchInvestments } from "../../store/investmentsSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    image: ''
  });

  const { user, loading: profileLoading, updateStatus } = useSelector((state) => state.profile);
  const { data: investments, loading: investmentsLoading } = useSelector((state) => state.investments);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchInvestments());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        image: user.image || ''
      });
    }
  }, [user]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: user.id, data: formData }))
      .then(() => {
        setEditMode(false);
      });
  };

  if (profileLoading || investmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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

  const fullName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : "Unknown User";

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-20 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center relative">
          <div className="absolute top-4 right-4">
            {activeTab === 'profile' && !editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <Image
            src={user.image || "/default (1).png"}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full mx-auto border-4 border-purple-500 shadow-md"
          />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{fullName}</h1>
          <p className="text-gray-600 text-sm mt-1">{user.email || "No email provided"}</p>
          
          {/* Tabs */}
          <div className="flex justify-center mt-6 border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 font-medium ${activeTab === 'investments' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            >
              Investments
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {activeTab === 'profile' ? (
            editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                {updateStatus === 'failed' && (
                  <p className="text-red-500 text-sm mt-4">Failed to update profile. Please try again.</p>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={updateStatus === 'loading'}
                  >
                    {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                  <p className="mt-1 text-gray-900">{user.first_name || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                  <p className="mt-1 text-gray-900">{user.last_name || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-gray-900">{user.email || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            )
          ) : (
            <>
              {/* Investment Summary */}
              {investments.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Investment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Total Investments</p>
                      <p className="font-bold text-purple-800 text-xl">
                        {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0))}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Total Paid</p>
                      <p className="font-bold text-blue-800 text-xl">
                        {formatCurrency(investments.reduce((sum, inv) => sum + parseFloat(inv.advancement_payment), 0))}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Total Shares</p>
                      <p className="font-bold text-green-800 text-xl">
                        {investments.reduce((sum, inv) => sum + inv.number_of_shares, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Investments List */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Your Investments</h2>
                {investments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">You don't have any investments yet.</p>
                ) : (
                  investments.map((inv) => (
                    <div key={inv.id} className="border rounded-lg p-6 mb-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{inv.property.title}</h3>
                          <p className="text-sm text-gray-500">
                            Purchased on: {new Date(inv.purchase_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {inv.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(parseFloat(inv.total_amount))}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Shares</p>
                          <p className="font-semibold text-gray-800">{inv.number_of_shares}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500">Share Price</p>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(parseFloat(inv.share_price))}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{
                              width: `${(parseFloat(inv.advancement_payment) / parseFloat(inv.total_amount)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>Paid: {formatCurrency(parseFloat(inv.advancement_payment))}</span>
                          <span>Remaining: {formatCurrency(parseFloat(inv.total_amount) - parseFloat(inv.advancement_payment))}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}