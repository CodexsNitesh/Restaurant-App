export const formatCurrency = (amount, currency = '₹') =>
  `${currency}${Number(amount).toFixed(2)}`;

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const statusColor = (status) => ({
  Pending: 'bg-yellow-100 text-yellow-700',
  Preparing: 'bg-blue-100 text-blue-700',
  Served: 'bg-green-100 text-green-700',
  Paid: 'bg-purple-100 text-purple-700',
  Cancelled: 'bg-red-100 text-red-700',
}[status] || 'bg-gray-100 text-gray-700');

export const imgUrl = (filename) =>
  filename?.startsWith('http') ? filename : `${import.meta.env.VITE_BASE_URL}/uploads/${filename}`;