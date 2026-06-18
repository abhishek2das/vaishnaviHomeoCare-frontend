import React, { useState, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Search, Eye, Edit, Trash2, X, Plus, Upload, ImageIcon, Loader2 } from 'lucide-react';
import ImageUploader from '../../components/common/ImageUploader';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';

export default function AdminPressReleases() {
  const [pressReleases, setPressReleases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    coverImage: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    keywords: '',
    imageAltText: ''
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);

  const generateSlug = (text) => {
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
    'image'
  ];

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(API_ENDPOINTS.PRESS_RELEASES.GET_ALL);
      if (!res.ok) throw new Error('Failed to load Blogs');
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.content || [];
      setPressReleases(items);
    } catch (err) {
      setError(err.message || 'Unable to fetch Blog');
      setPressReleases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  // Filter logic
  const filteredReleases = useMemo(() => {
    return pressReleases.filter(pr => 
      pr.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pressReleases, searchQuery]);

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetchWithAuth(API_ENDPOINTS.PRESS_RELEASES.DELETE(id), {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      setPressReleases((current) => current.filter((pr) => pr.id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete blog');
    }
  };

  const openModal = (mode, pr = null) => {
    setModalMode(mode);
    if (pr) {
      setFormData({
        id: pr.id,
        title: pr.title || '',
        coverImage: pr.coverImage || '',
        date: pr.publishedDate || pr.date || new Date().toISOString().split('T')[0],
        content: pr.content || '',
        metaTitle: pr.metaTitle || '',
        metaDescription: pr.metaDescription || '',
        slug: pr.slug || generateSlug(pr.title || ''),
        keywords: pr.keywords || '',
        imageAltText: pr.imageAltText || ''
      });
    } else {
      setFormData({
        id: null,
        title: '',
        coverImage: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        metaTitle: '',
        metaDescription: '',
        slug: '',
        keywords: '',
        imageAltText: ''
      });
    }
    setSlugTouched(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Cleanup Object URL if it's a local upload
    if (formData.coverImage && formData.coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(formData.coverImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalContent = formData.content || '';
    if (!finalContent.trim() || finalContent === '<p><br></p>') {
      alert('Please enter the content of the article.');
      return;
    }

    if (modalMode === 'add' && !formData.coverImage) {
      alert('Please upload a cover image before publishing.');
      return;
    }

    const normalizedSlug = generateSlug(formData.slug || formData.title);
    if (!normalizedSlug) {
      alert('Slug is required.');
      return;
    }

    const slugAlreadyExists = pressReleases.some((pr) => {
      const existingSlug = pr.slug || generateSlug(pr.title || '');
      return existingSlug === normalizedSlug && pr.id !== formData.id;
    });
    if (slugAlreadyExists) {
      alert('Slug must be unique. Please choose a different slug.');
      return;
    }
    if (!/(<h1\b|<h2\b)/i.test(finalContent)) {
      alert('Content must include at least one <h1> or <h2> heading.');
      return;
    }

    const payload = {
      title: formData.title,
      coverImage: formData.coverImage || '',
      content: finalContent,
      publishedDate: formData.date,
      slug: normalizedSlug,
      keywords: formData.keywords,
      imageAltText: formData.imageAltText
    };

    // Only include SEO fields when non-empty so server-side accepts optional SEO
    if (formData.metaTitle && formData.metaTitle.trim()) payload.metaTitle = formData.metaTitle.trim();
    if (formData.metaDescription && formData.metaDescription.trim()) payload.metaDescription = formData.metaDescription.trim();

    try {
      const res = await fetchWithAuth(
        modalMode === 'add'
          ? API_ENDPOINTS.PRESS_RELEASES.CREATE
          : API_ENDPOINTS.PRESS_RELEASES.UPDATE(formData.id),
        {
          method: modalMode === 'add' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} blog`);
      }

      await fetchPressReleases();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Unable to save blog');
    }
  };

  const handleImageSelected = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
    setIsImageUploaderOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
          <p className="text-sm text-gray-500">Manage latest news and updates.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Add Article
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-gray-500" size={32} />
          <p className="text-sm text-gray-600">Loading blogs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <p className="text-red-700 font-semibold mb-2">Unable to load blogs</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPressReleases}
            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-16">#</th>
                  <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-24">Image</th>
                  <th className="py-3 px-6 font-semibold text-sm text-gray-600">Title</th>
                  <th className="py-3 px-6 font-semibold text-sm text-gray-600 w-36">Published Date</th>
                  <th className="py-3 px-6 font-semibold text-sm text-gray-600 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReleases.length > 0 ? (
                  filteredReleases.map((pr, index) => (
                    <tr key={pr.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                    <td className="py-4 px-6">
                      {pr.coverImage ? (
                        <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                          <img src={pr.coverImage} alt={pr.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                      <p className="line-clamp-2">{pr.title}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{pr.publishedDate || pr.date}</td>
                    <td className="py-4 px-6 text-sm text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => openModal('view', pr)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md"
                          title="View Article"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openModal('edit', pr)}
                          className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 bg-amber-50 hover:bg-amber-100 rounded-md"
                          title="Edit Article"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(pr.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-md"
                          title="Delete Article"
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
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No blogs found.</p>
                  </td> 
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`bg-white rounded-xl shadow-xl w-full ${modalMode === 'view' ? 'max-w-3xl' : 'max-w-4xl'} my-4 animate-in fade-in duration-200 max-h-[90vh] overflow-hidden`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-300 rounded-t-xl z-10 sticky top-0">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' && 'Add Blog'}
                {modalMode === 'edit' && 'Edit Blog'}
                {modalMode === 'view' && 'View Article'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable content area (keeps header sticky) */}
            <div className="overflow-auto max-h-[calc(90vh-64px)]">
            {/* View Mode */}
            {modalMode === 'view' && (
              <div className="p-0">
                {formData.coverImage && (
                  <div className="w-full h-64 bg-gray-100">
                    <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <p className="text-sm text-green-600 font-semibold mb-2">Published: {formData.date}</p>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{formData.title}</h1>
                  <div 
                    className="prose max-w-none text-gray-700 prose-headings:text-gray-800 prose-a:text-green-600"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              </div>
            )}

            {/* Form Mode (Add / Edit) */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Image & Meta */}
                  <div className="md:col-span-1 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image <span className="text-red-500">*</span></label>
                      <div 
                        className={`relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed ${formData.coverImage ? 'border-transparent' : 'border-gray-300'} aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors`}
                        onClick={() => setIsImageUploaderOpen(true)}
                      >
                        {formData.coverImage ? (
                          <>
                            <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-sm font-medium flex items-center"><Upload size={16} className="mr-2"/> Change Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Click to upload or choose image</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs/5 text-amber-600 mt-2 tracking-wide">
                        Blog image should be <strong className="font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">880 × 394 pixels</strong> in dimension, otherwise it will overflow the container.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Published Date <span className="text-red-500">*</span></label>
                      <input 
                        type="date" name="date" required
                        value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image Alt Text</label>
                      <input
                        type="text"
                        value={formData.imageAltText}
                        onChange={(e) => setFormData({...formData, imageAltText: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Describe the cover image for accessibility"
                      />
                    </div>
                  </div>

                  {/* Right Column: Text Content */}
                  <div className="md:col-span-2 space-y-5 flex flex-col">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Article Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" required
                        value={formData.title}
                        onChange={(e) => {
                          const titleValue = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            title: titleValue,
                            slug: !slugTouched ? generateSlug(titleValue) : prev.slug
                          }));
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                        placeholder="Enter an engaging title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter meta title for SEO (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                      <input
                        type="text" required
                        value={formData.slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setFormData({...formData, slug: generateSlug(e.target.value)});
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="react-seo-guide"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but editable.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                        maxLength={160}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter a short description (max 160 characters) — optional"
                      />
                      <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 characters</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-sm font-medium text-gray-700">Keywords</label>
                        <span className="text-xs text-gray-500">Recommended: 4-5 keywords are enough</span>
                      </div>
                      <textarea
                        value={formData.keywords}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.split(',').length <= 10) {
                            setFormData({...formData, keywords: val});
                          }
                        }}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="comma-separated keywords"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.keywords ? formData.keywords.split(',').filter(k => k.trim() !== '').length : 0} / 10 keywords used
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
                      {/* Limit the editor content area to a fixed height and make it scrollable */}
                      <style>{`.quill-scrollable .ql-editor { max-height: 200px; overflow: auto; }`}</style>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="quill-scrollable"
                      />
                    </div>
                  </div>

                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button 
                    type="button" onClick={closeModal}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    {modalMode === 'add' ? 'Publish Article' : 'Update Article'}
                  </button>
                </div>
              </form>
            )}
            </div>
            <ImageUploader
              isOpen={isImageUploaderOpen}
              onClose={() => setIsImageUploaderOpen(false)}
              onImageSelected={handleImageSelected}
            />

          </div>
        </div>
      )}
    </div>
  );
}
