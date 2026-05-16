import React, { useEffect, useState, useRef } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import { API_ENDPOINTS, BASE_URL } from '../../api/endpoints';

export default function ImageUploader({ isOpen, onClose, onImageSelected }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const buildImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${BASE_URL}/${url.replace(/^\//, '')}`;
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_ENDPOINTS.GALLERY.GET_ALL}?page=0&limit=50`);
      if (!res.ok) throw new Error('Failed to fetch gallery images');
      const data = await res.json();
      setGallery(Array.isArray(data.content) ? data.content : []);
    } catch (err) {
      setError(err.message || 'Unable to load images');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'gallery') {
      fetchGallery();
    }
  }, [isOpen, activeTab]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const res = await fetch(API_ENDPOINTS.GALLERY.CREATE, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      onImageSelected(data.url || buildImageUrl(data.url));
      onClose();
    } catch (err) {
      alert(err.message || 'Unable to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUseImage = (item) => {
    onImageSelected(item.url || buildImageUrl(item.url));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Image Uploader</h2>
            <p className="text-sm text-gray-500">Upload a new image or choose one from the gallery.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-full ${activeTab === 'upload' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-full ${activeTab === 'gallery' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Use Existing Image
            </button>
          </div>

          {activeTab === 'upload' ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-4">Select an image file to upload to the gallery.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mx-auto"
                />
              </div>
              {selectedFile && (
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload & Use Image'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading gallery...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : gallery.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No images found in gallery.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={buildImageUrl(item.url)}
                          alt={item.type}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.type}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{item.url}</p>
                        <button
                          type="button"
                          onClick={() => handleUseImage(item)}
                          className="mt-4 w-full inline-flex items-center justify-center rounded-lg bg-green-600 text-white px-3 py-2 text-sm hover:bg-green-700"
                        >
                          Use this image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
