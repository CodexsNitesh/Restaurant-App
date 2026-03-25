// import { useCart } from '../../context/CartContext';
// import { formatCurrency } from '../../utils/helpers';

// const CartDrawer = ({ open, onClose, onPlaceOrder, tableNumber, setTableNumber, currency, placing }) => {
//   const { cart, addToCart, removeFromCart, total, itemCount } = useCart();

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex justify-end">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div className="relative bg-white w-full max-w-sm flex flex-col h-full">
//         <div className="flex items-center justify-between px-4 py-4 border-b">
//           <h2 className="font-bold text-gray-800">Your Cart ({itemCount})</h2>
//           <button onClick={onClose} className="text-gray-400 text-xl">✕</button>
//         </div>

//         {cart.length === 0 ? (
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
//             <span className="text-5xl mb-3">🛒</span>
//             <p>Your cart is empty</p>
//           </div>
//         ) : (
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {cart.map(({ item, quantity }) => (
//               <div key={item._id} className="flex items-center gap-3">
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{item.name}</p>
//                   <p className="text-xs text-primary">{formatCurrency(item.price, currency)}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button onClick={() => removeFromCart(item._id)} className="w-6 h-6 rounded-full bg-gray-200 text-sm font-bold">−</button>
//                   <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
//                   <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">+</button>
//                 </div>
//                 <span className="text-sm font-medium w-16 text-right">{formatCurrency(item.price * quantity, currency)}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="border-t p-4 space-y-3">
//           <div className="flex justify-between font-bold text-gray-800">
//             <span>Total</span>
//             <span>{formatCurrency(total, currency)}</span>
//           </div>
//           <div>
//             <label className="label">Table Number</label>
//             <input
//               className="input"
//               placeholder="e.g. Table 1"
//               value={tableNumber}
//               onChange={(e) => setTableNumber(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={onPlaceOrder}
//             disabled={cart.length === 0 || !tableNumber || placing}
//             className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {placing ? 'Placing Order...' : 'Place Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartDrawer;

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
            <div className="text-sm text-gray-600">🛍️ Takeaway Order</div>
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
            disabled={cart.length === 0  || placing || isDineInWithoutTable}
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

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getMenuItems, getCategories, getSettings, placeOrder } from '../../services/api';
// import { CartProvider, useCart } from '../../context/CartContext';
// import MenuItemCard from '../../components/menu/MenuItemCard';
// import CategoryFilter from '../../components/menu/CategoryFilter';
// import CartDrawer from '../../components/menu/CartDrawer';
// import { imgUrl } from '../../utils/helpers';
// import toast from 'react-hot-toast';

// const MenuContent = () => {
//   const { tableId } = useParams();
//   const navigate = useNavigate();
//   const { cart, clearCart, itemCount, total } = useCart();

//   const [settings, setSettings] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [items, setItems] = useState([]);
//   const [selectedCat, setSelectedCat] = useState('');
//   const [search, setSearch] = useState('');
//   const [cartOpen, setCartOpen] = useState(false);

//   // ✅ detect QR
//   const isQR = !!tableId;

//   // ✅ FIXED: table state (QR OR manual)
//   const [tableNumber, setTableNumber] = useState(
//     tableId ? tableId.replace(/-/g, ' ') : ''
//   );

//   // ✅ order type
//   const [orderType, setOrderType] = useState(isQR ? 'dine-in' : '');

//   const [placing, setPlacing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([getSettings(), getCategories(), getMenuItems({ available: true })]).then(
//       ([s, c, m]) => {
//         setSettings(s.data);
//         setCategories(c.data);
//         setItems(m.data);
//         setLoading(false);
//       }
//     );
//   }, []);

//   const filtered = items.filter((item) => {
//     const matchCat = selectedCat ? item.category?._id === selectedCat : true;
//     const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
//     return matchCat && matchSearch;
//   });

//   const handlePlaceOrder = async () => {
//     if (!orderType) return toast.error("Select order type");

//     if (orderType === 'dine-in' && !tableNumber) {
//       return toast.error("Enter table number");
//     }

//     if (cart.length === 0) return toast.error('Cart is empty');

//     setPlacing(true);

//     try {
//       const orderData = {
//         orderType,
//         tableNumber: orderType === 'dine-in' ? tableNumber : null,
//         items: cart.map(({ item, quantity }) => ({
//           menuItem: item._id,
//           name: item.name,
//           price: item.price,
//           quantity,
//         })),
//         totalAmount: total,
//       };

//       const { data } = await placeOrder(orderData);

//       clearCart();
//       setCartOpen(false);
//       navigate(`/order-success/${data.orderNumber}`);
//     } catch {
//       toast.error('Failed to place order. Try again.');
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="text-5xl mb-3">🍽️</div>
//         <p className="text-gray-500">Loading menu...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-24">

//       {/* Header */}
//       <div className="relative bg-dark text-white">
//         {settings.banner && (
//           <img src={imgUrl(settings.banner)} alt="banner" className="w-full h-40 object-cover opacity-40" />
//         )}
//         <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-4">
//           {settings.logo && (
//             <img src={imgUrl(settings.logo)} alt="logo" className="w-16 h-16 rounded-full object-cover border-2 border-white" />
//           )}
//           <h1 className="text-2xl font-bold">{settings.restaurantName || 'Restaurant'}</h1>

//           {/* ✅ Display */}
//           {orderType === 'dine-in' && tableNumber && (
//             <p className="text-sm text-gray-300">📍 {tableNumber}</p>
//           )}
//           {orderType === 'takeaway' && (
//             <p className="text-sm text-gray-300">🛍️ Takeaway</p>
//           )}
//         </div>
//       </div>

//       {/* Order Type */}
//       {!isQR && (
//         <div className="p-4">
//           <p className="font-semibold mb-2">Order Type</p>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setOrderType('dine-in')}
//               className={`btn ${orderType === 'dine-in' ? 'bg-primary text-white' : ''}`}
//             >
//               Dine In
//             </button>
//             <button
//               onClick={() => setOrderType('takeaway')}
//               className={`btn ${orderType === 'takeaway' ? 'bg-primary text-white' : ''}`}
//             >
//               Takeaway
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Search */}
//       <div className="sticky top-0 bg-white border-b z-10 px-4 py-3 shadow-sm">
//         <input
//           className="input"
//           placeholder="🔍 Search dishes..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="px-4 py-4 space-y-4">
//         <CategoryFilter categories={categories} selected={selectedCat} onChange={setSelectedCat} />

//         {filtered.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <p className="text-4xl mb-2">🍽️</p>
//             <p>No items found</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {filtered.map((item) => (
//               <MenuItemCard key={item._id} item={item} currency={settings.currency} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Cart Button */}
//       {itemCount > 0 && (
//         <div className="fixed bottom-6 left-4 right-4 z-40">
//           <button
//             onClick={() => setCartOpen(true)}
//             className="w-full bg-primary text-white py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 font-semibold"
//           >
//             <span className="bg-white/20 rounded-full px-2 py-0.5 text-sm">{itemCount} items</span>
//             <span>View Cart 🛒</span>
//             <span>{settings.currency}{total.toFixed(2)}</span>
//           </button>
//         </div>
//       )}

//       {/* ✅ FIXED CartDrawer */}
//       <CartDrawer
//         open={cartOpen}
//         onClose={() => setCartOpen(false)}
//         onPlaceOrder={handlePlaceOrder}
//         tableNumber={tableNumber}
//         setTableNumber={setTableNumber}   // ✅ important
//         orderType={orderType}
//         isQR={isQR}                       // ✅ important
//         currency={settings.currency}
//         placing={placing}
//       />
//     </div>
//   );
// };

// const MenuPage = () => (
//   <CartProvider>
//     <MenuContent />
//   </CartProvider>
// );

// export default MenuPage;
