import React, { useRef, useState } from 'react';
import { UploadCloud, X, AlertCircle, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({
  files = [],
  onChange,
  maxFiles = 5,
  maxSizeMB = 5,
  label = 'Upload Reference Images',
  description = 'JPEG, PNG or WebP (max 5MB per photo)',
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (incomingList) => {
    setError('');
    const validFiles = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (files.length + incomingList.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    Array.from(incomingList).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not a valid image`);
        return;
      }
      if (file.size > maxBytes) {
        setError(`"${file.name}" exceeds ${maxSizeMB}MB limit`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview: previewUrl,
        name: file.name,
        size: file.size,
      });
    });

    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const removed = newFiles.splice(index, 1)[0];
    if (removed?.preview && removed.preview.startsWith('blob:')) {
      URL.revokeObjectURL(removed.preview);
    }
    onChange(newFiles);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-[13px] font-semibold text-[#111827] tracking-[-0.01em]">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[20px] p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-[#ff0457] bg-[#ffe5ee]/60 scale-[1.01]'
            : 'border-[#d4d4d8] bg-[#f8f7fb] hover:border-[#ff0457]/60 hover:bg-[#ffe5ee]/25'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              handleFiles(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
              dragActive ? 'bg-[#ff0457] text-white' : 'bg-white text-[#ff0457] shadow-sm border border-[#eae9ee]'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-[14px] font-semibold text-[#111827] mb-1">
            Click to upload <span className="text-[#8e8e93] font-normal">or drag and drop</span>
          </p>
          <p className="text-[12px] text-[#8e8e93]">
            {description} ({files.length}/{maxFiles} uploaded)
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-[#ef4444] bg-[#fff1f2] p-3 rounded-xl border border-[#fecdd3]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Previews Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
          {files.map((item, idx) => {
            const imgUrl = item.preview || item.url || item;
            return (
              <div
                key={idx}
                className="group relative aspect-square rounded-[14px] overflow-hidden border border-[#eae9ee] bg-[#f8f7fb]"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#a1a1aa]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  aria-label="Remove image"
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/75 text-white hover:bg-[#ff0457] transition-all shadow-sm sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
