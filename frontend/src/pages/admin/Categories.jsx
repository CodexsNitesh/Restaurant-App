import { useState } from 'react';
import useApi from '../../hooks/userApi';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', sortOrder: 0 };

const Categories = () => {
  const { data: categories, loading, refetch } = useApi(getCategories);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setModal(true); };
  const openEdit = (cat) => { setForm(cat); setEditing(cat._id); setModal(true); };

  const handleSubmit = async () => {
    try {
      if (editing) await updateCategory(editing, form);
      else await createCategory(form);
      toast.success(editing ? 'Category updated' : 'Category added');
      setModal(false);
      refetch();
    } catch { toast.error('Error saving category'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await deleteCategory(id); toast.success('Deleted'); refetch(); }
    catch { toast.error('Error deleting'); }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categories ({categories?.length || 0})</h2>
        <button onClick={openAdd} className="btn-primary">+ Add Category</button>
      </div>

      {categories?.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">📂</p>
          <p>No categories yet. Add one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <div key={cat._id} className="card flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.description || 'No description'}</p>
                <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="text-sm text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(cat._id)} className="text-sm text-red-400 hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-3">
          <div>
            <label className="label">Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input className="input" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSubmit} className="btn-primary flex-1">Save</button>
            <button onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;