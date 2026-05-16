import React from 'react';
import { Users, Calendar, FileText, Image, Plus, Upload } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: "Today's Appointments", value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Press Releases', value: '45', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Gallery Items', value: '128', icon: Image, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentAppointments = [
    { id: 1, name: 'John Doe', date: '2023-10-27', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, name: 'Jane Smith', date: '2023-10-27', time: '11:30 AM', status: 'Pending' },
    { id: 3, name: 'Michael Johnson', date: '2023-10-27', time: '02:00 PM', status: 'Confirmed' },
    { id: 4, name: 'Emily Davis', date: '2023-10-27', time: '03:15 PM', status: 'Cancelled' },
  ];

  const recentPatients = [
    { id: 1, name: 'Robert Brown', lastVisit: '2023-10-25' },
    { id: 2, name: 'William Wilson', lastVisit: '2023-10-24' },
    { id: 3, name: 'Sarah Taylor', lastVisit: '2023-10-22' },
    { id: 4, name: 'David Anderson', lastVisit: '2023-10-20' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
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
                {recentAppointments.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 text-sm text-gray-800 font-medium border-b border-gray-50">{app.name}</td>
                    <td className="py-3 text-sm text-gray-600 border-b border-gray-50">{app.date}</td>
                    <td className="py-3 text-sm text-gray-600 border-b border-gray-50">{app.time}</td>
                    <td className="py-3 text-sm border-b border-gray-50">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold mr-3">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{patient.name}</p>
                      <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <button className="text-sm text-[#1a3a2a] hover:underline font-medium">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (at the bottom) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-4 items-center">
        <h2 className="text-lg font-bold text-gray-800 mr-4">Quick Actions</h2>
        <button className="flex items-center bg-[#1a3a2a] hover:bg-[#2c543f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" />
          Add Press Release
        </button>
        <button className="flex items-center bg-white border border-[#1a3a2a] text-[#1a3a2a] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" />
          Add Patient
        </button>
        <button className="flex items-center bg-white border border-[#1a3a2a] text-[#1a3a2a] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Upload size={16} className="mr-2" />
          Upload Media
        </button>
      </div>
    </div>
  );
}
