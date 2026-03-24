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

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="w-64 bg-dark min-h-screen flex flex-col text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-primary">🍴 RestaurantOS</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
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
      <div className="p-4 border-t border-white/10">
        <button onClick={logout} className="w-full text-left text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;