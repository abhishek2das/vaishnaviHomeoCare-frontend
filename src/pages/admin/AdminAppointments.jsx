import React, { useState, useMemo } from 'react';
import { Search, Eye, Trash2, X, Filter } from 'lucide-react';

export default function AdminAppointments() {
  // Mock data for appointments
  const initialAppointments = [
    { id: 1, patientName: 'John Doe', phone: '+1 234 567 8900', date: '2023-11-15', time: '10:00 AM', service: 'General Checkup', status: 'Confirmed', email: 'john@example.com', doctor: 'Dr. Smith', notes: 'First time visit.' },
    { id: 2, patientName: 'Jane Smith', phone: '+1 987 654 3210', date: '2023-11-15', time: '11:30 AM', service: 'Dental Cleaning', status: 'Pending', email: 'jane.smith@example.com', doctor: 'Dr. Lee', notes: 'Patient requested morning slot.' },
    { id: 3, patientName: 'Michael Johnson', phone: '+1 555 123 4567', date: '2023-11-16', time: '02:00 PM', service: 'Cardiology Consult', status: 'Confirmed', email: 'mjohnson@example.com', doctor: 'Dr. Adams', notes: 'Follow-up on recent tests.' },
    { id: 4, patientName: 'Emily Davis', phone: '+1 444 987 6543', date: '2023-11-16', time: '03:15 PM', service: 'Pediatrics', status: 'Cancelled', email: 'emily.d@example.com', doctor: 'Dr. Brown', notes: 'Cancelled due to sickness.' },
    { id: 5, patientName: 'Robert Wilson', phone: '+1 333 444 5555', date: '2023-11-17', time: '09:00 AM', service: 'Orthopedics', status: 'Pending', email: 'rwilson@example.com', doctor: 'Dr. Taylor', notes: 'Knee pain.' },
  ];

  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filter logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const matchesSearch = app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.phone.includes(searchQuery);
      const matchesStatus = statusFilter ? app.status === statusFilter : true;
      const matchesDate = dateFilter ? app.date === dateFilter : true;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, dateFilter]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(app => app.id !== id));
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    // Update local state for modal
    setSelectedAppointment({ ...selectedAppointment, status: newStatus });
    // Update main list
    setAppointments(appointments.map(app => 
      app.id === selectedAppointment.id ? { ...app, status: newStatus } : app
    ));
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Date & Time</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Service</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Status</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app, index) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium">{app.patientName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{app.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      <div>{app.date}</div>
                      <div className="text-xs text-gray-400">{app.time}</div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{app.service}</td>
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
                  <td colSpan="7" className="py-8 text-center text-gray-500 text-sm">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 break-all">{selectedAppointment.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Doctor</p>
                  <p className="text-gray-800">{selectedAppointment.doctor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                  <p className="text-gray-800">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Time</p>
                  <p className="text-gray-800">{selectedAppointment.time}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Service</p>
                  <p className="text-gray-800">{selectedAppointment.service}</p>
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
