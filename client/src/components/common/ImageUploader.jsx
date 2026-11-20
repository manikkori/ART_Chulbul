import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUploader = ({
  files = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  label = 'Upload Reference Photos',
  description = 'Drag & drop high-resolution photos, or browse (JPG, PNG, WebP up to 5 MB each)'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndAddFiles = (selectedFiles) => {
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} reference photos.`);
      return;
    }

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a valid format. Please use JPG, PNG, or WebP.`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds ${maxSizeMB} MB limit.`);
        continue;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({ file, previewUrl, name: file.name, size: file.size });
    }

    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
    // Reset file input so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    const updated = [...files];
    // Revoke object url to free memory
    URL.revokeObjectURL(updated[index].previewUrl);
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
            {label} <span className="text-terracotta-600">*</span>
          </label>
          <span className="text-xs text-charcoal-400">
            {files.length} / {maxFiles} images
          </span>
        </div>
      )}

      {/* Drop Zone */}
      {files.length < maxFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging
              ? 'border-terracotta-500 bg-terracotta-50/60 scale-[1.01]'
              : 'border-cream-300 bg-cream-100/50 hover:bg-cream-100 hover:border-terracotta-400'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white text-terracotta-500 flex items-center justify-center shadow-sm border border-cream-200">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-charcoal-800">
                Click to browse or drop your photos here
              </p>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                {description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Thumbnails Preview */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {files.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden border border-cream-200 bg-white shadow-sm group"
            >
              <img
                src={item.previewUrl || item.url}
                alt={item.name || `Upload ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-charcoal-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-charcoal-900/60 text-white text-[10px] px-2 py-1 truncate">
                {item.name || `Photo ${idx + 1}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
