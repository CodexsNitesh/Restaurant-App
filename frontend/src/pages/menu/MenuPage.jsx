import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMenuItems, getCategories, getSettings, placeOrder } from '../../services/api';
import { CartProvider, useCart } from '../../context/CartContext';
import MenuItemCard from '../../components/menu/MenuItemCard';
import CategoryFilter from '../../components/menu/CategoryFilter';
import CartDrawer from '../../components/menu/CartDrawer';
import { imgUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Inner component that uses CartContext
const MenuContent = () => {
  const { tableId } = useParams(); // e.g. "table-3"
  const navigate = useNavigate();
  const { cart, clearCart, itemCount, total } = useCart();

  const [settings, setSettings] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(tableId ? tableId.replace(/-/g, ' ') : '');
  const [placing, setPlacing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSettings(), getCategories(), getMenuItems({ available: true })]).then(
      ([s, c, m]) => {
        setSettings(s.data);
        setCategories(c.data);
        setItems(m.data);
        setLoading(false);
      }
    );
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = selectedCat ? item.category?._id === selectedCat : true;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) return toast.error('Please enter a table number');
    if (cart.length === 0) return toast.error('Cart is empty');
    setPlacing(true);
    try {
      const orderData = {
        tableNumber: tableNumber.trim(),
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
      toast.error('Failed to place order. Try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-3">🍽️</div>
        <p className="text-gray-500">Loading menu...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header / Banner */}
      <div className="relative bg-dark text-white">
        {settings.banner && (
          <img src={imgUrl(settings.banner)} alt="banner" className="w-full h-40 object-cover opacity-40" />
        )}
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-4">
          {settings.logo && (
            <img src={imgUrl(settings.logo)} alt="logo" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
          )}
          <h1 className="text-2xl font-bold">{settings.restaurantName || 'Restaurant'}</h1>
          {tableNumber && <p className="text-sm text-gray-300">📍 {tableNumber}</p>}
        </div>
        {!settings.banner && (
          <div className="py-10 flex flex-col items-center gap-2">
            {settings.logo && (
              <img src={imgUrl(settings.logo)} alt="logo" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
            )}
            <h1 className="text-2xl font-bold">{settings.restaurantName || 'Restaurant'}</h1>
            {tableNumber && <p className="text-sm text-gray-300">📍 {tableNumber}</p>}
          </div>
        )}
      </div>

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
        {/* Category Filter */}
        <CategoryFilter categories={categories} selected={selectedCat} onChange={setSelectedCat} />

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🍽️</p>
            <p>No items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <MenuItemCard key={item._id} item={item} currency={settings.currency} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-primary text-white py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 font-semibold"
          >
            <span className="bg-white/20 rounded-full px-2 py-0.5 text-sm">{itemCount} items</span>
            <span>View Cart 🛒</span>
            <span>{settings.currency}{total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        currency={settings.currency}
        placing={placing}
      />
    </div>
  );
};

// Wrap with CartProvider
const MenuPage = () => (
  <CartProvider>
    <MenuContent />
  </CartProvider>
);

export default MenuPage;