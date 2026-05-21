import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X, Upload, Image as ImageIcon, Video, Play, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Photos', 'Videos'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const mapFilterToApiType = (f) => {
    if (f === 'Photos') return 'IMAGE';
    if (f === 'Videos') return 'VIDEO';
    return undefined;
  };

  const isImageType = (t) => {
    if (!t) return false;
    const s = String(t).toLowerCase();
    return s === 'image' || s === 'photo' || s.includes('image') || s.includes('photo');
  };
  const isVideoType = (t) => {
    if (!t) return false;
    const s = String(t).toLowerCase();
    return s === 'video' || s.includes('video') || s.includes('mp4');
  };

  const isVideoItem = (item) => isVideoType(item?.type);

  const handlePreviewMedia = (item) => {
    setSelectedMedia(item);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setSelectedMedia(null);
    setIsPreviewModalOpen(false);
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Photos') return isImageType(item.type);
    if (filter === 'Videos') return isVideoType(item.type);
    return true;
  });

  const fetchGallery = async (type) => {
    try {
      let url = `${API_ENDPOINTS.PHOTO_GALLERY.GET_ALL}?page=0&limit=200`;
      if (type) url += `&type=${type}`;
      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to load gallery');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setMediaItems(items);
    } catch (err) {
      console.error('Gallery load error', err);
      setMediaItems([]);
    }
  };

  useEffect(() => { fetchGallery(mapFilterToApiType(filter)); }, [filter]);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media file?')) return;
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.PHOTO_GALLERY.DELETE(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media');
      // Refresh gallery after successful delete
      await fetchGallery(mapFilterToApiType(filter));
    } catch (err) {
      console.error('Delete error', err);
      alert(err.message || 'Unable to delete media');
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadError('');
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload.');
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
      if (!res.ok) throw new Error('Failed to upload media');
      await fetchGallery(mapFilterToApiType(filter));
      setIsUploadModalOpen(false);
      resetUploadForm();
    } catch (err) {
      setUploadError(err.message || 'Unable to upload media');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-sm text-gray-500">Manage hospital photos and videos.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Upload size={18} className="mr-2" />
          Upload Media
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6 inline-flex space-x-1">
        {['All', 'Photos', 'Videos'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filter === f 
                ? 'bg-slate-800 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f === 'All' && <Filter size={16} className="mr-2" />}
            {f === 'Photos' && <ImageIcon size={16} className="mr-2" />}
            {f === 'Videos' && <Video size={16} className="mr-2" />}
            {f}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col">
              <div className={`relative aspect-video bg-gray-100 overflow-hidden ${isVideoItem(item) ? 'cursor-pointer' : ''}`}>
                {item.type === 'IMAGE' ? (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover"
                    controls={false}
                  />
                )}
                
                {/* Badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                  {item.type === 'IMAGE' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
                  {item.type === 'IMAGE' ? 'Photo' : 'Video'}
                </div>

                {/* Overlay Delete Button */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 z-20 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Media"
                >
                  <Trash2 size={16} />
                </button>

                {/* Video Play Button Overlay */}
                {isVideoItem(item) && (
                  <button
                    type="button"
                    onClick={() => handlePreviewMedia(item)}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                    title="Play Video"
                  >
                    <div className="w-14 h-14 bg-black/70 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Play size={24} />
                    </div>
                  </button>
                )}
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
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Media Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            {filter === 'All' ? "Your gallery is empty." : `You don't have any ${filter.toLowerCase()} in your gallery.`}
          </p>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Upload Media
          </button>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upload Media</h2>
                <p className="text-sm text-gray-500">Add a new gallery item with title and description.</p>
              </div>
              <button onClick={() => { setIsUploadModalOpen(false); resetUploadForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image/Video File <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Upload size={16} /> Choose File
                  </button>
                  <span className="text-sm text-gray-500">{uploadFile ? uploadFile.name : 'No file selected'}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

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
                {uploading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Preview Media</h2>
                <p className="text-sm text-gray-500">Preview the selected video in a larger view.</p>
              </div>
              <button onClick={closePreviewModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {isVideoItem(selectedMedia) ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] bg-black rounded-2xl"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full rounded-2xl object-contain"
                />
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">{selectedMedia.title || 'Untitled'}</h3>
                {selectedMedia.description && (
                  <p className="mt-2 text-sm text-gray-600">{selectedMedia.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
