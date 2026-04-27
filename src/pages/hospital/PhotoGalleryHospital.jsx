import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/common/PageHero'
import { galleryImages } from '../../data/mockData'

// Add more hospital-specific images
const hospitalGallery = [
  ...galleryImages,
  { id: 10, url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop', title: 'Patient Ward', category: 'Wards' },
  { id: 11, url: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&h=400&fit=crop', title: 'Cardiac OT', category: 'Infrastructure' },
  { id: 12, url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop', title: 'Consultation Room', category: 'Infrastructure' },
]

const categories = ['All', 'Infrastructure', 'Wards', 'Therapy', 'Diagnostics', 'Facilities']

export default function PhotoGalleryHospital() {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = hospitalGallery.filter(img => filter === 'All' || img.category === filter)

  return (
    <div>
      <PageHero
        title="Hospital Photo Gallery"
        subtitle="Take a visual tour through our campus, wards, OTs, and patient care areas."
        breadcrumbs={[
          { label: 'Hospital', path: '/hospital/infrastructure' },
          { label: 'Photo Gallery' }
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === cat ? 'bg-primary-600 text-white shadow-soft' : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}>
                {cat} {cat === 'All' ? `(${hospitalGallery.length})` : `(${hospitalGallery.filter(i => i.category === cat).length})`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, i) => (
              <div key={img.id} onClick={() => setLightbox(i)}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={img.url} alt={img.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i % 5 === 0 ? 'h-72' : 'h-44'}`} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    <ZoomIn size={28} className="text-white mx-auto mb-1" />
                    <p className="text-white text-sm font-medium">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-neutral-500 mb-4">Want to see the full media gallery?</p>
            <Link to="/gallery" className="btn-primary">Visit Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white">
            <X size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + filtered.length) % filtered.length) }}
            className="absolute left-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % filtered.length) }}
            className="absolute right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white">
            <ChevronRight size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            <img src={filtered[lightbox].url} alt={filtered[lightbox].title}
              className="w-full rounded-2xl shadow-strong max-h-[75vh] object-contain" />
            <p className="text-white text-center mt-3 font-semibold">{filtered[lightbox].title}</p>
            <p className="text-white/40 text-xs text-center">{lightbox + 1} / {filtered.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
