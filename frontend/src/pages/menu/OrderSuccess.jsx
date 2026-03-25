import { useParams, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen luxury-bg flex items-center justify-center p-6">
      <div className="text-center max-w-sm card">
        <div className="w-24 h-24 bg-amber-200/20 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-4">Your order has been received and is being processed.</p>
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
          <p className="text-sm text-gray-400 mb-1">Your Order Number</p>
          <p className="text-3xl font-bold text-primary">{orderNumber}</p>
        </div>
        <p className="text-sm text-gray-400 mb-6">Please keep this number for reference. Our staff will bring your order shortly.</p>
        <button
          onClick={() => navigate(-1)}
          className="btn-primary w-full py-3"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;