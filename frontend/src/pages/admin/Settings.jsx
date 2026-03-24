import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/api';
import { imgUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Settings = ({ onSettingsUpdate }) => {
  const [form, setForm] = useState({
    restaurantName: '', currency: '₹', address: '', phone: '',
    gstEnabled: false, gstPercent: 5, serviceChargeEnabled: false, serviceChargePercent: 10,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [current, setCurrent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSettings().then((r) => { setForm(r.data); setCurrent(r.data); });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) fd.append('logo', logoFile);
      if (bannerFile) fd.append('banner', bannerFile);
      const { data } = await updateSettings(fd);
      setCurrent(data);
      onSettingsUpdate && onSettingsUpdate(data);
      toast.success('Settings saved!');
    } catch { toast.error('Error saving settings'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Restaurant Info</h3>
        <div>
          <label className="label">Restaurant Name</label>
          <input className="input" value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Currency Symbol</label>
            <input className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Logo & Banner</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Logo</label>
            {current.logo && <img src={imgUrl(current.logo)} className="w-16 h-16 rounded-full object-cover mb-2" alt="logo" />}
            <input type="file" accept="image/*" className="input" onChange={(e) => setLogoFile(e.target.files[0])} />
          </div>
          <div>
            <label className="label">Banner</label>
            {current.banner && <img src={imgUrl(current.banner)} className="w-full h-16 object-cover rounded-lg mb-2" alt="banner" />}
            <input type="file" accept="image/*" className="input" onChange={(e) => setBannerFile(e.target.files[0])} />
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Tax & Charges</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.gstEnabled} onChange={(e) => setForm({ ...form, gstEnabled: e.target.checked })} className="w-4 h-4" />
          <span className="text-sm">Enable GST</span>
          {form.gstEnabled && (
            <input type="number" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: +e.target.value })} className="input w-20 ml-2" />
          )}
          {form.gstEnabled && <span className="text-sm text-gray-400">%</span>}
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.serviceChargeEnabled} onChange={(e) => setForm({ ...form, serviceChargeEnabled: e.target.checked })} className="w-4 h-4" />
          <span className="text-sm">Enable Service Charge</span>
          {form.serviceChargeEnabled && (
            <input type="number" value={form.serviceChargePercent} onChange={(e) => setForm({ ...form, serviceChargePercent: +e.target.value })} className="input w-20 ml-2" />
          )}
          {form.serviceChargeEnabled && <span className="text-sm text-gray-400">%</span>}
        </label>
      </div>

      <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3 disabled:opacity-50">
        {loading ? 'Saving...' : '💾 Save Settings'}
      </button>
    </div>
  );
};

export default Settings;