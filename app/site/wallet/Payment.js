import Image from "next/image";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { format } from 'date-fns';

function Payment() {
  const { user } = useSelector((state) => state.profile);
  const { data: investments } = useSelector((state) => state.investments);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const totalInvested = investments?.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0) || 0;
  const activeInvestments = investments?.filter(inv => inv.status === "active");

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Investment Overview</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm opacity-80">Total Balance</p>
            <p className="text-2xl mt-1">{formatCurrency(user?.balance)}</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Total Invested</p>
            <p className="text-2xl mt-1">{formatCurrency(totalInvested)}</p>
          </div>
        </div>
      </div>

      {activeInvestments?.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Active Investments</h2>
          <div className="mt-4 space-y-4">
            {activeInvestments.map(investment => (
              <div key={investment.id} className="border-b pb-4">
                <h3 className="font-medium">{investment.property.title}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-500">Purchase Date</p>
                    <p>{format(new Date(investment.purchase_date), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p>{formatCurrency(investment.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="text-green-600">Active</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Image
            src="https://shares.nawy.com/_next/static/media/building-07.b3b45ba9.svg"
            alt="No investments"
            width={56}
            height={56}
            className="mx-auto"
          />
          <h3 className="text-xl font-semibold mt-4">No active investments</h3>
          <p className="mt-2">Start your investment journey today</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-4 font-medium transition-colors">
            Browse Properties
          </button>
        </div>
      )}

      <div className="p-6 rounded-lg text-white   bg-blue-600">
        <h3 className="text-xl font-semibold">Payment Questions?</h3>
        <p className="mt-2">Our support team is available 24/7</p>
        <button className="bg-white px-4 py-2 rounded-lg mt-4 font-semibold text-blue-600 flex items-center gap-2 hover:bg-opacity-90 transition-all">
          <HiChatBubbleLeftRight className="text-xl" />
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default Payment;