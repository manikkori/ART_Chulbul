import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Star, Check, X, Search } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminArtworks = () => {
  const { setPageTitle } = useSettings();
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    setPageTitle('Manage Showcase Artworks');
    fetchData();
  }, [setPageTitle]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        api.get('/artworks?all=true&limit=100'),
        api.get('/categories?all=true')
      ]);
      if (artRes.data?.success) setArtworks(artRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (err) {
      toast.error('Failed to load artworks data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory(categories[0]?._id || '');
    setMedium('');
    setDimensions('A3 (11.7 x 16.5 in)');
    setTimeTaken('');
    setStartingPrice('');
    setTags('');
    setIsFeatured(false);
    setIsPublished(true);
    setImageFiles([]);
    setExistingImages([]);
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingId(art._id);
    setTitle(art.title);
    setDescription(art.description);
    setCategory(art.category?._id || art.category);
    setMedium(art.medium);
    setDimensions(art.dimensions);
    setTimeTaken(art.timeTaken || '');
    setStartingPrice(art.startingPrice);
    setTags(art.tags?.join(', ') || '');
    setIsFeatured(art.isFeatured);
    setIsPublished(art.isPublished);
    setImageFiles([]);
    setExistingImages(art.images || []);
    setModalOpen(true);
  };

  const handleSaveArtwork = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !medium || !dimensions || startingPrice === '') {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!editingId && imageFiles.length === 0) {
      toast.error('Please select at least one artwork image');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('medium', medium);
      formData.append('dimensions', dimensions);
      formData.append('timeTaken', timeTaken);
      formData.append('startingPrice', startingPrice);
      formData.append('tags', tags);
      formData.append('isFeatured', isFeatured);
      formData.append('isPublished', isPublished);

      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
      }

      if (editingId) {
        await api.put(`/artworks/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Artwork updated successfully');
      } else {
        await api.post('/artworks', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Artwork added to showcase');
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save artwork');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArtwork = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/artworks/${deletingId}`);
      toast.success('Artwork removed');
      setDeletingId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete artwork');
    }
  };

  const filteredArtworks = artworks.filter(
    (art) =>
      art.title?.toLowerCase().includes(search.toLowerCase()) ||
      art.medium?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">GALLERY MANAGEMENT</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Showcase Artworks
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Manage public portfolio pieces that inspire customer commissions.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          Add New Artwork
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Filter by title or medium..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            <Skeleton count={5} className="h-12" />
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              title="No artworks found"
              description="Upload your past commission photos to showcase your artistic range."
              actionText="Add Artwork"
              onAction={openCreateModal}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/60 uppercase tracking-wider text-charcoal-500 font-semibold border-b border-cream-200">
                <tr>
                  <th className="py-3 px-6">Piece</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Medium & Dimensions</th>
                  <th className="py-3 px-6">Base Price</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredArtworks.map((art) => (
                  <tr key={art._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                        <img
                          src={art.coverImage?.url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-charcoal-900">{art.title}</p>
                        {art.isFeatured && (
                          <span className="text-[10px] text-terracotta-600 font-bold uppercase tracking-wide flex items-center gap-1">
                            <Star className="w-3 h-3 fill-terracotta-500 text-terracotta-500" />
                            Featured on Home
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-charcoal-700 font-medium">
                      {art.category?.name || '-'}
                    </td>
                    <td className="py-4 px-6 text-charcoal-600">
                      {art.medium} ({art.dimensions})
                    </td>
                    <td className="py-4 px-6 font-bold text-charcoal-900">
                      {formatPrice(art.startingPrice)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          art.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-cream-200 text-charcoal-600'
                        }`}
                      >
                        {art.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 text-charcoal-600 hover:text-charcoal-900 rounded-lg hover:bg-cream-100"
                        title="Edit artwork"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(art._id)}
                        className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete artwork"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
        title={editingId ? 'Edit Showcase Artwork' : 'Add Artwork to Showcase'}
      >
        <form onSubmit={handleSaveArtwork} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <Input
            label="Artwork Title"
            placeholder="e.g. Timeless Monochromatic Bridal Portrait"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
                Category Medium <span className="text-terracotta-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2.5 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Medium Details"
              placeholder="e.g. Willow Charcoal on Fabriano 300gsm"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Dimensions"
              placeholder="e.g. A3 (11.7 x 16.5 in)"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              required
            />
            <Input
              label="Starting Price in INR (₹)"
              type="number"
              placeholder="e.g. 2999"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
            />
            <Input
              label="Time Taken (Optional)"
              placeholder="e.g. 18 hours across 4 days"
              value={timeTaken}
              onChange={(e) => setTimeTaken(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Description & Artistic Story <span className="text-terracotta-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the commission story, lighting techniques, and emotional background..."
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            placeholder="Portrait, Charcoal, Realistic, Wedding"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Upload Images (Select 1 to 5 images)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files))}
              className="text-xs text-charcoal-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-terracotta-50 file:text-terracotta-600"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-terracotta-500"
              />
              <span>Feature on Homepage ("From the Easel")</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-terracotta-500"
              />
              <span>Published (Visible in Public Gallery)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingId ? 'Save Changes' : 'Create Artwork'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteArtwork}
        title="Delete Artwork?"
        message="This piece will be permanently removed from the public gallery and Cloudinary."
      />
    </div>
  );
};

export default AdminArtworks;
