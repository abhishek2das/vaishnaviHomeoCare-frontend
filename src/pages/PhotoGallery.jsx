import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ImageOff } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import hero_image from '../assets/hero_image.png'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { API_ENDPOINTS } from '../api/endpoints'

export default function PhotoGallery() {
  const [/*filter*/, /*setFilter*/] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)

  const displayed = images

  const seoTitle = 'Photo Gallery — Vaishnavi Homeo Care'
  const seoDescription = 'A visual journey through our world-class facilities, infrastructure, and care environment at Vaishnavi Homeo Care Clinic.'
  const seoKeywords = 'photo gallery, clinic photos, facility images, Vaishnavi Homeo Care gallery'
  const seoUrl = typeof window !== 'undefined' ? window.location.href : ''
  const seoImage = hero_image

  const openLightbox = (idx) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const prevImage = () => setLightbox(i => (i - 1 + displayed.length) % displayed.length)
  const nextImage = () => setLightbox(i => (i + 1) % displayed.length)

  // Load gallery images (only type=IMAGE)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const url = `${API_ENDPOINTS.PHOTO_GALLERY.GET_ALL}?type=IMAGE&page=${page}&limit=${limit}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch gallery')
        const json = await res.json()
        const parsed = Array.isArray(json) ? json : (Array.isArray(json.content) ? json.content : [])
        if (mounted) {
          setImages(parsed)
          setError(false)
        }
      } catch (err) {
        console.error('Gallery load error:', err)
        if (mounted) {
          setImages([])
          setError(true)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [page, limit, retryTrigger])

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return
    const handler = e => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <div>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={seoUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": seoTitle,
          "description": seoDescription,
          "url": seoUrl,
          "hasPart": images.slice(0,100).map(img => ({
            "@type": "ImageObject",
            "contentUrl": img.url || img.src || img.imageUrl || img.path || '',
            "caption": img.caption || img.alt || ''
          }))
        })}</script>
      </Helmet>
      <PageHero
        title="Photo Gallery"
        subtitle="A visual journey through our world-class facilities, infrastructure, and care environment."
        breadcrumbs={[{ label: 'Photo Gallery' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters removed — showing all images from gallery (type=IMAGES) */}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-soft">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                <ImageOff size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? 'Gallery Temporarily Unavailable' : 'No Photos Found'}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {error 
                  ? 'We are currently unable to establish a connection to our media server. Please verify your connection or try again shortly.' 
                  : 'There are currently no photographic records in our collection. Please check back soon as we continuously update our gallery.'}
              </p>
              <button 
                onClick={() => setRetryTrigger(prev => prev + 1)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-xl transition-all shadow-soft"
              >
                Refresh Gallery
              </button>
            </div>
          ) : (
            /* Masonry Grid */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {displayed.map((img, i) => (
                <div
                  key={img.id}
                  className="break-inside-avoid"
                >
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300"
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ height: i % 3 === 1 ? '280px' : '220px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="mt-4 px-1">
                    <p className="text-gray-800 font-semibold text-sm line-clamp-1">{img.title || 'Untitled'}</p>
                    {img.description && <p className="text-gray-600 text-xs line-clamp-2 mt-1">{img.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
            {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-11 h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); prevImage() }}
            className="absolute left-5 w-11 h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); nextImage() }}
            className="absolute right-5 w-11 h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
          <div onClick={e => e.stopPropagation()} className="max-w-4xl w-full">
            <img
              src={displayed[lightbox].url}
              alt={displayed[lightbox].title}
              className="w-full rounded-2xl shadow-strong max-h-[75vh] object-contain"
            />
            <div className="text-center mt-4">
              <p className="text-white font-semibold">{displayed[lightbox].title || 'Untitled'}</p>
              {displayed[lightbox].description && (
                <p className="text-white/60 text-sm mt-1">{displayed[lightbox].description}</p>
              )}
              <p className="text-white/40 text-xs mt-2">{lightbox + 1} / {displayed.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
