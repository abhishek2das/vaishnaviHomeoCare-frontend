import React, { useState, useMemo } from 'react';
import { Search, Eye, Trash2, X, Filter, Mail } from 'lucide-react';

export default function AdminContacts() {
  // Mock data for contact inquiries
  const initialContacts = [
    { id: 1, name: 'Alice Walker', phone: '+1 234 567 8900', email: 'alice.w@example.com', message: 'I would like to inquire about the maternity packages you offer and if they are covered by Blue Cross insurance.', date: '2023-11-12' },
    { id: 2, name: 'David Smith', phone: '+1 987 654 3210', email: 'dsmith88@example.com', message: 'I need to schedule an MRI scan but the online portal is not letting me pick a date for next week. Please assist.', date: '2023-11-11' },
    { id: 3, name: 'Sophia Johnson', phone: '+1 555 123 4567', email: 'sophia.j@example.com', message: 'Do you offer online video consultations for pediatric care? My son is sick and I prefer not to bring him to the clinic.', date: '2023-11-10' },
    { id: 4, name: 'James Brown', phone: '+1 444 987 6543', email: 'jbrown@example.com', message: 'I had a great experience during my last visit. Just wanted to leave a thank you note for Dr. Lee!', date: '2023-11-08' },
    { id: 5, name: 'Emma Davis', phone: '+1 333 444 5555', email: 'emma.davis@example.com', message: 'Could you please send me a copy of my billing statement from my visit on Oct 15th?', date: '2023-11-05' },
  ];

  const [contacts, setContacts] = useState(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Filter logic
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = contact.name.toLowerCase().includes(searchLower) || contact.email.toLowerCase().includes(searchLower) || contact.phone.includes(searchQuery);
      
      let matchesDateRange = true;
      if (startDate && endDate) {
        matchesDateRange = contact.date >= startDate && contact.date <= endDate;
      } else if (startDate) {
        matchesDateRange = contact.date >= startDate;
      } else if (endDate) {
        matchesDateRange = contact.date <= endDate;
      }
      
      return matchesSearch && matchesDateRange;
    });
  }, [contacts, searchQuery, startDate, endDate]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const openViewModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Truncate helper
  const truncateMessage = (msg) => {
    return msg.length > 60 ? msg.substring(0, 60) + '...' : msg;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Inquiries</h1>
          <p className="text-sm text-gray-500">View messages submitted through the website contact form.</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col xl:flex-row gap-4 items-end xl:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter size={18} className="text-gray-400 hidden sm:block" />
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">#</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Name</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Phone</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Email</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Message</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600">Date</th>
                <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-3 px-6 text-sm text-gray-800 font-medium">{contact.name}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{contact.phone}</td>
                    <td className="py-3 px-6 text-sm text-gray-600">{contact.email}</td>
                    <td className="py-3 px-6 text-sm text-gray-600" title={contact.message}>
                      {truncateMessage(contact.message)}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600 whitespace-nowrap">{contact.date}</td>
                    <td className="py-3 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => openViewModal(contact)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-md"
                          title="Delete Message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Mail size={32} />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No contact inquiries found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Mail size={20} className="mr-2 text-slate-600" />
                Message Details
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                    <p className="text-gray-800 font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Date Submitted</p>
                    <p className="text-gray-800">{selectedContact.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-800">{selectedContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline break-all">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm leading-relaxed border border-gray-100 whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
