import { useCart } from '../../context/CartContext';
import { formatCurrency, imgUrl } from '../../utils/helpers';

const MenuItemCard = ({ item, currency }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const cartEntry = cart.find((c) => c.item._id === item._id);

  return (
    <div className={`card overflow-hidden flex gap-3 p-4 ${!item.isAvailable ? 'opacity-40' : 'hover:scale-[1.01] transition-transform'} `}>
      {item.image && (
        <img
          src={imgUrl(item.image)}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-amber-200/40"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          {/* Veg/Non-veg dot */}
          <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${
            item.foodType === 'veg' ? 'border-green-600' : item.foodType === 'vegan' ? 'border-green-400' : 'border-red-600'
          } flex items-center justify-center`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              item.foodType === 'veg' ? 'bg-green-600' : item.foodType === 'vegan' ? 'bg-green-400' : 'bg-red-600'
            }`} />
          </span>
          <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">{formatCurrency(item.price, currency)}</span>
          {!item.isAvailable ? (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Not Available</span>
          ) : cartEntry ? (
            <div className="flex items-center gap-2">
              <button onClick={() => removeFromCart(item._id)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">−</button>
              <span className="font-semibold text-sm w-4 text-center">{cartEntry.quantity}</span>
              <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">+</button>
            </div>
          ) : (
            <button onClick={() => addToCart(item)} className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;