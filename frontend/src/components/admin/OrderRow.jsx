import { statusColor, formatCurrency, formatDate } from '../../utils/helpers';

const OrderRow = ({ order, onView, onStatusChange, currency }) => (
  <tr className="border-b border-amber-200/20 hover:bg-[#2a1f15] transition text-amber-100">
    <td className="px-4 py-3 font-mono text-sm font-bold text-amber-100">{order.orderNumber}</td>
    <td className="px-4 py-3 text-sm font-semibold">{order.orderType === 'takeaway' ? 'Takeaway' : `Table ${order.tableNumber || 'N/A'}`}</td>
    <td className="px-4 py-3 text-sm font-semibold">{order.items.length} item(s)</td>
    <td className="px-4 py-3 text-sm font-bold text-amber-50">{formatCurrency(order.totalAmount, currency)}</td>
    <td className="px-4 py-3">
      <select
        value={order.status}
        onChange={(e) => onStatusChange(order._id, e.target.value)}
        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(order.status)}`}
      >
        {['Pending', 'Preparing', 'Served', 'Paid', 'Cancelled'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </td>
    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
    <td className="px-4 py-3">
      <button onClick={() => onView(order)} className="text-xs text-primary hover:underline">View</button>
    </td>
  </tr>
);

export default OrderRow;