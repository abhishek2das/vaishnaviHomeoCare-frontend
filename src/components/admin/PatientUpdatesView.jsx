import React, { useState } from 'react';
import { ArrowLeft, Plus, Eye, Trash2, X } from 'lucide-react';

export default function PatientUpdatesView({ patient, onBack }) {
  const [updates, setUpdates] = useState([
    { id: 1, visitDate: '2023-10-25', nextVisitDate: '2023-11-10', prescription: 'Ibuprofen 400mg twice daily for 5 days. Muscle relaxant before bed.' },
    { id: 2, visitDate: '2023-11-10', nextVisitDate: '2023-12-10', prescription: 'Continue Ibuprofen as needed. Added physiotherapy exercises.' }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'view'
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    nextVisitDate: '',
    prescription: ''
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      visitDate: new Date().toISOString().split('T')[0],
      nextVisitDate: '',
      prescription: ''
    });
    setIsModalOpen(true);
  };

  const openViewModal = (update) => {
    setModalMode('view');
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this update?')) {
      setUpdates(updates.filter(u => u.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newUpdate = {
        ...formData,
        id: Date.now()
      };
      setUpdates([newUpdate, ...updates]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 animate-in fade-in duration-300">
      {/* Top Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 relative">
        <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
          <button 
            onClick={onBack}
            className="mr-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center"
            title="Back to Patient List"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Patient Details</h2>
            <p className="text-sm text-gray-500">View and manage visit history updates for this patient.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Name</p>
            <p className="text-base text-gray-800 font-medium">{patient.patientName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Age / Gender</p>
            <p className="text-base text-gray-800 font-medium">{patient.age} / {patient.gender}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
            <p className="text-base text-gray-800 font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Chief Complaint</p>
            <p className="text-base text-gray-800 font-medium truncate" title={patient.chiefComplaint}>
              {patient.chiefComplaint || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Visit History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-4">
          <h3 className="text-lg font-bold text-gray-800">Visit History</h3>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={16} className="mr-2" />
            Add Update
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-16">#</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 whitespace-nowrap">Visit Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 whitespace-nowrap">Next Visit Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Prescription</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {updates.length > 0 ? (
                updates.map((update, index) => (
                  <tr key={update.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium whitespace-nowrap">{update.visitDate}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 whitespace-nowrap">{update.nextVisitDate || '-'}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 max-w-[200px] truncate" title={update.prescription}>
                      {update.prescription || '-'}
                    </td>
                    <td className="py-3 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => openViewModal(update)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 bg-blue-50 hover:bg-blue-100 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(update.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded"
                          title="Delete Update"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                    No visit history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full my-4 max-w-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-100 border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add New Update' : 'Visit Details'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {modalMode === 'add' ? (
              <form onSubmit={handleSubmit} className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date <span className="text-red-500">*</span></label>
                    <input 
                      type="date" name="visitDate" required
                      value={formData.visitDate} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit Date</label>
                    <input 
                      type="date" name="nextVisitDate"
                      value={formData.nextVisitDate} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescription & Notes</label>
                    <textarea 
                      name="prescription" rows="5"
                      value={formData.prescription} onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                      placeholder="Enter prescription details, treatment notes, etc..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    Save Update
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Visit Date</h4>
                    <p className="text-gray-800 font-medium text-lg">{selectedUpdate?.visitDate}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Next Visit Date</h4>
                    <p className="text-gray-800 font-medium text-lg">{selectedUpdate?.nextVisitDate || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Prescription & Notes</h4>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-gray-800 whitespace-pre-wrap min-h-[100px]">
                      {selectedUpdate?.prescription || 'No prescription details available.'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
