import { useState, useEffect } from 'react'
import { Calendar, ArrowRight, Search } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { pressReleases } from '../data/mockData'
import { API_ENDPOINTS } from '../api/endpoints'

export default function PressRelease() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')

  const loadPressReleases = async (query = '') => {
    setLoading(true)
    try {
      const queryString = query ? `?search=${encodeURIComponent(query)}` : ''
      const res = await fetch(`${API_ENDPOINTS.PRESS_RELEASES.GET_ALL}${queryString}`)
      if (!res.ok) throw new Error('Unable to fetch blog')

      const responseData = await res.json()
      const parsed = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData.content)
          ? responseData.content
          : []

      setData(parsed)
    } catch (error) {
      console.error('Failed to load Blog:', error)
      setData(pressReleases)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPressReleases()
  }, [])

  const rest = data  

  return (
    <div>
      <PageHero
        title="Blogs"
        subtitle="Latest news, announcements, and updates from Vaishnavi Homeo Care Clinic."
        breadcrumbs={[{ label: 'Blogs' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadPressReleases(search)
            }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-all"
            >
              Search
            </button>
          </form>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">No Blogs found.</div>
          ) : (
            <>
              {/* Blogs list (no featured item) */}

              {/* Rest */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map(pr => (
                    <div key={pr.id} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300 border">
                      {pr.coverImage && (
                        <img
                          src={pr.coverImage}
                          alt={pr.imageAltText || pr.title}
                          loading="lazy"
                          className="object-cover w-full h-44"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs text-neutral-400 ml-auto flex items-center gap-1">
                            <Calendar size={11} /> {pr.publishedDate || pr.date || 'No date'}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors leading-snug text-base">
                          <a
                            href={`/blog/${pr.slug || pr.id}`}
                            title={`Read the full article: ${pr.title}`}
                            className="block text-inherit"
                          >
                            {pr.title}
                          </a>
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed mb-5 line-clamp-3">
                          {pr.metaDescription
                            ? pr.metaDescription
                            : pr.content
                              ? (pr.content.includes('<')
                                  ? pr.content.replace(/<[^>]*>/g, '').slice(0, 140)
                                  : pr.content.slice(0, 140))
                              : 'No content available.'}
                          {pr.content && pr.content.length > 140 ? '...' : ''}
                        </p>
                        <a
                          href={`/blog/${pr.slug || pr.id}`}
                          title={`Read more about ${pr.title}`}
                          className="text-sm font-semibold text-primary-600 flex items-center gap-1.5 hover:gap-2.5 transition-all"
                        >
                          Read More <ArrowRight size={13} />
                        </a>
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
