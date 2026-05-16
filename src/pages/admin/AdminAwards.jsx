import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Plus, Trophy } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';

export default function AdminAwards() {

  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({
    id: null, name: '', year: new Date().getFullYear(), description: ''
  });
  
  const fetchAwards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_ENDPOINTS.AWARDS.GET_ALL);
      if (!res.ok) throw new Error('Failed to load awards');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setAwards(items);
    } catch (err) {
      setError(err.message || 'Unable to fetch awards');
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      const payload = {
        name: formData.name,
        year: formData.year,
        description: formData.description
      };
  
      try {
        const res = await fetch(
          modalMode === 'add'
            ? API_ENDPOINTS.AWARDS.CREATE
            : API_ENDPOINTS.AWARDS.UPDATE(formData.id),
          {
            method: modalMode === 'add' ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
  
        if (!res.ok) {
          throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} award`);
        }
  
        await fetchAwards();
        setIsModalOpen(false);
      } catch (err) {
        alert(err.message || 'Unable to save award');
      }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this award?')) return;
    try {
      const res = await fetch(API_ENDPOINTS.AWARDS.DELETE(id), {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete award');
      fetchAwards(); 
    } catch (err) {
      alert(err.message || 'Unable to delete award');
    }
  };

  const openModal = (mode, award = null) => {
    setModalMode(mode);
    if (award) {
      setFormData(award);
    } else {
      setFormData({
        id: null, 
        name: '', 
        year: new Date().getFullYear(), 
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Awards & Recognitions</h1>
          <p className="text-sm text-gray-500">Manage the hospital's achievements and awards.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Award
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-16">#</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Award Name</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-24">Year</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Short Description</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {awards.length > 0 ? (
                awards.map((award, index) => (
                  <tr key={award.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium">
                      <div className="flex items-center">
                        <Trophy size={16} className="text-[#d4af37] mr-2 flex-shrink-0" />
                        {award.name}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 font-medium">{award.year}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 max-w-md">
                      <p className="truncate" title={award.description}>{award.description}</p>
                    </td>
                    <td className="py-3 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => openModal('edit', award)}
                          className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 bg-amber-50 hover:bg-amber-100 rounded-md"
                          title="Edit Award"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(award.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-md"
                          title="Delete Award"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Trophy size={32} />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No awards have been added yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Award Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add Award' : 'Edit Award'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Award Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="name" required
                    value={formData.name} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Excellence in Patient Care"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year <span className="text-red-500">*</span></label>
                  <input 
                    type="number" name="year" required min="1900" max={new Date().getFullYear() + 5}
                    value={formData.year} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="YYYY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                  <textarea 
                    name="description" required rows="4"
                    value={formData.description} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief details about the award..."
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                >
                  {modalMode === 'add' ? 'Save Award' : 'Update Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
