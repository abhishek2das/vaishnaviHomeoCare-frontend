import { useState, useEffect } from 'react'
import { Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { pressReleases } from '../data/mockData'

const categories = ['All', 'Innovation', 'Partnership', 'Infrastructure', 'CSR', 'Achievement', 'Services']

export default function PressRelease() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setData(pressReleases); setLoading(false) }, 800)
    return () => clearTimeout(t)
  }, [])

  const filtered = data.filter(p => {
    const matchCat = filter === 'All' || p.category === filter
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      <PageHero
        title="Press Releases"
        subtitle="Latest news, announcements, and updates from Medicare Clinic."
        breadcrumbs={[{ label: 'Press Release' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search press releases..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
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
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">No press releases found.</div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="card mb-10 group hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-2/5 bg-gradient-to-br from-primary-600 to-teal-600 flex items-center justify-center p-12 min-h-48">
                      <div className="text-center text-white">
                        <div className="text-5xl font-display font-bold mb-2">PRESS</div>
                        <div className="text-primary-200 tracking-widest text-sm uppercase">Release</div>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">{featured.category}</span>
                        <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Calendar size={13} /> {featured.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Clock size={13} /> {featured.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl font-display font-bold text-neutral-800 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-neutral-500 leading-relaxed mb-6">{featured.excerpt}</p>
                      <button className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm hover:gap-3 transition-all">
                        Read Full Release <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(pr => (
                    <div key={pr.id} className="card p-6 group hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full flex items-center gap-1">
                          <Tag size={10} /> {pr.category}
                        </span>
                        <span className="text-xs text-neutral-400 ml-auto flex items-center gap-1">
                          <Calendar size={11} /> {pr.date}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors leading-snug text-base">
                        {pr.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed mb-5 line-clamp-3">{pr.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1"><Clock size={11} /> {pr.readTime}</span>
                        <button className="text-sm font-semibold text-primary-600 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                          Read More <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
