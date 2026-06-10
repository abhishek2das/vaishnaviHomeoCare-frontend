import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Image, Plus, Upload } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth, logoutAdmin } from '../../api/apiClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statConfig = [
    { key: 'todayAppointments', label: "Today's Appointments", icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'totalPatients', label: 'Total Patients', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { key: 'totalPressReleases', label: 'Total Blog', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { key: 'totalGalleryItems', label: 'Total Gallery Items', icon: Image, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, patientsRes, appointmentsRes] = await Promise.all([
        fetchWithAuth(API_ENDPOINTS.DASHBOARD.STATS),
        fetchWithAuth(API_ENDPOINTS.DASHBOARD.RECENT_PATIENTS(5)),
        fetchWithAuth(API_ENDPOINTS.DASHBOARD.RECENT_APPOINTMENTS(5)),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        logoutAdmin();
        return;
      }
      if (!statsRes.ok) throw new Error('Failed to load dashboard stats');
      if (!patientsRes.ok) throw new Error('Failed to load recent patients');
      if (!appointmentsRes.ok) throw new Error('Failed to load recent appointments');

      const statsData = await statsRes.json();
      const patientsData = await patientsRes.json();
      const appointmentsData = await appointmentsRes.json();

      setStats(statsData);
      setRecentPatients(Array.isArray(patientsData) ? patientsData : []);
      setRecentAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatAppointmentDate = (iso) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatAppointmentTime = (iso) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statConfig.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {stats ? stats[stat.key] : '0'}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Appointments</h2>
          </div>
          <div className="p-6 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr>
                  <th className="pb-3 font-semibold text-sm text-gray-500 border-b border-gray-100">Patient Name</th>
                  <th className="pb-3 font-semibold text-sm text-gray-500 border-b border-gray-100">Date</th>
                  <th className="pb-3 font-semibold text-sm text-gray-500 border-b border-gray-100">Time</th>
                  <th className="pb-3 font-semibold text-sm text-gray-500 border-b border-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((app) => (
                    <tr key={app.id}>
                      <td className="py-3 text-sm text-gray-800 font-medium border-b border-gray-50">{app.patientName || app.name || 'Unknown'}</td>
                      <td className="py-3 text-sm text-gray-600 border-b border-gray-50">{formatAppointmentDate(app.appointmentDate)}</td>
                      <td className="py-3 text-sm text-gray-600 border-b border-gray-50">{formatAppointmentTime(app.appointmentDate)}</td>
                      <td className="py-3 text-sm border-b border-gray-50">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">No recent appointments available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Patients</h2>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{patient.name || 'Unknown Patient'}</p>
                        <p className="text-xs text-gray-500">
                          {patient.email || patient.phone || `${patient.age || 'N/A'} yrs${patient.gender ? ` • ${patient.gender}` : ''}`}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-[#1a3a2a] hover:underline font-medium">View</button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">No recent patients available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (at the bottom) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-4 items-center">
        <h2 className="text-lg font-bold text-gray-800 mr-4">Quick Actions</h2>
        <button onClick={() => navigate('/admin/press')} className="flex items-center bg-[#1a3a2a] hover:bg-[#2c543f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" />
          Add Blog
        </button>
        <button onClick={() => navigate('/admin/patients')} className="flex items-center bg-white border border-[#1a3a2a] text-[#1a3a2a] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" />
          Add Patient
        </button>
        <button onClick={() => navigate('/admin/gallery')} className="flex items-center bg-white border border-[#1a3a2a] text-[#1a3a2a] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Upload size={16} className="mr-2" />
          Upload Media
        </button>
      </div>
    </div>
  );
}
