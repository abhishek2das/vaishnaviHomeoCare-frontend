import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, CalendarDays, Star, Users } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import StarRating from '../components/common/StarRating'
import { doctors } from '../data/mockData'

const specializations = ['All', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Gastroenterologist', 'Endocrinologist', 'Orthopedic Surgeon', 'Psychiatrist', 'General Physician']

export default function Doctors() {
  const [search, setSearch] = useState('')
  const [activeSpec, setActiveSpec] = useState('All')

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase())
    const matchSpec = activeSpec === 'All' || d.specialization === activeSpec
    return matchSearch && matchSpec
  })

  return (
    <div>
      <PageHero
        title="Our Expert Doctors"
        subtitle="Meet our team of 120+ highly qualified specialists dedicated to your health and well-being."
        breadcrumbs={[{ label: 'Our Doctors' }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-11"
                aria-label="Search doctors"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Filter size={16} />
              <span className="font-medium">{filtered.length} doctors found</span>
            </div>
          </div>

          {/* Specialization Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {specializations.map(spec => (
              <button
                key={spec}
                onClick={() => setActiveSpec(spec)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSpec === spec
                    ? 'bg-primary-600 text-white shadow-soft'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Doctor Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(doctor => (
                <div key={doctor.id} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      doctor.available ? 'bg-teal-500 text-white' : 'bg-neutral-400 text-white'
                    }`}>
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-teal-600 font-semibold mb-1">{doctor.specialization}</p>
                    <p className="text-xs text-neutral-400 mb-3">{doctor.experience} Experience</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={doctor.rating} size={13} />
                        <span className="text-xs font-semibold text-neutral-600">{doctor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Users size={12} />
                        {doctor.patients.toLocaleString()} patients
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to="/appointment"
                        className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          doctor.available
                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-medium'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        <CalendarDays size={14} className="inline mr-1.5" />
                        Book
                      </Link>
                      <button className="px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all">
                        Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-neutral-400" />
              </div>
              <h3 className="font-display font-semibold text-neutral-700 mb-2">No doctors found</h3>
              <p className="text-neutral-400 text-sm">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-3xl p-10 shadow-strong">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              Not Sure Which Doctor to See?
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Our care coordinators can help you find the right specialist for your condition.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-soft"
            >
              Talk to a Care Coordinator
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
