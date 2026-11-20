import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Lock,
  Camera,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateProfile, updatePassword, refreshUser, isAuthenticated, loading: authLoading } = useAuth();
  const { setPageTitle } = useSettings();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Address CRUD State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    setPageTitle('My Profile & Addresses');
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setName(user.name || '');
      setAvatarPreview(user.avatar?.url || '');
    }
  }, [user, isAuthenticated, authLoading, navigate, setPageTitle]);

  // Handle Avatar Change
  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) {
        formData.append('image', avatarFile);
      }
      await updateProfile(formData);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Address Actions
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      recipientName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: (user?.addresses?.length || 0) === 0
    });
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      recipientName: addr.recipientName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
      isDefault: addr.isDefault || false
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        await api.put(`/users/addresses/${editingAddressId}`, addressForm);
        toast.success('Address updated');
      } else {
        await api.post('/users/addresses', addressForm);
        toast.success('Address added');
      }
      setAddressModalOpen(false);
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!deletingAddressId) return;
    try {
      await api.delete(`/users/addresses/${deletingAddressId}`);
      toast.success('Address deleted');
      setDeletingAddressId(null);
      refreshUser();
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      await api.patch(`/users/addresses/${addrId}/default`);
      toast.success('Default address updated');
      refreshUser();
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-20">
      <div>
        <span className="eyebrow">ACCOUNT SETTINGS</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
          Profile & Delivery Addresses
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
          Manage your personal details, credentials, and shipping addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Profile Edit & Change Password */}
        <div className="lg:col-span-6 space-y-8">
          {/* Profile Details Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-cream-200 border-2 border-white shadow-md">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-charcoal-500">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-charcoal-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 underline"
                  >
                    Upload New Avatar
                  </button>
                  <p className="text-[11px] text-charcoal-400 mt-0.5">
                    JPG, PNG or WebP under 5 MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </div>
              </div>

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email address cannot be changed."
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={updatingProfile}
              >
                Save Profile
              </Button>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
            <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
              Change Password
            </h3>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="md"
                loading={updatingPassword}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Saved Delivery Addresses */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Saved Delivery Addresses
            </h3>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={openNewAddressModal}
            >
              Add Address
            </Button>
          </div>

          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    addr.isDefault
                      ? 'border-terracotta-300 bg-terracotta-50/40 shadow-sm'
                      : 'border-cream-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-charcoal-900">
                        {addr.recipientName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-terracotta-500 text-white px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditAddressModal(addr)}
                        className="p-1.5 text-charcoal-400 hover:text-charcoal-800 rounded-lg hover:bg-cream-100"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingAddressId(addr._id)}
                        className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-600">Phone: {addr.phone}</p>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country || 'India'}
                  </p>

                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr._id)}
                      className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold"
                    >
                      Set as Default Shipping Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <MapPin className="w-8 h-8 text-cream-300 mx-auto" />
              <p className="text-xs text-charcoal-500">
                No delivery addresses saved yet. Add one for smooth custom order checkout.
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={openNewAddressModal}
              >
                Add Your Address
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Address Add / Edit Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Recipient Name"
              value={addressForm.recipientName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, recipientName: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Street Address / Flat / Building"
            value={addressForm.street}
            onChange={(e) =>
              setAddressForm({ ...addressForm, street: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              required
            />
            <Input
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              required
            />
            <Input
              label="PIN Code"
              value={addressForm.postalCode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, postalCode: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefaultCheckbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="rounded text-terracotta-500 focus:ring-terracotta-400"
            />
            <label
              htmlFor="isDefaultCheckbox"
              className="text-xs text-charcoal-700 cursor-pointer"
            >
              Make this my default shipping address
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
            <Button
              variant="secondary"
              onClick={() => setAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingAddress}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Address Dialog */}
      <ConfirmDialog
        isOpen={!!deletingAddressId}
        onClose={() => setDeletingAddressId(null)}
        onConfirm={handleDeleteAddress}
        title="Delete Address?"
        message="Are you sure you want to remove this delivery address from your profile?"
        confirmText="Delete Address"
      />
    </div>
  );
};

export default Profile;
