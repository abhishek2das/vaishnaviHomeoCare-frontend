
import { useState, useEffect } from 'react'
import { Play, X, VideoOff } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { API_ENDPOINTS } from '../api/endpoints'

export default function VideoGallery() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [error, setError] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [playing, setPlaying] = useState(null)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(9)

  // Load videos from gallery API (type=VIDEO)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const url = `${API_ENDPOINTS.GALLERY.GET_ALL}?type=VIDEO&page=${page}&limit=${limit}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch videos')
        const json = await res.json()
        const parsed = Array.isArray(json) ? json : (Array.isArray(json.content) ? json.content : [])
        if (mounted) {
          setData(parsed)
          setError(false)
        }
      } catch (err) {
        console.error('Video gallery load error:', err)
        if (mounted) {
          setData([])
          setError(true)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [page, limit, retryTrigger])

  const displayed = data

  const getVideoSource = (item) => {
    if (!item) return null
    return item.videoUrl || item.url || item.source || item.embedUrl || null
  }

  const getThumbnailSource = (item) => {
    if (!item) return null
    return item.thumbnail || item.poster || item.image || null
  }

  const getVideoEmbedUrl = (src) => {
    if (!src) return null
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const url = new URL(src, window.location.origin)
      const id = url.searchParams.get('v') || src.split('/').pop()
      return `https://www.youtube.com/embed/${id}`
    }
    if (src.includes('vimeo.com')) {
      const id = src.split('/').pop()
      return `https://player.vimeo.com/video/${id}`
    }
    return null
  }

  return (
    <div>
      <PageHero
        title="Video Gallery"
        subtitle="Watch educational content, patient stories, and facility tours from Medicare Clinic."
        breadcrumbs={[{ label: 'Video Gallery' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters removed — showing all videos (type=VIDEO) */}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-soft">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                <VideoOff size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? 'Gallery Temporarily Unavailable' : 'No Videos Found'}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {error 
                  ? 'We are currently unable to establish a connection to our media server. Please verify your connection or try again shortly.' 
                  : 'There are currently no video presentations in our collection. Please check back soon as we continuously update our media resources.'}
              </p>
              <button 
                onClick={() => setRetryTrigger(prev => prev + 1)}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-xl transition-all shadow-soft"
              >
                Refresh Gallery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map(video => (
                <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col">
                  <div
                    className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => setPlaying(video)}
                  >
                    {getThumbnailSource(video) ? (
                      <img
                        src={getThumbnailSource(video)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={getVideoSource(video)}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      Video
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()} >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">{playing.title}</h3>
                <p className="text-white/60 text-sm">{playing.category}</p>
              </div>
              <button
                onClick={() => setPlaying(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                aria-label="Close video"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative bg-black rounded-2xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
              {getVideoSource(playing) ? (
                getVideoEmbedUrl(getVideoSource(playing)) ? (
                  <iframe
                    src={getVideoEmbedUrl(getVideoSource(playing))}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={playing.title}
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <video
                    src={getVideoSource(playing)}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <img src={playing.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Play size={36} className="text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Video Player</p>
                    <p className="text-white/60 text-sm">Unable to load playable source</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
