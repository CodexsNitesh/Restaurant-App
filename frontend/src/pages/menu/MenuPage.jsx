import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMenuItems,
  getCategories,
  getSettings,
  placeOrder,
} from "../../services/api";
import { CartProvider, useCart } from "../../context/CartContext";
import MenuItemCard from "../../components/menu/MenuItemCard";
import CategoryFilter from "../../components/menu/CategoryFilter";
import CartDrawer from "../../components/menu/CartDrawer";
import { imgUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const MenuContent = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { cart, clearCart, itemCount, total } = useCart();

  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ NEW: detect QR or normal user
  const isQR = !!tableId;

  // ❌ REMOVED editable table state
  // const [tableNumber, setTableNumber] = useState(...);

  // ✅ NEW: fixed table from URL
  const tableNumber = tableId?.replace(/-/g, " ");

  // ✅ NEW: order type
  const [orderType, setOrderType] = useState(isQR ? "dine-in" : "");

  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSettings(),
      getCategories(),
      getMenuItems({ available: true }),
    ]).then(([s, c, m]) => {
      setSettings(s.data);
      setCategories(c.data);
      setItems(m.data);
      setLoading(false);
    });
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = selectedCat ? item.category?._id === selectedCat : true;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePlaceOrder = async () => {
    // ✅ NEW validation
    if (!orderType) return toast.error("Select order type");

    if (orderType === "dine-in" && !tableNumber) {
      return toast.error("Invalid table");
    }

    if (cart.length === 0) return toast.error("Cart is empty");

    setPlacing(true);

    try {
      // const orderData = {
      //   // ✅ NEW fields
      //   orderType,
      //   tableNumber: orderType === 'dine-in' ? tableNumber : null,

      //   items: cart.map(({ item, quantity }) => ({
      //     menuItem: item._id,
      //     name: item.name,
      //     price: item.price,
      //     quantity,
      //   })),
      //   totalAmount: total,
      // };

      const orderData = {
        orderType,

        ...(orderType === "dine-in" && { tableNumber }),

        items: cart.map(({ item, quantity }) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity,
        })),
        totalAmount: total,
      };

      const { data } = await placeOrder(orderData);

      clearCart();
      setCartOpen(false);
      navigate(`/order-success/${data.orderNumber}`);
    } catch {
      toast.error("Failed to place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="relative bg-dark text-white">
        {settings.banner && (
          <img
            src={imgUrl(settings.banner)}
            alt="banner"
            className="w-full h-40 object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-4">
          {settings.logo && (
            <img
              src={imgUrl(settings.logo)}
              alt="logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          )}
          <h1 className="text-2xl font-bold">
            {settings.restaurantName || "Restaurant"}
          </h1>

          {/* ✅ UPDATED display */}
          {orderType === "dine-in" && tableNumber && (
            <p className="text-sm text-gray-300">📍 {tableNumber}</p>
          )}
          {orderType === "takeaway" && (
            <p className="text-sm text-gray-300">🛍️ Takeaway</p>
          )}
        </div>
      </div>

      {/* ✅ NEW: Order type selector (only if not QR) */}
      {!isQR && (
        <div className="p-4">
          <p className="font-semibold mb-2">Order Type</p>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType("dine-in")}
              className={`btn ${orderType === "dine-in" ? "bg-primary text-white" : ""}`}
            >
              Dine In
            </button>
            <button
              onClick={() => setOrderType("takeaway")}
              className={`btn ${orderType === "takeaway" ? "bg-primary text-white" : ""}`}
            >
              Takeaway
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="sticky top-0 bg-white border-b z-10 px-4 py-3 shadow-sm">
        <input
          className="input"
          placeholder="🔍 Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="px-4 py-4 space-y-4">
        <CategoryFilter
          categories={categories}
          selected={selectedCat}
          onChange={setSelectedCat}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🍽️</p>
            <p>No items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                currency={settings.currency}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Button */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-white py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 font-semibold"
          >
            <span className="bg-white/20 rounded-full px-2 py-0.5 text-sm">
              {itemCount} items
            </span>
            <span>View Cart 🛒</span>
            <span>
              {settings.currency}
              {total.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* ✅ UPDATED CartDrawer props */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        tableNumber={tableNumber}
        orderType={orderType} // ✅ NEW
        currency={settings.currency}
        placing={placing}
      />
    </div>
  );
};

const MenuPage = () => (
  <CartProvider>
    <MenuContent />
  </CartProvider>
);

export default MenuPage;
