import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/helpers";

// ❌ REMOVED setTableNumber
// ✅ ADDED orderType
const CartDrawer = ({
  open,
  onClose,
  onPlaceOrder,
  tableNumber,
  orderType,
  currency,
  placing,
}) => {
  const { cart, addToCart, removeFromCart, total, itemCount } = useCart();

  if (!open) return null;

  const isDineInWithoutTable = orderType === "dine-in" && !tableNumber;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="font-bold text-gray-800">Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="text-gray-400 text-xl">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-5xl mb-3">🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(({ item, quantity }) => (
              <div key={item._id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-primary">
                    {formatCurrency(item.price, currency)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="w-6 h-6 rounded-full bg-gray-200 text-sm font-bold"
                  >
                    −
                  </button>

                  <span className="text-sm font-semibold w-4 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-medium w-16 text-right">
                  {formatCurrency(item.price * quantity, currency)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t p-4 space-y-3">
          {/* Total */}
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>

          {/* ❌ REMOVED TABLE INPUT COMPLETELY */}
          {/* ❌ DELETE THIS BLOCK:
          <div>
            <label className="label">Table Number</label>
            <input
              className="input"
              placeholder="e.g. Table 1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          */}

          {/* ✅ NEW: Display only (no editing) */}
          {orderType === "dine-in" && tableNumber && (
            <div className="text-sm text-gray-600">
              📍 Table: <span className="font-semibold">{tableNumber}</span>
            </div>
          )}

          {orderType === "takeaway" && (
            <div className="text-sm text-gray-600">🛍️ Takeaway Order </div>
          )}

          {isDineInWithoutTable && (
            <div className="text-sm text-red-500">
              ⚠️ Please scan the QR on your table to place a dine-in order
            </div>
          )}

          {/* Button */}
          <button
            onClick={onPlaceOrder}
            // ❌ REMOVED tableNumber dependency
            // disabled={cart.length === 0 || !orderType || placing}
            disabled={cart.length === 0 || !orderType || isDineInWithoutTable || placing }
            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
