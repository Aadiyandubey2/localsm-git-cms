import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Search, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import SectionCard from '../components/common/SectionCard';
import {
  brandingApi,
  businessesApi,
  collectImageUrls,
  footerApi,
  foundersApi,
  getApiErrorMessage,
  heroesApi,
  navigationApi,
  uploadApi,
  websiteSettingsApi,
} from '../services/api';
import { addMediaItem, mergeDiscoveredUrls, removeMediaItem } from '../store/mediaSlice';
import type { AdminDispatch, AdminRootState } from '../store';
import type { MediaItem } from '../types/cms';

export default function MediaLibraryPage() {
  const dispatch = useDispatch<AdminDispatch>();
  const mediaItems = useSelector((state: AdminRootState) => state.media.items);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  useEffect(() => {
    const discoverImages = async () => {
      try {
        const [heroes, founders, businesses, navigation, footer, branding, settings] = await Promise.all([
          heroesApi.list(),
          foundersApi.list(),
          businessesApi.list(),
          navigationApi.list(),
          footerApi.list(),
          brandingApi.list(),
          websiteSettingsApi.list(),
        ]);

        const urls = collectImageUrls([heroes, founders, businesses, navigation, footer, branding, settings]);
        dispatch(mergeDiscoveredUrls(urls));
      } finally {
        setIsLoading(false);
      }
    };

    discoverImages();
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return mediaItems;
    }
    return mediaItems.filter((item) => item.name.toLowerCase().includes(query) || item.url.toLowerCase().includes(query));
  }, [mediaItems, search]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Image URL copied');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadApi.uploadFile(file, setUploadProgress);
      const url = result.secure_url || result.url;
      if (!url) {
        throw new Error('No URL returned from upload');
      }
      dispatch(
        addMediaItem({
          id: `upload-${Date.now()}`,
          url,
          publicId: result.public_id,
          name: result.original_filename || file.name,
          uploadedAt: new Date().toISOString(),
        })
      );
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Upload failed'));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }
    const removeFromLibrary = () => {
      dispatch(removeMediaItem(deleteTarget.id));
      setDeleteTarget(null);
      toast.success('Removed from media library');
    };

    if (!deleteTarget.publicId) {
      removeFromLibrary();
      return;
    }

    uploadApi
      .deleteFile(deleteTarget.publicId)
      .then(removeFromLibrary)
      .catch((error) => {
        toast.error(getApiErrorMessage(error, 'Failed to delete image'));
      });
  };

  if (isLoading) {
    return <LoadingSkeleton rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Media Library' }]} />
        <h1 className="mt-2 text-2xl font-semibold text-white">Media Library</h1>
        <p className="mt-1 text-sm text-slate-400">Upload, browse, copy, and reuse images across all sections.</p>
      </div>

      <SectionCard title="Upload Images">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="admin-btn admin-btn-primary cursor-pointer">
            <Upload size={16} />
            {isUploading ? `Uploading ${uploadProgress}%` : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (file) {
                  await handleUpload(file);
                }
                event.currentTarget.value = '';
              }}
            />
          </label>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="admin-input pl-10"
              placeholder="Search images..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="admin-card overflow-hidden p-0">
            <img src={item.url} alt={item.name} className="h-40 w-full object-cover" />
            <div className="space-y-3 p-4">
              <p className="truncate text-sm font-medium text-slate-200">{item.name}</p>
              <p className="truncate text-xs text-slate-500">{item.url}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => copyUrl(item.url)} className="admin-btn admin-btn-secondary flex-1">
                  <Copy size={14} />
                  Copy URL
                </button>
                <button type="button" onClick={() => setDeleteTarget(item)} className="admin-btn admin-btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-400">No images found. Upload one or add images in section editors.</p>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Remove from library?"
        message="This removes the image from your local media library list. It does not delete the file from Cloudinary."
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
