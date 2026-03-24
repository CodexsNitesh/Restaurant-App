import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import useApi from '../../hooks/userApi';
import { getTables, createTable, deleteTable } from '../../services/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

const BASE_MENU_URL = import.meta.env.VITE_MENU_URL || 'http://localhost:5173/menu';

const Tables = () => {
  const { data: tables, loading, refetch } = useApi(getTables);
  const [modal, setModal] = useState(false);
  const [qrModal, setQrModal] = useState(null);
  const [form, setForm] = useState({ tableNumber: '', capacity: 4 });

  const handleCreate = async () => {
    try {
      await createTable(form);
      toast.success('Table added');
      setModal(false);
      refetch();
    } catch { toast.error('Error creating table'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this table?')) return;
    try { await deleteTable(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Error'); }
  };

  const downloadQR = (tableNumber) => {
    const svg = document.getElementById(`qr-${tableNumber}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-Table-${tableNumber}.svg`;
    a.click();
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tables & QR Codes ({tables?.length || 0})</h2>
        <button onClick={() => setModal(true)} className="btn-primary">+ Add Table</button>
      </div>

      {tables?.length === 0 ? (
        <div className="card text-center py-12 text-gray-400"><p className="text-4xl mb-2">🪑</p><p>No tables yet</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables?.map((t) => {
            const menuLink = `${BASE_MENU_URL}/${t.tableNumber.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <div key={t._id} className="card text-center">
                <h3 className="font-bold text-lg mb-1">{t.tableNumber}</h3>
                <p className="text-xs text-gray-400 mb-3">Capacity: {t.capacity} | {t.isActive ? '✅ Active' : '❌ Inactive'}</p>
                <div className="flex justify-center mb-3">
                  <QRCodeSVG id={`qr-${t.tableNumber}`} value={menuLink} size={120} />
                </div>
                <p className="text-xs text-gray-400 break-all mb-3">{menuLink}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => downloadQR(t.tableNumber)} className="btn-primary text-xs">⬇ Download QR</button>
                  <button onClick={() => setQrModal({ ...t, menuLink })} className="btn-secondary text-xs">View</button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-400 text-xs hover:underline">Del</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Table Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add Table">
        <div className="space-y-3">
          <div>
            <label className="label">Table Number / Name *</label>
            <input className="input" placeholder="e.g. Table 1" value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} />
          </div>
          <div>
            <label className="label">Capacity</label>
            <input className="input" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCreate} className="btn-primary flex-1">Add Table</button>
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* QR Preview Modal */}
      {qrModal && (
        <Modal open={!!qrModal} onClose={() => setQrModal(null)} title={`QR — ${qrModal.tableNumber}`}>
          <div className="text-center">
            <QRCodeSVG value={qrModal.menuLink} size={200} className="mx-auto" />
            <p className="text-xs text-gray-400 mt-3 break-all">{qrModal.menuLink}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tables;