import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, X, Plus, Upload, ImageIcon, Save, CheckCircle } from 'lucide-react';

export default function AdminCMS() {
  const location = useLocation();
  const activeTab = location.pathname.includes('services') ? 'services' : 'about';

  // --- ABOUT US DATA & STATE ---
  const [aboutDescription, setAboutDescription] = useState('We are a leading healthcare provider dedicated to offering comprehensive and compassionate care to our community. Our state-of-the-art facilities and experienced medical professionals ensure you receive the best treatment possible.');
  
  const [visionMission, setVisionMission] = useState({
    vision: 'To be the most trusted and advanced healthcare institution globally.',
    mission: 'Delivering exceptional patient care through innovation, empathy, and excellence.'
  });

  const [statistics, setStatistics] = useState([
    { id: 1, key: 'Patients Treated', value: '50,000+' },
    { id: 2, key: 'Specialist Doctors', value: '150+' },
    { id: 3, key: 'Years of Experience', value: '25' },
  ]);

  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialist: 'Cardiologist', description: 'Over 15 years of experience in interventional cardiology.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop' },
    { id: 2, name: 'Dr. Michael Chen', specialist: 'Neurologist', description: 'Specializes in treating complex neurological disorders.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop' },
  ]);

  // --- SERVICES DATA & STATE ---
  const [services, setServices] = useState([
    { id: 1, name: 'Emergency Care', description: '24/7 trauma and emergency care with rapid response teams.', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=300&auto=format&fit=crop' },
    { id: 2, name: 'Pediatrics', description: 'Comprehensive medical care for infants, children, and adolescents.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=300&auto=format&fit=crop' },
  ]);

  // --- MODAL STATES ---
  const [modalType, setModalType] = useState(null); // 'stat', 'doctor', 'service', null
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  // --- SAVE HANDLERS (Simulated API calls) ---
  const handleSaveText = (section) => {
    alert(`${section} saved successfully!`);
  };

  // --- CRUD HANDLERS ---
  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'stat') setStatistics(statistics.filter(s => s.id !== id));
      if (type === 'doctor') setDoctors(doctors.filter(d => d.id !== id));
      if (type === 'service') setServices(services.filter(s => s.id !== id));
    }
  };

  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    if (item) {
      setFormData(item);
    } else {
      if (type === 'stat') setFormData({ id: null, key: '', value: '' });
      if (type === 'doctor') setFormData({ id: null, name: '', specialist: '', description: '', image: '' });
      if (type === 'service') setFormData({ id: null, name: '', description: '', image: '' });
    }
  };

  const closeModal = () => {
    setModalType(null);
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    
    if (modalMode === 'add') {
      payload.id = Date.now();
      if (modalType === 'stat') setStatistics([...statistics, payload]);
      if (modalType === 'doctor') setDoctors([...doctors, payload]);
      if (modalType === 'service') setServices([...services, payload]);
    } else {
      if (modalType === 'stat') setStatistics(statistics.map(s => s.id === payload.id ? payload : s));
      if (modalType === 'doctor') setDoctors(doctors.map(d => d.id === payload.id ? payload : d));
      if (modalType === 'service') setServices(services.map(s => s.id === payload.id ? payload : s));
    }
    closeModal();
  };

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Content Management System</h1>
        <p className="text-sm text-gray-500">Manage the content for the public-facing website.</p>
      </div>

      {/* --- ABOUT US TAB --- */}
      {activeTab === 'about' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Section 1: About Description */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">About Us Description</h2>
              <button onClick={() => handleSaveText('About Description')} className="flex items-center text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Save size={16} className="mr-2" /> Save
              </button>
            </div>
            <textarea
              rows="4"
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
              placeholder="Enter the main about us text..."
            ></textarea>
          </section>

          {/* Section 2: Vision & Mission */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Vision & Mission</h2>
              <button onClick={() => handleSaveText('Vision & Mission')} className="flex items-center text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Save size={16} className="mr-2" /> Save
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Our Vision</label>
                <textarea
                  rows="3"
                  value={visionMission.vision}
                  onChange={(e) => setVisionMission({...visionMission, vision: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Our Mission</label>
                <textarea
                  rows="3"
                  value={visionMission.mission}
                  onChange={(e) => setVisionMission({...visionMission, mission: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Section 3: Statistics */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Hospital Statistics</h2>
              <button onClick={() => openModal('stat', 'add')} className="flex items-center text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Plus size={16} className="mr-2" /> Add Stat
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600">Statistic Key</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 w-1/3">Value</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {statistics.map((stat) => (
                    <tr key={stat.id}>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{stat.key}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-bold">{stat.value}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => openModal('stat', 'edit', stat)} className="text-amber-500 hover:text-amber-700 p-1 bg-amber-50 rounded"><Edit size={14} /></button>
                          <button onClick={() => handleDelete('stat', stat.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {statistics.length === 0 && (
                    <tr><td colSpan="3" className="text-center py-6 text-gray-500 text-sm">No statistics added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Doctors Team */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Our Doctors</h2>
              <button onClick={() => openModal('doctor', 'add')} className="flex items-center text-sm font-medium bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Plus size={16} className="mr-2" /> Add Doctor
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {doctors.map(doc => (
                <div key={doc.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col group">
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                    {doc.image ? (
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={32}/></div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal('doctor', 'edit', doc)} className="bg-white/90 text-amber-500 hover:text-amber-600 p-1.5 rounded shadow-sm"><Edit size={14}/></button>
                      <button onClick={() => handleDelete('doctor', doc.id)} className="bg-white/90 text-red-500 hover:text-red-600 p-1.5 rounded shadow-sm"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800">{doc.name}</h3>
                    <p className="text-green-600 text-sm font-medium mb-2">{doc.specialist}</p>
                    <p className="text-gray-500 text-xs flex-1">{doc.description}</p>
                  </div>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                  No doctors added yet.
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* --- SERVICES TAB --- */}
      {activeTab === 'services' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Hospital Services</h2>
              <button onClick={() => openModal('service', 'add')} className="flex items-center text-sm font-medium bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                <Plus size={16} className="mr-2" /> Add Service
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 w-12">#</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 w-20">Image</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 w-1/4">Service Name</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600">Short Description</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.map((srv, idx) => (
                    <tr key={srv.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                          {srv.image ? <img src={srv.image} alt={srv.name} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-gray-400"/>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-bold">{srv.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{srv.description}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => openModal('service', 'edit', srv)} className="text-amber-500 hover:text-amber-700 p-1.5 bg-amber-50 rounded-md"><Edit size={16} /></button>
                          <button onClick={() => handleDelete('service', srv.id)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded-md"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-10 text-gray-500 text-sm">No services added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* --- ALL MODALS --- */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10">
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {modalMode} {modalType}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                
                {/* Stat Fields */}
                {modalType === 'stat' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statistic Key <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" placeholder="e.g. Happy Patients" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" placeholder="e.g. 10k+" />
                    </div>
                  </>
                )}

                {/* Doctor Fields */}
                {modalType === 'doctor' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Photo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                          {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-400"/>}
                        </div>
                        <div className="flex-1">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center">
                            <Upload size={14} className="mr-2"/> Upload Image
                          </button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" placeholder="Dr. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialist <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.specialist} onChange={e => setFormData({...formData, specialist: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" placeholder="e.g. Neurologist" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                      <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"></textarea>
                    </div>
                  </>
                )}

                {/* Service Fields */}
                {modalType === 'service' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Image / Icon</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                          {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-400"/>}
                        </div>
                        <div className="flex-1">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 flex items-center">
                            <Upload size={14} className="mr-2"/> Upload Image
                          </button>
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500" placeholder="e.g. Emergency Care" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                      <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"></textarea>
                    </div>
                  </>
                )}
                
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm capitalize">
                  Save {modalType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
