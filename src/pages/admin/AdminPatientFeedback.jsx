import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminPatientFeedback() {
  const [mediaItems, setMediaItems] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const isImageType = (t) => {
    if (!t) return false;
    const s = String(t).toLowerCase();
    return s === 'image' || s === 'photo' || s.includes('image') || s.includes('photo');
  };

  const fetchFeedbackImages = async () => {
    try {
      const url = `${API_ENDPOINTS.PHOTO_GALLERY.GET_ALL}?type=IMAGE&page=0&limit=200`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to load patient feedback images');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setMediaItems(items.filter((item) => isImageType(item.type)));
    } catch (err) {
      console.error('Patient feedback load error', err);
      setMediaItems([]);
    }
  };

  useEffect(() => {
    fetchFeedbackImages();
  }, []);

  useEffect(() => {
    if (!uploadFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(uploadFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadFile]);

  const formatDate = (val) => {
    if (!val) return '';
    try {
      const d = new Date(val);
      if (isNaN(d)) return String(val);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return String(val);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadError('');
    setPreviewUrl(null);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      alert('Please select an image to upload.');
      return;
    }

    if (!uploadTitle.trim()) {
      alert('Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      setUploading(true);
      setUploadError('');
      const url = `${API_ENDPOINTS.PHOTO_GALLERY.CREATE}?title=${encodeURIComponent(uploadTitle.trim())}&description=${encodeURIComponent(uploadDescription.trim())}`;
      const res = await fetchWithAuth(url, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload patient feedback image');
      await fetchFeedbackImages();
      setIsUploadModalOpen(false);
      resetUploadForm();
    } catch (err) {
      setUploadError(err.message || 'Unable to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback image?')) return;

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.PHOTO_GALLERY.DELETE(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete feedback image');
      await fetchFeedbackImages();
    } catch (err) {
      console.error('Delete error', err);
      alert(err.message || 'Unable to delete image');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Feedback</h1>
          <p className="text-sm text-gray-500">Manage patient feedback image uploads.</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Upload size={18} className="mr-2" />
          Upload Image
        </button>
      </div>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 z-20 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Feedback Image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-base mb-2 truncate">{item.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{item.description || 'No description provided.'}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Uploaded on {formatDate(item.createdAt) || 'Unknown Date'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Feedback Images Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Patient feedback images can be uploaded using the button above.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Upload Image
          </button>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Patient Feedback Image</h2>
                <p className="text-sm text-gray-500">Add a new patient feedback image with title and description.</p>
              </div>
              <button onClick={() => { setIsUploadModalOpen(false); resetUploadForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image File <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Upload size={16} /> Choose Image
                  </button>
                  <span className="text-sm text-gray-500">{uploadFile ? uploadFile.name : 'No file selected'}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {previewUrl && (
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                  <img src={previewUrl} alt="Preview" className="w-full object-cover max-h-72" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Enter a short description"
                />
              </div>

              {uploadError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { setIsUploadModalOpen(false); resetUploadForm(); }}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={uploading}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
