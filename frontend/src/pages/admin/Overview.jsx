import { useEffect, useState } from 'react';
import { getOrderStats, getDailyRevenue, getMenuItems } from '../../services/api';
import StatCard from '../../components/admin/Statcard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = ({ settings }) => {
  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    getOrderStats().then((r) => setStats(r.data));
    getDailyRevenue().then((r) => setRevenue(r.data));
    getMenuItems().then((r) => setMenuCount(r.data.length));
  }, []);

  const currency = settings?.currency || '₹';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.totalOrders || 0} icon="🧾" color="bg-blue-50 text-blue-600" />
        <StatCard label="Pending Orders" value={stats.pendingOrders || 0} icon="⏳" color="bg-yellow-50 text-yellow-600" />
        <StatCard label="Total Revenue" value={`${currency}${(stats.totalRevenue || 0).toFixed(0)}`} icon="💰" color="bg-green-50 text-green-600" />
        <StatCard label="Menu Items" value={menuCount} icon="🍽️" color="bg-purple-50 text-purple-600" />
      </div>

      {revenue.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4">Daily Revenue (Last 30 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${currency}${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#FF6B35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Overview;