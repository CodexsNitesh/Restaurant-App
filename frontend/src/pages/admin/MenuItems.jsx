import { useState } from 'react';
import useApi from '../../hooks/userApi';
import { getMenuItems, getCategories, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/api';
import Modal from '../../components/admin/Modal';
import { imgUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', category: '', foodType: 'veg', isAvailable: true };

const MenuItems = () => {
  const { data: items, loading, refetch } = useApi(getMenuItems);
  const { data: categories } = useApi(getCategories);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [filterCat, setFilterCat] = useState('');

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setImageFile(null);
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, category: item.category?._id || item.category });
    setEditing(item._id);
    setImageFile(null);
    setModal(true);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) await updateMenuItem(editing, fd);
      else await createMenuItem(fd);

      toast.success(editing ? 'Item updated' : 'Item added');
      setModal(false);
      refetch();
    } catch {
      toast.error('Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(id);
      toast.success('Deleted');
      refetch();
    } catch {
      toast.error('Error deleting');
    }
  };

  const toggleAvail = async (item) => {
    try {
      const fd = new FormData();
      fd.append('isAvailable', !item.isAvailable);
      await updateMenuItem(item._id, fd);
      refetch();
    } catch {
      toast.error('Error updating');
    }
  };

  const filtered = filterCat
    ? items?.filter((i) => i.category?._id === filterCat || i.category === filterCat)
    : items;

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-gray-100 p-6 rounded-2xl shadow-sm">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Menu Items ({filtered?.length || 0})
          </h2>

          <div className="flex gap-2">
            <select
              className="bg-gray-50 border border-gray-300 text-black rounded-lg px-3 py-2"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={openAdd}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Empty */}
        {filtered?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-100 rounded-2xl shadow-sm">
            <p className="text-4xl mb-2">🍽️</p>
            <p>No items yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-gray-100/80 rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              
              {/* Head */}
              <thead className="bg-gray-200/70 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filtered?.map((item) => (
                  <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-200/40 transition">
                    
                    <td className="px-4 py-3 flex items-center gap-3">
                      {item.image && (
                        <img
                          src={imgUrl(item.image)}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {item.category?.name || '—'}
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ₹{item.price}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.foodType === 'veg'
                          ? 'bg-green-100/70 text-green-800'
                          : 'bg-red-100/70 text-red-800'
                      }`}>
                        {item.foodType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvail(item)}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.isAvailable
                            ? 'bg-green-100/70 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                      </button>
                    </td>

                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Item' : 'Add Item'}>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          
          <input
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full"
            rows={2}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Category</option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
              value={form.foodType}
              onChange={(e) => setForm({ ...form, foodType: e.target.value })}
            >
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="vegan">Vegan</option>
            </select>

            <select
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
              value={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.value === 'true' })}
            >
              <option value="true">Available</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>

          <input
            type="file"
            accept="image/*"
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 w-full"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div className="flex gap-2 pt-4 border-t mt-4">
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex-1 hover:bg-gray-800"
          >
            Save
          </button>

          <button
            onClick={() => setModal(false)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex-1 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

      </Modal>
    </div>
  );
};

export default MenuItems;