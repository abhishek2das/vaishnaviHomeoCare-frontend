import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Target, Eye, ArrowRight, MapPin, CheckCircle } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { API_ENDPOINTS } from '../api/endpoints'

const locations = [
  { name: 'Medicare Main Clinic', address: 'C-302, Wallfort Woods, Vidhan sabha road, Raipur', beds: 300, type: 'Main Branch' },
]

export default function About() {
  const [description, setDescription] = useState(
    'Founded in 2008 by Dr. Prachi Jha, Medicare Clinic began as a small wellness center with a singular mission: to provide affordable, world-class holistic healthcare to every individual, regardless of their background.'
  )
  const [vision, setVision] = useState(
    'To be the most trusted and innovative healthcare institution in India, setting benchmarks in clinical outcomes, patient experience, and medical education that inspire healthcare systems worldwide.'
  )
  const [mission, setMission] = useState(
    'To deliver compassionate, accessible, and evidence-based healthcare that improves lives. We commit to continuous innovation, dignifying every patient interaction, and developing future medical leaders.'
  )
  const [stats, setStats] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.ABOUT)
        if (!res.ok) throw new Error('Unable to fetch about content')

        const data = await res.json()
        if (data.description) setDescription(data.description)
        if (data.vision) setVision(data.vision)
        if (data.mission) setMission(data.mission)
      } catch (error) {
        console.error('Failed to load about content:', error)
      }
    }

    const loadStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.STATS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch statistics')

        const data = await res.json()
        const statsData = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        const mappedStats = statsData.map((item, index) => ({
          id: item.id ?? `${item.label ?? item.key ?? index}`,
          label: item.label ?? item.key ?? 'Metric',
          value: item.value ?? '',
        }))

        if (mappedStats.length > 0) setStats(mappedStats)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadDoctors = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CMS.DOCTORS.GET_ALL)
        if (!res.ok) throw new Error('Unable to fetch doctors')

        const data = await res.json()
        const doctorsData = Array.isArray(data) ? data : Array.isArray(data.content) ? data.content : []
        const mappedDoctors = doctorsData.map((item, index) => ({
          id: item.id ?? `${item.name ?? item.specialist ?? index}`,
          name: item.name ?? 'Doctor',
          specialist: item.specialist ?? item.role ?? '',
          description: item.shortDescription ?? item.description ?? '',
          image: item.imgUrl ?? item.image ?? '',
        }))

        if (mappedDoctors.length > 0) setDoctors(mappedDoctors)
      } catch (error) {
        console.error('Failed to load doctors:', error)
      }
    }

    loadAbout()
    loadStats()
    loadDoctors()
  }, [])

  const displayDoctors = doctors

  return (
    <div>
      <PageHero
        title="About Vaishnavi Homeo Care"
        subtitle="Where advanced homeopathy meets mental clarity. We treat the whole person, not just the physical symptoms, for a deeper kind of healing."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title mb-5">A Legacy Built on Compassion & Excellence</h2>
              {/* Dynamic content */}
              <p className="text-neutral-500 leading-relaxed mb-5">{description}</p>
              <Link to="/appointment" className="btn-primary">Book a Consultation <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://etimg.etb2bimg.com/photo/101841354.cms" alt="Clinic lobby" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
              <img src="https://shmch-chapra.org/wp-content/uploads/2025/09/homeo.jpg" alt="Doctors" className="rounded-2xl object-cover w-full h-48 shadow-soft mt-6" />
              <img src="https://cns-payload-prod-01-content.global.ssl.fastly.net/payload-media/Naturopathy.webp" alt="Equipment" className="rounded-2xl object-cover w-full h-48 shadow-soft -mt-6" />
              <img src="https://images.unsplash.com/photo-1638988562241-0e40dffe16ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Patient care" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Our Guiding Principles</div>
            <h2 className="section-title">Vision, Mission & Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card p-8 border-t-4 border-primary-500 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={28} className="text-primary-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">Our Vision</h3>
              <p className="text-neutral-500 leading-relaxed">{vision}</p>
            </div>
            <div className="card p-8 border-t-4 border-teal-500 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} className="text-teal-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">Our Mission</h3>
              <p className="text-neutral-500 leading-relaxed">{mission}</p>
            </div>
          </div>
          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Patient First', desc: 'Every decision centers on the best outcome for our patients.', color: 'bg-primary-100 text-primary-600' },
              { label: 'Integrity', desc: 'Transparency and honesty in all clinical and administrative practices.', color: 'bg-teal-100 text-teal-600' },
              { label: 'Innovation', desc: 'Embracing new technologies and research to advance care.', color: 'bg-amber-100 text-amber-600' },
              { label: 'Excellence', desc: 'Uncompromising standards in everything we do.', color: 'bg-rose-100 text-rose-600' },
            ].map(val => (
              <div key={val.label} className="card p-6 text-center hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${val.color}`}>
                  <CheckCircle size={22} />
                </div>
                <h4 className="font-display font-semibold text-neutral-800 mb-2">{val.label}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      {stats.length > 0 && (
      <section className="py-20 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Network at a Glance</h2>
          </div>
          <div className={stats.length <= 2 ? "flex flex-wrap justify-center gap-8 mb-16" : "grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"}>
            {stats.map((stat) => (
              <div key={stat.id} className={`text-center ${stats.length <= 2 ? 'w-full sm:w-56' : ''}`}>
                <div className="text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-100 font-semibold mb-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map(loc => (
              <div key={loc.name} className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={18} className="text-teal-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-teal-300 font-semibold mb-0.5">{loc.type}</div>
                    <h4 className="text-white font-semibold">{loc.name}</h4>
                  </div>
                </div>
                <p className="text-primary-200 text-sm mb-3">{loc.address}</p>
                <div className="text-white text-sm"><span className="font-bold text-lg">{loc.beds}</span> beds</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Team */}
      {displayDoctors.length > 0 && (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Doctors</div>
            <h2 className="section-title">Our Homeopathic Experts</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {displayDoctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-300 p-4 rounded-3xl w-full max-w-[380px] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] text-center group">
                <div className="relative inline-block w-full mb-3">
                  <img
                    src={doctor.image || 'https://images.unsplash.com/photo-1580281657521-8b7aa7c5d4f9?q=80&w=400&auto=format&fit=crop'}
                    alt={doctor.name}
                    className="w-full h-64 rounded-2xl object-cover mx-auto shadow-soft group-hover:shadow-medium transition-all"
                  />
                </div>
                <h3 className="font-display bg-blue-100 py-2 rounded-xl font-semibold text-neutral-800 text-xl mb-2 group-hover:text-primary-600 transition-colors">{doctor.name}</h3>
                <p className="text-lg text-teal-600 font-medium mb-2">{doctor.specialist}</p>
                <p className="text-base text-neutral-800 leading-relaxed">{doctor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
