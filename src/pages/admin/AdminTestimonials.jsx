import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Plus, Star, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({
    id: null,
    patientName: '',
    rating: 5,
    review: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(API_ENDPOINTS.TESTIMONIALS.GET_ALL);
      if (!res.ok) throw new Error('Failed to load testimonials');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setTestimonials(items);
    } catch (err) {
      setError(err.message || 'Unable to fetch testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.TESTIMONIALS.DELETE(id), {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete testimonial');
      setTestimonials((current) => current.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete testimonial');
    }
  };

  const openModal = (mode, testimonial = null) => {
    setModalMode(mode);
    if (testimonial) {
      setFormData({
        id: testimonial.id,
        patientName: testimonial.patientName || '',
        rating: testimonial.rating || 5,
        review: testimonial.review || '',
        date: testimonial.date || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        id: null,
        patientName: '',
        rating: 5,
        review: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingValue) => {
    setFormData((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patientName: formData.patientName,
      rating: Number(formData.rating),
      review: formData.review,
      date: formData.date
    };

    try {
      const res = await fetchWithAuth(
        modalMode === 'add'
          ? API_ENDPOINTS.TESTIMONIALS.CREATE
          : API_ENDPOINTS.TESTIMONIALS.UPDATE(formData.id),
        {
          method: modalMode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} testimonial`);
      }

      await fetchTestimonials();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Unable to save testimonial');
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && handleRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              size={interactive ? 28 : 18}
              className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
          <p className="text-sm text-gray-500">Manage patient reviews and feedback.</p>
        </div>
        <button
          onClick={() => openModal('add')}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-gray-500" size={32} />
          <p className="text-sm text-gray-600">Loading testimonials...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6 text-center">
          <p className="text-red-700 font-medium mb-2">Unable to load testimonials</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTestimonials}
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.patientName}</h3>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
                  </div>
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 text-sm italic line-clamp-4">"{testimonial.review}"</p>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 flex justify-end space-x-2 bg-gray-50/50 rounded-b-xl">
                <button
                  onClick={() => openModal('edit', testimonial)}
                  className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 bg-amber-50 hover:bg-amber-100 rounded-md flex items-center text-xs font-medium"
                >
                  <Edit size={14} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-md flex items-center text-xs font-medium"
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Star size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Testimonials Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">You haven't added any patient testimonials yet. Click the button above to add your first one.</p>
          <button
            onClick={() => openModal('add')}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-2" />
            Add Testimonial
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="E.g., John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating <span className="text-red-500">*</span></label>
                  {renderStars(formData.rating, true)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Text <span className="text-red-500">*</span></label>
                  <textarea
                    name="review"
                    required
                    rows="4"
                    value={formData.review}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Patient's review..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  {modalMode === 'add' ? 'Save Testimonial' : 'Update Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
