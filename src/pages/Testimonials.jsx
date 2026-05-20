import { useState, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import StarRating from '../components/common/StarRating'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { API_ENDPOINTS } from '../api/endpoints'

const PER_PAGE = 6

export default function Testimonials() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)

  const normalizeTestimonial = (item) => {
    const name = item.name || item.patientName || item.author || 'Patient'
    const text = item.text || item.review || item.message || item.comment || ''
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'PT'

    return {
      ...item,
      id: item.id ?? name,
      name,
      text,
      rating: Number(item.rating ?? item.stars ?? 5),
      location: item.location || item.city || item.state || '',
      date: item.date || item.createdAt || item.postedAt || '',
      treatment: item.treatment || item.specialization || item.category || '',
      avatar: item.avatar || initials,
    }
  }

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.TESTIMONIALS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch testimonials')

        const testimonialsData = await res.json()
        const parsed = Array.isArray(testimonialsData)
          ? testimonialsData
          : Array.isArray(testimonialsData.content)
            ? testimonialsData.content
            : []

        if (parsed.length > 0) {
          setData(parsed.map(normalizeTestimonial))
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  const totalPages = Math.ceil(data.length / PER_PAGE)
  const paginated = data.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <PageHero
        title="Patient Testimonials"
        subtitle="Real stories from real patients — their experiences drive everything we do."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />

      {/* Stats strip */}
      <div className="bg-primary-700 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50,000+', label: 'Happy Patients' },
            { value: '98%', label: 'Recommend Us' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-display font-bold text-white mb-1">{s.value}</div>
              <div className="text-primary-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <p className="text-xl font-semibold text-neutral-800 mb-3">Testimonials data not present.</p>
              <p className="text-sm text-neutral-500">No testimonial records were returned by the API.</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold text-neutral-900">What Our Patients Are Saying</h2>
                <p className="text-sm text-neutral-500 mt-2">Real feedback from people who have experienced our care.</p>
              </div>
              <div className={`grid gap-6 ${
                paginated.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : paginated.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {paginated.map(t => (
                  <div key={t.id} className="card p-7 flex flex-col hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <Quote size={28} className="text-primary-200" />
                      <StarRating rating={t.rating} size={15} />
                    </div>
                    <p className="text-neutral-600 leading-relaxed text-sm flex-1 mb-6 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-5 border-t border-neutral-100">
                      <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">{t.name}</div>
                        <div className="text-xs text-neutral-500">{t.location} · {t.date}</div>
                      </div>
                      <div className="ml-auto">
                        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">{t.treatment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border-2 border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                    page === i + 1 ? 'bg-primary-600 text-white shadow-soft' : 'border-2 border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border-2 border-neutral-200 flex items-center justify-center text-neutral-500 hover:border-primary-300 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
