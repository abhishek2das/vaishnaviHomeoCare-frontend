import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X, Plus, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminFAQ() {

  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({
    id: null, question: '', answer: ''
  });
  
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(API_ENDPOINTS.FAQS.GET_ALL);
      if (!res.ok) throw new Error('Failed to load FAQs');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setFaqs(items);
    } catch (err) {
      setError(err.message || 'Unable to fetch FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      question: formData.question,
      answer: formData.answer
    };

    try {
      const res = await fetchWithAuth(
        modalMode === 'add'
          ? API_ENDPOINTS.FAQS.CREATE
          : API_ENDPOINTS.FAQS.UPDATE(formData.id),
        {
          method: modalMode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} FAQ`);
      }

      await fetchFaqs();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Unable to save FAQ');
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.FAQS.DELETE(id), {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      fetchFaqs(); 
    } catch (err) {
      alert(err.message || 'Unable to delete FAQ');
    }
  };
  

  // Handlers
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


  const openModal = (mode, faq = null, e = null) => {
    if (e) e.stopPropagation(); // Prevent accordion from toggling if editing
    setModalMode(mode);
    if (faq) {
      setFormData(faq);
    } else {
      setFormData({
        id: null, 
        question: '', 
        answer: ''
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
          <h1 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h1>
          <p className="text-sm text-gray-500">Manage FAQs displayed on the website.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add FAQ
        </button>
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {faqs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {faqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              
              return (
                <div key={faq.id} className="transition-colors hover:bg-gray-50/50">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                    onClick={() => toggleExpand(faq.id)}
                  >
                    <div className="flex items-center gap-2 pr-4 flex-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="none" stroke="currentColor" stroke-width="2">
		<rect width="14" height="14" x="5" y="5" rx="4" />
		<path stroke-linecap="round" d="M12 15.52v-.01m-1.998-5.533C10.157 9.019 11 8.5 12 8.5s1.686.672 1.87 1.207c.183.535.144 1.344-.363 1.809s-.773.316-1.229.8a1.8 1.8 0 0 0-.278.432" />
	</g>
</svg>

                      <h3 className="text-gray-800 font-medium text-base">{faq.question}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Actions */}
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => openModal('edit', faq, e)}
                          className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 hover:bg-amber-50 rounded-md"
                          title="Edit FAQ"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, faq.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded-md"
                          title="Delete FAQ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      {/* Chevron */}
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 bg-gray-50/30">
                      <div className="pl-9 pr-12 text-gray-600 text-sm leading-relaxed border-l-2 border-green-200 ml-1">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <HelpCircle size={32} />
            </div>
            <p className="text-gray-500 text-sm font-medium">No FAQs have been added yet.</p>
          </div>
        )}
      </div>

      {/* FAQ Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add FAQ' : 'Edit FAQ'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="question" required
                    value={formData.question} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., What are the visiting hours?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer <span className="text-red-500">*</span></label>
                  <textarea 
                    name="answer" required rows="6"
                    value={formData.answer} onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Provide a detailed answer..."
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
                  {modalMode === 'add' ? 'Save FAQ' : 'Update FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
