import { useState, useEffect } from 'react'
import { Trophy, Award, Shield, Heart, Star, Leaf } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { SkeletonCard } from '../components/common/LoadingSkeleton'
import { API_ENDPOINTS } from '../api/endpoints'

const iconMap = { Trophy, Award, Shield, Heart, Star, Leaf }


export default function Awards() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    const loadAwards = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.AWARDS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch awards')

        const awardsData = await res.json()
        const parsedAwards = Array.isArray(awardsData)
          ? awardsData
          : Array.isArray(awardsData.content)
            ? awardsData.content
            : []

        if (parsedAwards.length > 0) {
          setData(parsedAwards.map((item) => ({
            id: item.id,
            title: item.name,
            year: item.year,
            description: item.description,
          })))
        }
      } catch (error) {
        console.error('Failed to load awards:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadAwards()
  }, [])

  return (
    <div>
      <PageHero
        title="Awards & Recognition"
        subtitle="Celebrating excellence in healthcare — our awards reflect our commitment to quality, safety, and innovation."
        breadcrumbs={[{ label: 'Awards' }]}
      />

      {/* Awards Grid */}
      {(loading || data.length > 0) && (
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Our Achievements</div>
            <h2 className="section-title">Honours & Awards</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className={data.length <= 2 ? 'flex flex-wrap justify-center gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
              {data.map((award, i) => {
                const Icon = iconMap[award.icon] || Trophy
                return (
                  <div
                    key={award.id}
                    className={`card p-7 group hover:-translate-y-1 transition-all duration-300 ${data.length <= 2 ? 'w-full sm:w-[360px]' : ''}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-medium transition-all">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-2">
                          {award.year}
                        </div>
                        <h3 className="font-display font-bold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors leading-tight">
                          {award.title}
                        </h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">{award.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Timeline Banner */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">A Journey of Excellence</h2>
          <p className="text-primary-100 mb-8">
            From our first National Healthcare Award in 2008 to today, every recognition fuels our mission to do better for every patient.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { year: '2008', label: 'First National Award' },
              { year: '2014', label: 'JCI Accreditation' },
              { year: '2019', label: 'NABH Gold Status' },
              { year: '2024', label: 'AI Innovation Award' },
            ].map(m => (
              <div key={m.year} className="bg-white/10 border border-white/20 rounded-2xl p-5">
                <div className="text-2xl font-display font-bold text-white mb-1">{m.year}</div>
                <p className="text-primary-200 text-sm">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
