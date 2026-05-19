import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, X, Filter, Plus, History, Loader2 } from 'lucide-react';
import PatientUpdatesView from '../../components/admin/PatientUpdatesView';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [formData, setFormData] = useState({
    id: null, patientName: '', age: '', gender: '', phone: '', email: '', 
    chiefComplaint: '', treatmentGiven: '', medicinesPrescribed: '', 
    visitDate: '', nextVisitDate: '', adminNotes: ''
  });
  const [selectedPatientForUpdates, setSelectedPatientForUpdates] = useState(null);

  // Filter logic
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            patient.phone.includes(searchQuery);
      const matchesGender = genderFilter ? patient.gender === genderFilter : true;
      
      let matchesDateRange = true;
      if (startDate && endDate) {
        matchesDateRange = patient.visitDate >= startDate && patient.visitDate <= endDate;
      } else if (startDate) {
        matchesDateRange = patient.visitDate >= startDate;
      } else if (endDate) {
        matchesDateRange = patient.visitDate <= endDate;
      }
      
      return matchesSearch && matchesGender && matchesDateRange;
    });
  }, [patients, searchQuery, genderFilter, startDate, endDate]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(API_ENDPOINTS.PATIENTS.GET_ALL);
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      const formattedPatients = (data.content || []).map(p => ({
        ...p,
        patientName: p.name
      }));
      setPatients(formattedPatients);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handlers
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        const res = await fetchWithAuth(API_ENDPOINTS.PATIENTS.DELETE(id), { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete patient');
        setPatients(patients.filter(p => p.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (mode, patient = null) => {
    setModalMode(mode);
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({
        id: null, patientName: '', age: '', gender: '', phone: '', email: '', 
        chiefComplaint: '', treatmentGiven: '', medicinesPrescribed: '', 
        visitDate: new Date().toISOString().split('T')[0], nextVisitDate: '', adminNotes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.patientName,
      age: parseInt(formData.age, 10) || 0,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      chiefComplaint: formData.chiefComplaint,
      treatmentGiven: formData.treatmentGiven,
      medicinesPrescribed: formData.medicinesPrescribed,
      visitDate: formData.visitDate,
      nextVisitDate: formData.nextVisitDate,
      adminNotes: formData.adminNotes
    };

    try {
      if (modalMode === 'add') {
        const res = await fetchWithAuth(API_ENDPOINTS.PATIENTS.CREATE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create patient');
        fetchPatients();
      } else if (modalMode === 'edit') {
        payload.id = formData.id;
        const res = await fetchWithAuth(API_ENDPOINTS.PATIENTS.UPDATE(formData.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update patient');
        fetchPatients();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (selectedPatientForUpdates) {
    return <PatientUpdatesView patient={selectedPatientForUpdates} onBack={() => setSelectedPatientForUpdates(null)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-sm text-gray-500">Manage patient treatment history and records.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Patient
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full xl:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="date"
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Start Date"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="End Date"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">#</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Patient Name</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Age / Gender</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Contact</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Chief Complaint</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Last Visit Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin mb-2" size={24} />
                      <p>Loading patients...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-red-500">
                    <p>Error loading patients: {error}</p>
                    <button onClick={fetchPatients} className="mt-2 text-sm text-blue-500 underline">Try again</button>
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium">{patient.patientName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{patient.age} / {patient.gender}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{patient.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 max-w-[200px] truncate" title={patient.chiefComplaint}>
                      {patient.chiefComplaint}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{patient.visitDate}</td>
                    <td className="py-3 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => openModal('view', patient)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 bg-blue-50 hover:bg-blue-100 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => setSelectedPatientForUpdates(patient)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 bg-indigo-50 hover:bg-indigo-100 rounded text-xs font-medium"
                          title="Patient Updates"
                        >
                          Updates
                        </button>
                        <button 
                          onClick={() => openModal('edit', patient)}
                          className="text-amber-500 hover:text-amber-700 transition-colors p-1 bg-amber-50 hover:bg-amber-100 rounded"
                          title="Edit Patient"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 bg-red-50 hover:bg-red-100 rounded"
                          title="Delete Patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500 text-sm">
                    No patient records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Form / View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full my-4 max-w-5xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' && 'Add New Patient'}
                {modalMode === 'edit' && 'Edit Patient Record'}
                {modalMode === 'view' && 'Patient Details'}
              </h2>
              <button  onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors" >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" name="patientName" required
                        value={formData.patientName} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Full Name"
                      />
                    </div>
                    <div> 
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                      <input 
                        type="number" name="age" required min="0"
                        value={formData.age} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Age in years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                      <select 
                        name="gender" required
                        value={formData.gender} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" name="phone" required
                        value={formData.phone} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" name="email"
                        value={formData.email} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Treatment Details */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Treatment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint <span className="text-red-500">*</span></label>
                      <textarea 
                        name="chiefComplaint" required rows="2"
                        value={formData.chiefComplaint} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="What are the main symptoms?"
                      ></textarea>
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Given</label>
                      <textarea 
                        name="treatmentGiven" rows="2"
                        value={formData.treatmentGiven} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Procedures, advice, etc."
                      ></textarea>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicines Prescribed</label>
                      <textarea 
                        name="medicinesPrescribed" rows="2"
                        value={formData.medicinesPrescribed} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Medication names and dosages"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" name="visitDate" required
                        value={formData.visitDate} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Visit Date</label>
                      <input 
                        type="date" name="nextVisitDate"
                        value={formData.nextVisitDate} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                      <textarea 
                        name="adminNotes" rows="2"
                        value={formData.adminNotes} onChange={handleInputChange} disabled={modalMode === 'view'}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="Internal notes, not visible to patient"
                      ></textarea>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                {modalMode === 'view' ? (
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                ) : (
                  <>
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
                      {modalMode === 'add' ? 'Save Patient' : 'Update Record'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
