import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCategories = () => {
  const { setPageTitle } = useSettings();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setPageTitle('Manage Art Mediums & Categories');
    fetchCategories();
  }, [setPageTitle]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories?all=true');
      if (res.data?.success) setCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setStartingPrice('');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setStartingPrice(cat.startingPrice || '');
    setDisplayOrder(cat.displayOrder || 0);
    setIsActive(cat.isActive);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please provide a category name');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('startingPrice', startingPrice || 0);
      formData.append('displayOrder', displayOrder);
      formData.append('isActive', isActive);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingId) {
        await api.put(`/categories/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category created');
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/categories/${deletingId}`);
      toast.success('Category deleted');
      setDeletingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">MEDIUM TAXONOMY</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Art Categories & Mediums
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Configure the 5+ art mediums available for custom commissions across the platform.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={4} className="h-12" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/60 uppercase tracking-wider text-charcoal-500 font-semibold border-b border-cream-200">
                <tr>
                  <th className="py-3 px-6">Medium</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Starting Price</th>
                  <th className="py-3 px-6">Artworks</th>
                  <th className="py-3 px-6">Display Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                        <img
                          src={cat.image?.url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-charcoal-900">{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 text-charcoal-600 max-w-xs truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-charcoal-900">
                      {formatPrice(cat.startingPrice)}
                    </td>
                    <td className="py-4 px-6 text-charcoal-600 font-semibold">
                      {cat.artworkCount || 0}
                    </td>
                    <td className="py-4 px-6 text-charcoal-600">
                      {cat.displayOrder}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cat.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-cream-200 text-charcoal-600'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-charcoal-600 hover:text-charcoal-900 rounded-lg hover:bg-cream-100"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cat._id)}
                        className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Gouache Fine Art"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the medium's tactile qualities and aesthetic..."
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Starting Base Price (INR)"
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
            />
            <Input
              label="Display Order (Sort)"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Category Cover Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="catActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-terracotta-500"
            />
            <label htmlFor="catActive" className="text-xs text-charcoal-700 cursor-pointer">
              Active (Visible in Custom Order form and categories listing)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingId ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        message="Cannot be undone. Categories with associated artworks cannot be removed until artworks are reassigned."
      />
    </div>
  );
};

export default AdminCategories;
