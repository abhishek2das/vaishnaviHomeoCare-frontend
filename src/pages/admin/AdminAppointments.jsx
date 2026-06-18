import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Trash2, X, Filter } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminAppointments() {
  const initialAppointments = [];

  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = API_ENDPOINTS.APPOINTMENTS.GET_ALL;
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage);
      params.append('limit', limit);
      url += `?${params.toString()}`;

      const res = await fetchWithAuth(url);
      if (!res.ok) throw new Error('Failed to load appointments');

      const data = await res.json();
      const appointmentList = Array.isArray(data) ? data : data.content || data.appointments || [];
      const normalized = appointmentList.map(app => ({
        ...app,
        patientName: app.patientName || app.name || app.patient?.name || 'Unknown Patient',
        phone: app.phone || app.mobile || app.patient?.phone || 'N/A',
        appointmentDate: app.appointmentDate || app.date || app.datetime || null,
        createdAt: app.createdAt || app.created_at || app.created || null,
        status: app.status || app.state || 'Pending',
        notes: app.message || app.notes || app.description || '',
      }));
      setAppointments(normalized);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  // Filter logic
  const getAppointmentDateValue = (app) => {
    if (app.appointmentDate) return app.appointmentDate;
    if (app.date && app.time) return `${app.date} ${app.time}`;
    return app.date || app.time || '';
  };

  const formatAppointmentDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.APPOINTMENTS.DELETE(id), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete appointment');
      setAppointments(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete appointment');
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!selectedAppointment) return;

    const appointmentId = selectedAppointment.id;
    const previousStatus = selectedAppointment.status;

    const updatedAppointment = { ...selectedAppointment, status: newStatus };
    setSelectedAppointment(updatedAppointment);
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId ? { ...app, status: newStatus } : app
    ));

    const payloadBase = selectedAppointment.__raw || selectedAppointment;
    const payload = { ...payloadBase, status: newStatus };

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.APPOINTMENTS.UPDATE(appointmentId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update appointment status');
      }
    } catch (err) {
      setSelectedAppointment(prev => ({ ...prev, status: previousStatus }));
      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, status: previousStatus } : app
      ));
      alert(err.message || 'Unable to update appointment status');
    }
  };

  // Utility to render status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Confirmed</span>;
      case 'Pending': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>;
      case 'Cancelled': return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Cancelled</span>;
      default: return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-500">Manage patient appointments and schedules.</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <input
            type="date"
            className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-gray-600"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">#</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Patient Name</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Phone</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Appointment Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Appointment Raised</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Loading appointments...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-500">{error}</td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((app, index) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium">{app.patientName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{app.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{formatAppointmentDate(getAppointmentDateValue(app))}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{formatAppointmentDate(app.createdAt)}</td>
                    <td className="py-3 px-6 text-sm">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-3">
                        <button 
                          onClick={() => handleView(app)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 text-sm">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-700">{currentPage + 1}</span> of <span className="font-medium text-gray-700">{totalPages}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
              <button aria-label="Close dialog" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Patient Name</p>
                  <p className="text-gray-800 font-medium">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800">{selectedAppointment.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Appointment Date</p>
                  <p className="text-gray-800">{formatAppointmentDate(getAppointmentDateValue(selectedAppointment))}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Raised</p>
                  <p className="text-gray-800">{formatAppointmentDate(selectedAppointment.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                  <select 
                    value={selectedAppointment.status}
                    onChange={handleStatusChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm px-3 py-2 border font-medium ${
                      selectedAppointment.status === 'Confirmed' ? 'text-green-700 bg-green-50' : 
                      selectedAppointment.status === 'Pending' ? 'text-yellow-700 bg-yellow-50' : 
                      'text-red-700 bg-red-50'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                {selectedAppointment.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
