import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin/overview', label: 'Overview', icon: '📊' },
  { to: '/admin/categories', label: 'Categories', icon: '📂' },
  { to: '/admin/menu-items', label: 'Menu Items', icon: '🍽️' },
  { to: '/admin/orders', label: 'Orders', icon: '🧾' },
  { to: '/admin/tables', label: 'Tables & QR', icon: '🪑' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 sm:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-amber-100 flex flex-col overflow-y-auto transform transition-transform duration-300 sm:relative sm:translate-x-0 sm:top-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-amber-300/20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">🍴 RestaurantOS</h1>
            <p className="text-xs text-amber-200 mt-1">Admin Dashboard</p>
          </div>
          <button className="sm:hidden text-amber-200 hover:text-white" onClick={onClose}>
            ✕
          </button>
        </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'
              }`
            }
          >
            <span>{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-amber-300/20">
        <button onClick={logout} className="w-full text-left text-sm text-amber-100 hover:text-white px-4 py-2 rounded-lg hover:bg-amber-200/20 transition">
          🚪 Logout
        </button>
      </div>
    </aside>
  </>
);
};

export default Sidebar;