import { useState } from 'react';
import useApi from '../../hooks/userApi';
import { getOrders, updateOrderStatus } from '../../services/api';
import OrderRow from '../../components/admin/OrderRow';
import Modal from '../../components/admin/Modal';
import { formatCurrency, formatDate, statusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Orders = ({ settings }) => {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  const { data: orders, loading, refetch } = useApi(
    () => getOrders({ status: filterStatus, table: filterTable, search }),
    [filterStatus, filterTable, search]
  );

  const handleStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); refetch(); toast.success('Status updated'); }
    catch { toast.error('Error updating status'); }
  };

  const currency = settings?.currency || '₹';

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="input w-36" placeholder="🔍 Order #" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input w-36" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {['Pending','Preparing','Served','Paid','Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="input w-36" placeholder="Table #" value={filterTable} onChange={(e) => setFilterTable(e.target.value)} />
      </div>

      {orders?.length === 0 ? (
        <div className="card text-center py-12 text-gray-400"><p className="text-4xl mb-2">🧾</p><p>No orders found</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white rounded-xl shadow-sm border">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Table</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <OrderRow key={order._id} order={order} onView={setViewOrder} onStatusChange={handleStatusChange} currency={currency} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order Details — ${viewOrder?.orderNumber}`}>
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400">Table</p><p className="font-semibold">{viewOrder.tableNumber}</p></div>
              <div><p className="text-gray-400">Status</p><span className={`text-xs px-2 py-1 rounded-full ${statusColor(viewOrder.status)}`}>{viewOrder.status}</span></div>
              <div><p className="text-gray-400">Time</p><p className="font-semibold">{formatDate(viewOrder.createdAt)}</p></div>
              <div><p className="text-gray-400">Total</p><p className="font-semibold text-primary">{formatCurrency(viewOrder.totalAmount, currency)}</p></div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">Items</p>
              {viewOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{it.name} × {it.quantity}</span>
                  <span className="font-medium">{formatCurrency(it.price * it.quantity, currency)}</span>
                </div>
              ))}
            </div>
            {/* Print Bill Button */}
            <button onClick={() => window.print()} className="btn-secondary w-full text-sm">🖨️ Print Bill</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;