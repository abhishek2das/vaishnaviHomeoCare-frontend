import { Link } from 'react-router-dom'
import { Target, Eye, ArrowRight, MapPin, CheckCircle } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import { teamMembers } from '../data/mockData'

const networkStats = [
  { value: '3', label: 'Clinic Branches', sub: 'Across Delhi NCR' },
  { value: '500+', label: 'Holistic Treatments', sub: 'Across all facilities' },
  { value: '120+', label: 'Homeopathic Practitioners', sub: 'Across 25 specialties' },
  { value: '1,200+', label: 'Support Staff', sub: 'Caregivers, technicians, admin' },
]

const locations = [
  { name: 'Medicare Main Clinic', address: '42, Healthcare Avenue, Connaught Place, New Delhi', beds: 300, type: 'Main Branch' },
  { name: 'Medicare North Clinic', address: '15, Rohini Sector 9, New Delhi', beds: 150, type: 'Secondary Branch' },
  { name: 'Medicare Noida Center', address: 'Plot 7, Sector 62, Noida, UP', beds: 100, type: 'Specialty Center' },
]

export default function About() {
  return (
    <div>
      <PageHero
        title="About Medicare Clinic"
        subtitle="Three decades of holistic healing, natural innovation, and compassionate care — built on a foundation of trust and clinical excellence."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title mb-5">A Legacy Built on Compassion & Excellence</h2>
              <p className="text-neutral-500 leading-relaxed mb-5">
                Founded in 1985 by Dr. Ramesh Agarwal, Medicare Clinic began as a small wellness center with a singular mission: to provide affordable, world-class holistic healthcare to every individual, regardless of their background.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-5">
                Over 38 years, we have grown into one of India's most respected homeopathic clinic networks, with three branches across Delhi NCR, serving over 50,000 patients annually with the same commitment that drove our founding.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Today, Medicare Clinic is recognized globally — a testament to our relentless pursuit of quality, natural healing, and patient satisfaction.
              </p>
              <Link to="/appointment" className="btn-primary">Book a Consultation <ArrowRight size={16} /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop" alt="Clinic lobby" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop" alt="Doctors" className="rounded-2xl object-cover w-full h-48 shadow-soft mt-6" />
              <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop" alt="Equipment" className="rounded-2xl object-cover w-full h-48 shadow-soft -mt-6" />
              <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop" alt="Patient care" className="rounded-2xl object-cover w-full h-48 shadow-soft" />
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
              <p className="text-neutral-500 leading-relaxed">
                To be the most trusted and innovative healthcare institution in India, setting benchmarks in clinical outcomes, patient experience, and medical education that inspire healthcare systems worldwide.
              </p>
            </div>
            <div className="card p-8 border-t-4 border-teal-500 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} className="text-teal-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-800 mb-4">Our Mission</h3>
              <p className="text-neutral-500 leading-relaxed">
                To deliver compassionate, accessible, and evidence-based healthcare that improves lives. We commit to continuous innovation, dignifying every patient interaction, and developing future medical leaders.
              </p>
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
      <section className="py-20 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Network at a Glance</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {networkStats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-100 font-semibold mb-1">{stat.label}</div>
                <div className="text-primary-300 text-sm">{stat.sub}</div>
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

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Leadership</div>
            <h2 className="section-title">Our Leadership Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="text-center group">
                <div className="relative inline-block mb-4">
                  <img src={member.image} alt={member.name}
                    className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-soft group-hover:shadow-medium transition-all" />
                </div>
                <h3 className="font-display font-semibold text-neutral-800 mb-1 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                <p className="text-sm text-teal-600 font-medium mb-1">{member.role}</p>
                <p className="text-xs text-neutral-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
