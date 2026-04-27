import { useState, useEffect } from 'react'
import { Play, Clock, Eye, X } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { videos } from '../data/mockData'

const categories = ['All', 'Cardiology', 'Surgery', 'Patient Stories', 'Mental Health', 'Diabetes', 'Clinic Tour']

export default function VideoGallery() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('All')
  const [playing, setPlaying] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => { setData(videos); setLoading(false) }, 800)
    return () => clearTimeout(t)
  }, [])

  const filtered = data.filter(v => filter === 'All' || v.category === filter)

  return (
    <div>
      <PageHero
        title="Video Gallery"
        subtitle="Watch educational content, patient stories, and facility tours from Medicare Clinic."
        breadcrumbs={[{ label: 'Video Gallery' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === cat ? 'bg-primary-600 text-white shadow-soft' : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(video => (
                <div key={video.id} className="card group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => setPlaying(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-strong group-hover:scale-110 transition-all">
                        <Play size={22} className="text-primary-600 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-semibold flex items-center gap-1">
                      <Clock size={11} /> {video.duration}
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600/90 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                      {video.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Eye size={13} /> {video.views} views
                      </div>
                      <button
                        onClick={() => setPlaying(video)}
                        className="text-sm font-semibold text-primary-600 flex items-center gap-1.5 hover:gap-2.5 transition-all"
                      >
                        <Play size={13} fill="currentColor" /> Watch Now
                      </button>
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
          <div
            className="max-w-3xl w-full"
            onClick={e => e.stopPropagation()}
          >
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
            {/* Video placeholder */}
            <div className="relative bg-black rounded-2xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img src={playing.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Play size={36} className="text-white ml-1" fill="white" />
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">Video Player</p>
                  <p className="text-white/60 text-sm">Connect a real video source for production use</p>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1 justify-center"><Clock size={11} /> {playing.duration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
