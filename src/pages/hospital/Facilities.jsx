import { Link } from 'react-router-dom'
import { Ambulance, Microscope, Heart, Baby, Pill, UtensilsCrossed, Wifi, Car, Moon, CreditCard, Globe, BookOpen, Activity, Shield, Users, Phone } from 'lucide-react'
import PageHero from '../../components/common/PageHero'
import { facilities } from '../../data/mockData'

const iconMap = { Ambulance, Microscope, Heart, Baby, Pill, UtensilsCrossed, Wifi, Car, Moon, CreditCard, Globe, BookOpen }

const specialServices = [
  { icon: Activity, title: 'Robotic Surgery', desc: 'State-of-the-art Da Vinci robotic surgical system for minimally invasive procedures with precision unmatched by human hands.', badge: 'New' },
  { icon: Shield, title: 'Infection Control', desc: 'Stringent NABH-compliant infection prevention protocols with dedicated infection control nurses and monthly audits.', badge: null },
  { icon: Users, title: 'Patient Support Groups', desc: 'Structured support programs for chronic disease patients including diabetes, cardiac, oncology, and mental health groups.', badge: null },
  { icon: Phone, title: 'Tele-Medicine', desc: 'Connect with our specialist doctors from anywhere through our secure video consultation platform — available 7 days a week.', badge: 'Popular' },
]

export default function Facilities() {
  return (
    <div>
      <PageHero
        title="Available Facilities"
        subtitle="A comprehensive ecosystem of support services designed to make your hospital experience as comfortable as possible."
        breadcrumbs={[
          { label: 'Hospital', path: '/hospital/infrastructure' },
          { label: 'Facilities' }
        ]}
      />

      {/* Core Facilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Patient Services</div>
            <h2 className="section-title mb-4">Everything You Need, Under One Roof</h2>
            <p className="section-subtitle mx-auto text-center">
              From emergency response to post-discharge support, our facilities are designed to serve at every step of your healthcare journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {facilities.map((facility, i) => {
              const Icon = iconMap[facility.icon] || Shield
              return (
                <div key={facility.title}
                  className="card p-6 group hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:from-primary-100 group-hover:to-teal-100 transition-all">
                    <Icon size={22} className="text-primary-600" />
                  </div>
                  <h3 className="font-display font-bold text-neutral-800 mb-2 text-base group-hover:text-primary-600 transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{facility.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Advanced Services</div>
            <h2 className="section-title">Specialty Programs</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {specialServices.map(({ icon: Icon, title, desc, badge }) => (
              <div key={title} className="card p-7 flex gap-5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon size={26} className="text-primary-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-neutral-800">{title}</h3>
                    {badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge === 'New' ? 'bg-teal-100 text-teal-700' : 'bg-primary-100 text-primary-700'}`}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accommodation Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-label justify-center">Inpatient Care</div>
            <h2 className="section-title">Accommodation Options</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: 'General Ward', price: 'Economy', features: ['4–6 beds per room', 'Shared bathroom', 'Nursing meals included', 'Attendant cot available'], color: 'border-neutral-200' },
              { type: 'Semi-Private', price: 'Standard', features: ['2-bed sharing', 'Shared bathroom', 'TV & Wi-Fi', 'Attendant sofa'], color: 'border-teal-200' },
              { type: 'Private Room', price: 'Premium', features: ['1-bed room', 'Private bathroom', 'LCD TV & Wi-Fi', 'Attendant bed & meals'], color: 'border-primary-200', popular: true },
              { type: 'Deluxe Suite', price: 'Luxury', features: ['Spacious suite', 'Premium bathroom', 'Smart TV & Premium Wi-Fi', 'Lounge area & mini-fridge'], color: 'border-amber-200' },
            ].map(room => (
              <div key={room.type} className={`card p-6 border-2 hover:-translate-y-1 transition-all ${room.color} relative`}>
                {room.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">Most Popular</div>
                )}
                <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">{room.price}</div>
                <h3 className="font-display font-bold text-neutral-800 text-xl mb-4">{room.type}</h3>
                <ul className="space-y-2.5 mb-5">
                  {room.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="block text-center py-2.5 rounded-xl text-sm font-semibold border-2 border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-400 transition-all">
                  Enquire Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-3">Need Help Choosing the Right Option?</h2>
          <p className="text-primary-100 mb-6 text-sm">Our patient care coordinators are available Mon–Sat, 8AM–8PM to guide you.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all">
              Contact Us
            </Link>
            <Link to="/appointment" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
