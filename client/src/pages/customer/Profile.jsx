import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Camera,
  Plus,
  Trash2,
  Edit2,
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

  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

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
    isDefault: false,
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
      isDefault: (user?.addresses?.length || 0) === 0,
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
      isDefault: addr.isDefault || false,
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
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      <div>
        <span className="eyebrow">Account Settings</span>
        <h1 className="editorial-serif text-4xl sm:text-5xl text-[#111827] font-normal mt-0.5">
          Profile &amp; Delivery Addresses
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[#6e6e73] mt-1">
          Manage your studio details, password, and saved crated shipping addresses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Personal Info & Password */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
            <h3 className="text-[18px] font-bold text-[#111827] border-b border-[#f2f1f6] pb-3">
              Personal Information
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#ffe5ee] border-2 border-white shadow-md">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-[#ff0155]">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload new avatar"
                    className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[13px] font-semibold text-[#ff0457] hover:underline"
                  >
                    Upload New Photo
                  </button>
                  <p className="text-[11px] text-[#8e8e93] mt-0.5">
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
                helperText="Email address is linked to your collector account."
              />

              <Button
                type="submit"
                variant="pink"
                size="md"
                loading={updatingProfile}
              >
                Save Profile
              </Button>
            </form>
          </div>

          <div className="rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6">
            <h3 className="text-[18px] font-bold text-[#111827] border-b border-[#f2f1f6] pb-3">
              Security &amp; Password
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
                variant="primary"
                size="md"
                loading={updatingPassword}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>

        {/* Right: Delivery Addresses */}
        <div className="lg:col-span-6 rounded-[24px] bg-white border border-[#eae9ee] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#f2f1f6] pb-3">
            <h3 className="text-[18px] font-bold text-[#111827]">
              Saved Shipping Addresses
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
            <div className="space-y-3.5">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 rounded-[18px] border transition-all space-y-2 ${
                    addr.isDefault
                      ? 'border-[#ff0457] bg-[#ffe5ee]/35'
                      : 'border-[#eae9ee] bg-[#f8f7fb]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-[#111827]">
                        {addr.recipientName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ff0457] text-white px-2.5 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditAddressModal(addr)}
                        className="p-1.5 text-[#6e6e73] hover:text-[#111827] rounded-full hover:bg-white transition-colors"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingAddressId(addr._id)}
                        className="p-1.5 text-[#6e6e73] hover:text-[#ef4444] rounded-full hover:bg-white transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#3c3c43]">Phone: {addr.phone}</p>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country || 'India'}
                  </p>

                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr._id)}
                      className="text-[12px] text-[#ff0457] hover:underline font-semibold"
                    >
                      Set as Default Shipping Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ffe5ee] text-[#ff0457] flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[13px] text-[#6e6e73]">
                No delivery addresses saved yet. Add one for faster commission checkout.
              </p>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={openNewAddressModal}
              >
                Add Shipping Address
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Address' : 'Add Delivery Address'}
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

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultCheckbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="rounded text-[#ff0457] focus:ring-[#ff0457]"
            />
            <label
              htmlFor="isDefaultCheckbox"
              className="text-[13px] text-[#3c3c43] cursor-pointer"
            >
              Make this my default shipping address
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#f2f1f6]">
            <Button
              variant="outline"
              onClick={() => setAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="pink" loading={savingAddress}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingAddressId}
        onClose={() => setDeletingAddressId(null)}
        onConfirm={handleDeleteAddress}
        title="Delete Address?"
        message="Are you sure you want to remove this delivery address?"
        confirmText="Delete Address"
      />
    </div>
  );
};

export default Profile;
