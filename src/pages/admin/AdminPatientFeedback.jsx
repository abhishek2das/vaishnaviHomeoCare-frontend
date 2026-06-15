import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Trash2, X, Plus, ImageIcon, Film, LayoutGrid, Edit, Play } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';
import ImageUploader from '../../components/common/ImageUploader';

// Inline Card media slider for admin cards (auto-slide, pause on hover)
const CardMediaSlider = ({ media }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);

  useEffect(() => setIdx(0), [media]);

  useEffect(() => {
    if (!media || media.length <= 1) return;
    if (paused) return;
    ref.current = setInterval(() => setIdx(i => (i + 1) % media.length), 1500);
    return () => clearInterval(ref.current);
  }, [media, paused]);

  if (!media || media.length === 0) return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <Film size={24} className="text-gray-300" />
    </div>
  );

  const m = media[idx];
  return (
    <div
      className="w-full h-full relative group overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {m.type === 'VIDEO' ? (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <video src={m.url} className="w-full h-full object-cover" />
        </div>
      ) : (
        <img src={m.url} alt="" className="w-full h-full object-cover" />
      )}
      {media.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md">
          {idx + 1} / {media.length}
        </div>
      )}
    </div>
  );
};

export default function AdminPatientFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    media: [] // { url: '', type: 'IMAGE' | 'VIDEO' }
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [videoOverlayUrl, setVideoOverlayUrl] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${API_ENDPOINTS.PATIENT_FEEDBACK.GET_ALL}?page=0&limit=100`);
      if (!res.ok) throw new Error('Failed to load patient feedback');
      const data = await res.json();
      setFeedbackList(data.content || []);
    } catch (err) {
      console.error('Patient feedback load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const resetForm = () => {
    setFormData({ id: null, title: '', description: '', media: [] });
    setIsModalOpen(false);
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'blockquote', 'code-block', 'link', 'image'
  ];

  const handleMediaSelected = (url) => {
    const type = url.match(/\.(mp4|webm|ogg|mov)$|video/i) ? 'VIDEO' : 'IMAGE';
    setFormData(prev => ({
      ...prev,
      media: [...prev.media, { url, type }]
    }));
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    if (formData.media.length === 0) {
      alert('At least one image or video is required');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetchWithAuth(API_ENDPOINTS.PATIENT_FEEDBACK.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save feedback');
      await fetchFeedback();
      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.PATIENT_FEEDBACK.DELETE(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete feedback');
      await fetchFeedback();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (val) => {
    if (!val) return '';
    return new Date(val).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Feedback</h1>
          <p className="text-sm text-gray-500">Manage patient success stories with multiple images and videos.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Feedback
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : feedbackList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbackList.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <CardMediaSlider media={item.media} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setFormData(item); setIsModalOpen(true); }}
                    className="bg-white/90 hover:bg-white text-gray-700 p-1.5 flex items-center gap-1 rounded-lg shadow-sm"
                    title="Edit"
                  >
                    <Edit size={16} /> <span className="text-xs">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-800 text-base mb-1 truncate">{item.title}</h3>
                <div
                  className="text-sm text-gray-500 mb-4 flex-1"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  dangerouslySetInnerHTML={{ __html: item.description || '' }}
                />
                <p className="text-xs text-gray-400 mt-auto">Created on {formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <ImageIcon size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Feedback Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Start by adding your first patient feedback story.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Add Feedback
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{formData.id ? 'Edit' : 'Add'} Patient Feedback</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  placeholder="e.g. Chronic Asthma Treatment Success"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <style>{`.quill-scrollable .ql-editor { max-height: 180px; overflow: auto; }`}</style>
                <div className="quill-scrollable">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe the patient's journey and results..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Media Files <span className="text-red-500">*</span></label>
                  <button
                    type="button"
                    onClick={() => setIsUploaderOpen(true)}
                    className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Media
                  </button>
                </div>
                
                {formData.media.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {formData.media.map((m, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                    {m.type === 'VIDEO' ? (
                                      <div className="w-full h-full flex items-center justify-center bg-black/5 relative">
                                        <img src={m.thumbnail || ''} alt="video" className="w-full h-full object-cover" />
                                        <button
                                          onClick={() => setVideoOverlayUrl(m.url)}
                                          className="absolute inset-0 m-auto w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md"
                                          title="Play video"
                                        >
                                          <Play size={18} />
                                        </button>
                                      </div>
                                    ) : (
                                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                      onClick={() => removeMedia(index)}
                                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X size={12} />
                                    </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsUploaderOpen(true)}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors"
                    >
                      <Plus size={20} />
                      <span className="text-[10px] mt-1">Add</span>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsUploaderOpen(true)}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or select images/videos</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ImageUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onImageSelected={handleMediaSelected}
      />

      {videoOverlayUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setVideoOverlayUrl(null)}
        >
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setVideoOverlayUrl(null)}
              className="absolute -top-6 -right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
            >
              <X size={20} />
            </button>
            <video src={videoOverlayUrl} controls autoPlay className="w-full h-auto rounded-lg bg-black" />
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <div className="bg-white/20 p-1.5 rounded-full">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium text-sm">Feedback saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
