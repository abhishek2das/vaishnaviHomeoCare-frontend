import React, { useState, useRef, useEffect } from 'react';
import { Trash2, X, Upload, Image as ImageIcon, Video, Filter } from 'lucide-react';
import ImageUploader from '../../components/common/ImageUploader';
import { API_ENDPOINTS } from '../../api/endpoints';

export default function AdminGallery() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Photos', 'Videos'
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const mapFilterToApiType = (f) => {
    if (f === 'Photos') return 'IMAGE';
    if (f === 'Videos') return 'VIDEO';
    return undefined;
  };

  const isImageType = (t) => {
    if (!t) return false;
    const s = String(t).toLowerCase();
    return s === 'image' || s === 'image' || s === 'photo' || s.includes('image') || s.includes('photo');
  };
  const isVideoType = (t) => {
    if (!t) return false;
    const s = String(t).toLowerCase();
    return s === 'video' || s.includes('video') || s.includes('mp4');
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Photos') return isImageType(item.type);
    if (filter === 'Videos') return isVideoType(item.type);
    return true;
  });

  const fetchGallery = async (type) => {
    try {
      let url = `${API_ENDPOINTS.GALLERY.GET_ALL}?page=0&limit=200`;
      if (type) url += `&type=${type}`;
      const res = await fetch(url);
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
      const res = await fetch(API_ENDPOINTS.GALLERY.DELETE(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media');
      // Refresh gallery after successful delete
      await fetchGallery(mapFilterToApiType(filter));
    } catch (err) {
      console.error('Delete error', err);
      alert(err.message || 'Unable to delete media');
    }
  };

  const handleImageSelected = async (url) => {
    // Refresh gallery after ImageUploader uploads/returns an image URL
    setIsUploaderOpen(false);
    await fetchGallery(mapFilterToApiType(filter));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-sm text-gray-500">Manage hospital photos and videos.</p>
        </div>
        <button 
          onClick={() => setIsUploaderOpen(true)}
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
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
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
                  className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Media"
                >
                  <Trash2 size={16} />
                </button>
                
                {/* Video Play Icon Indicator */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  Uploaded on {formatDate(item.createdAt) || 'Unknown Date'}
                </p>
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
            onClick={() => setIsUploaderOpen(true)}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Upload Media
          </button>
        </div>
      )}

      <ImageUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onImageSelected={handleImageSelected}
      />
    </div>
  );
}
