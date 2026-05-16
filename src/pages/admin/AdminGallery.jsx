import React, { useState, useRef } from 'react';
import { Trash2, X, Upload, Image as ImageIcon, Video, Filter } from 'lucide-react';

export default function AdminGallery() {
  // Mock data for gallery items
  const initialMedia = [
    { id: 1, type: 'photo', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop', title: 'Hospital Front Entrance', date: '2023-11-10' },
    { id: 2, type: 'photo', url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=600&auto=format&fit=crop', title: 'Modern Operation Theatre', date: '2023-11-08' },
    { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Virtual Tour 2023', date: '2023-11-01' },
    { id: 4, type: 'photo', url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=600&auto=format&fit=crop', title: 'Waiting Area', date: '2023-10-25' },
    { id: 5, type: 'photo', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop', title: 'Laboratory Equipment', date: '2023-10-20' },
  ];

  const [mediaItems, setMediaItems] = useState(initialMedia);
  const [filter, setFilter] = useState('All'); // 'All', 'Photos', 'Videos'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    file: null,
    previewUrl: null,
    type: null // 'photo' or 'video'
  });

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Photos') return item.type === 'photo';
    if (filter === 'Videos') return item.type === 'video';
    return true;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this media file?')) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
    }
  };

  const openModal = () => {
    setUploadData({ title: '', file: null, previewUrl: null, type: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Cleanup preview URL to avoid memory leaks
    if (uploadData.previewUrl && !uploadData.previewUrl.startsWith('http')) {
      URL.revokeObjectURL(uploadData.previewUrl);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let fileType = null;
    if (file.type.startsWith('image/')) {
      fileType = 'photo';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    } else {
      alert('Please upload an image or video file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    setUploadData(prev => ({
      ...prev,
      file,
      type: fileType,
      previewUrl
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      alert('Please select a file to upload.');
      return;
    }
    if (!uploadData.title.trim()) {
      alert('Please enter a title/caption.');
      return;
    }

    const newItem = {
      id: Date.now(),
      type: uploadData.type,
      url: uploadData.previewUrl, // In a real app, this would be the URL from the server after upload
      title: uploadData.title,
      date: new Date().toISOString().split('T')[0]
    };

    setMediaItems([newItem, ...mediaItems]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-sm text-gray-500">Manage hospital photos and videos.</p>
        </div>
        <button 
          onClick={openModal}
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
                {item.type === 'photo' ? (
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
                  {item.type === 'photo' ? <ImageIcon size={12} className="mr-1" /> : <Video size={12} className="mr-1" />}
                  {item.type === 'photo' ? 'Photo' : 'Video'}
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
                <h3 className="font-semibold text-gray-800 line-clamp-2" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  Uploaded on {item.date}
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
            onClick={openModal}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Upload Media
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">Upload Media</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File <span className="text-red-500">*</span></label>
                  
                  {!uploadData.previewUrl ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-green-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload image or video</p>
                      <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, MP4</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video border border-gray-200">
                      {uploadData.type === 'photo' ? (
                        <img src={uploadData.previewUrl} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <video src={uploadData.previewUrl} className="w-full h-full object-contain" controls />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadData(prev => ({ ...prev, file: null, previewUrl: null, type: null }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-sm"
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                        {uploadData.type === 'photo' ? 'Photo' : 'Video'}
                      </div>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title / Caption <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    value={uploadData.title} 
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter a descriptive title"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" onClick={closeModal}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!uploadData.file}
                  className="px-5 py-2.5 bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Upload Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
