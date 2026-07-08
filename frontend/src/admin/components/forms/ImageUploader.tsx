import React, { useState } from 'react';
import { ImagePlus, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getApiErrorMessage, uploadApi } from '../../services/api';
import { addMediaItem } from '../../store/mediaSlice';
import type { AdminDispatch } from '../../store';

type ImageUploaderProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

export default function ImageUploader({ label, value, onChange, hint }: ImageUploaderProps) {
  const dispatch = useDispatch<AdminDispatch>();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadApi.uploadFile(file, setProgress);
      const url = result.secure_url || result.url || '';

      if (!url) {
        throw new Error('Upload succeeded but no image URL was returned.');
      }

      onChange(url);
      dispatch(
        addMediaItem({
          id: `upload-${Date.now()}`,
          url,
          publicId: result.public_id,
          name: result.original_filename || file.name,
          uploadedAt: new Date().toISOString(),
        })
      );
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Upload failed. You can paste an image URL instead.'));
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const applyManualUrl = () => {
    if (!manualUrl.trim()) {
      return;
    }
    onChange(manualUrl.trim());
    dispatch(
      addMediaItem({
        id: `manual-${Date.now()}`,
        url: manualUrl.trim(),
        name: manualUrl.trim().split('/').pop() || 'image',
        uploadedAt: new Date().toISOString(),
      })
    );
    setManualUrl('');
    toast.success('Image URL applied');
  };

  return (
    <div className="space-y-3">
      <label className="admin-label">{label}</label>

      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50">
          <img src={value} alt="Preview" className="h-48 w-full object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-md bg-red-500/90 p-2 text-white hover:bg-red-500"
              title="Remove image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={async (event) => {
            event.preventDefault();
            setIsDragActive(false);
            const file = event.dataTransfer.files?.[0];
            if (file?.type.startsWith('image/')) {
              await handleUpload(file);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="mb-2 animate-spin text-blue-400" size={28} />
              <p className="text-sm text-slate-300">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              <ImagePlus className="mb-2 text-slate-400" size={28} />
              <p className="text-sm font-medium text-slate-200">Drag & drop an image here</p>
              <p className="mt-1 text-xs text-slate-400">or click to browse (max 10MB)</p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="admin-input"
          placeholder="Or paste image URL (e.g. /images/hero-building.jpg)"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
        />
        <button type="button" onClick={applyManualUrl} className="admin-btn admin-btn-secondary shrink-0">
          <Link2 size={16} />
          Use URL
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="admin-btn admin-btn-secondary shrink-0"
          disabled={isUploading}
        >
          <Upload size={16} />
          {value ? 'Replace' : 'Upload'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            await handleUpload(file);
          }
          event.currentTarget.value = '';
        }}
      />

      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}
